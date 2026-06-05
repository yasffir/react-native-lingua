import { Lesson } from "@/types/learning";
import { useAuth, useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
let Call: any, CallClosedCaption: any, StreamCall: any, StreamVideo: any, StreamVideoClient: any, useCallStateHooks: any;
try {
  const mod = require("@stream-io/video-react-native-sdk");
  Call = mod.Call;
  CallClosedCaption = mod.CallClosedCaption;
  StreamCall = mod.StreamCall;
  StreamVideo = mod.StreamVideo;
  StreamVideoClient = mod.StreamVideoClient;
  useCallStateHooks = mod.useCallStateHooks;
} catch {
  // Native module not available — ai-teacher screen will show an error state
}
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState, useMemo } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "@/constants/images";
import {
  VocabDrillCard,
  type VocabDrillPhase,
} from "@/components/ai-teacher/VocabDrillCard";
import { LiveCaptionsPanel } from "@/components/ai-teacher/LiveCaptionsPanel";
import { colors } from "@/constants/theme";
import { buildUsagePhrases } from "@/lib/aiTeacher/buildUsagePhrases";
import { matchesSpokenWord } from "@/lib/aiTeacher/matchSpokenWord";
import { playWord, setAudioPlayContext } from "@/lib/audio";
import { useLodEntry } from "@/hooks/useLodEntry";
import { useLiveCaptions } from "@/hooks/useLiveCaptions";
import { useLearningProgress } from "@/hooks/useLearningProgress";
import { useLesson } from "@/hooks/useLesson";
import { posthog } from "@/lib/posthog";
import { useDailyPlanStore } from "@/store/dailyPlanStore";
import { useLanguageStore } from "@/store/languageStore";

type CallStatus = "idle" | "connecting" | "joined" | "error";
type AgentStatus = "idle" | "connecting" | "connected" | "failed";

const AGENT_USER_ID = "ai-teacher";
const MIN_LESSON_SECONDS = 30;

const VOCAB_DRILL_PROMPT_SUFFIX =
  "\n\nVOCAB DRILL: The mobile app plays official native Luxembourgish audio for each vocabulary word and shows real example sentences from the LOD dictionary. Coach the student in English only — briefly explain WHEN to use the word (café, family, greetings, etc.) in one short sentence. Do not pronounce Luxembourgish vocabulary yourself; wait while the student repeats after the native audio clip.";

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const { selectedLanguage } = useLanguageStore();
  const { lesson, lessonIndex, loading: lessonLoading } = useLesson(id);
  const { recordLessonComplete, completedLessonIds } = useLearningProgress();

  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<Call | null>(null);
  const [callStatus, setCallStatus] = useState<CallStatus>("idle");
  const [agentStatus, setAgentStatus] = useState<AgentStatus>("idle");
  const [agentErrorMessage, setAgentErrorMessage] = useState<string | null>(
    null
  );

  const callRef = useRef<Call | null>(null);
  const clientRef = useRef<StreamVideoClient | null>(null);
  const agentSessionRef = useRef<string | null>(null);
  const lessonStartTimeRef = useRef<number | null>(null);
  const abandonedRef = useRef(false);
  const lessonCompletedRef = useRef(false);
  const agentConnectedRef = useRef(false);
  const recordLessonCompleteRef = useRef(recordLessonComplete);
  const completedLessonIdsRef = useRef(completedLessonIds);
  recordLessonCompleteRef.current = recordLessonComplete;
  completedLessonIdsRef.current = completedLessonIds;

  useEffect(() => {
    if (!isLoaded || !user || !lesson) return;

    lessonStartTimeRef.current = Date.now();
    abandonedRef.current = false;
    const lessonNumber = lessonIndex >= 0 ? lessonIndex + 1 : 1;
    posthog.capture("lesson_started", {
      lesson_id: lesson.id,
      language: selectedLanguage ?? lesson.id.split("-")[0],
      lesson_number: lessonNumber,
    });

    startCall();

    return () => {
      void finalizeLesson(lesson, lessonIndex);
      callRef.current?.leave().catch(console.error);
      clientRef.current?.disconnectUser().catch(console.error);
      stopAgentSession(callRef.current?.id ?? null, agentSessionRef.current);
    };
  }, [isLoaded, user, lesson]);

  async function startCall() {
    if (!user || !lesson) return;
    setCallStatus("connecting");

    try {
      const clerkToken = await getToken();
      if (!clerkToken) throw new Error("Not authenticated");
      const res = await fetch("/api/stream-token", {
        headers: { Authorization: `Bearer ${clerkToken}` },
      });
      if (!res.ok) throw new Error("Token fetch failed");
      const { token, apiKey } = await res.json();

      const streamClient = StreamVideoClient.getOrCreateInstance({
        apiKey,
        token,
        user: {
          id: user.id,
          name: user.fullName ?? user.id,
          image: user.imageUrl || undefined,
        },
      });

      const callId = `lesson-${lesson.id}-${user.id}`;
      const streamCall = streamClient.call("default", callId);
      await streamCall.join({ create: true });

      // Mute mic immediately — push-to-talk mode prevents echo
      try {
        await streamCall.microphone.disable();
      } catch {}

      const language = selectedLanguage ?? (lesson.id.split("-")[0] as string);
      try {
        await streamCall.update({
          custom: {
            lesson_id: lesson.id,
            lesson_title: lesson.title,
            language,
            goals: lesson.goals.map((g) => g.description),
            vocabulary: lesson.vocabulary.map(
              (v) => `${v.word}: ${v.translation}`,
            ),
            phrases: lesson.phrases.map((p) => p.text),
            topics: lesson.aiTeacherPrompt.topics,
            system_prompt:
              lesson.aiTeacherPrompt.systemPrompt + VOCAB_DRILL_PROMPT_SUFFIX,
            intro_message: lesson.aiTeacherPrompt.introMessage,
          },
        });
      } catch (updateErr) {
        console.warn(
          "[lesson] call.update failed (agent will use default prompts):",
          updateErr,
        );
      }

      // Start live captions — transcribes both teacher and student speech in real time
      try {
        await streamCall.startClosedCaptions();
      } catch (e) {
        console.warn("[lesson] startClosedCaptions failed:", e);
      }

      callRef.current = streamCall;
      clientRef.current = streamClient;
      setClient(streamClient);
      setCall(streamCall);
      setCallStatus("joined");

      startAgentSession(callId);
    } catch (err) {
      console.error("Stream call error:", err);
      setCallStatus("error");
    }
  }

  async function startAgentSession(callId: string) {
    setAgentStatus("connecting");
    setAgentErrorMessage(null);
    try {
      const res = await fetch("/api/agent-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ callId, callType: "default" }),
      });
      if (res.ok) {
        const { session_id } = await res.json();
        agentSessionRef.current = session_id ?? null;
        setAgentStatus("connected");
        agentConnectedRef.current = true;
      } else {
        const errBody = await res.json().catch(() => ({}));
        const message =
          typeof errBody.error === "string"
            ? errBody.error
            : "Agent session failed";
        console.error("[lesson] agent-session failed:", res.status, errBody);
        setAgentErrorMessage(message);
        setAgentStatus("failed");
      }
    } catch (err) {
      console.error("[lesson] agent-session network error:", err);
      setAgentErrorMessage("Could not reach the agent API.");
      setAgentStatus("failed");
    }
  }

  function stopAgentSession(callId: string | null, sessionId: string | null) {
    if (!callId || !sessionId) return;
    fetch(
      `/api/agent-session?callId=${encodeURIComponent(callId)}&sessionId=${encodeURIComponent(sessionId)}`,
      { method: "DELETE" },
    ).catch(() => {});
  }

  async function finalizeLesson(
    currentLesson: Lesson | null | undefined,
    index: number
  ) {
    if (lessonCompletedRef.current || !currentLesson) return;

    const seconds = lessonStartTimeRef.current
      ? Math.floor((Date.now() - lessonStartTimeRef.current) / 1000)
      : 0;

    if (!agentConnectedRef.current || seconds < MIN_LESSON_SECONDS) {
      if (!abandonedRef.current) {
        abandonedRef.current = true;
        posthog.capture("lesson_abandoned", {
          lesson_id: currentLesson.id,
          time_into_lesson_seconds: seconds,
          last_question_index: 0,
        });
      }
      return;
    }

    useDailyPlanStore.getState().markComplete("ai-conversation");

    if (completedLessonIdsRef.current.includes(currentLesson.id)) {
      lessonCompletedRef.current = true;
      return;
    }

    try {
      const didComplete = await recordLessonCompleteRef.current(
        currentLesson.id,
        currentLesson.xpReward
      );
      if (didComplete) {
        lessonCompletedRef.current = true;
        abandonedRef.current = true;
        posthog.capture("lesson_completed", {
          lesson_id: currentLesson.id,
          language: selectedLanguage ?? currentLesson.id.split("-")[0],
          lesson_number: index >= 0 ? index + 1 : 1,
          xp_earned: currentLesson.xpReward,
          time_in_lesson_seconds: seconds,
        });
      }
    } catch (err) {
      console.warn("[lesson] progress save failed:", err);
    }
  }

  async function handleLeave() {
    await finalizeLesson(lesson, lessonIndex);
    const callId = callRef.current?.id ?? null;
    const sessionId = agentSessionRef.current;
    try {
      await callRef.current?.leave();
      clientRef.current?.disconnectUser();
    } catch {}
    callRef.current = null;
    clientRef.current = null;
    agentSessionRef.current = null;
    stopAgentSession(callId, sessionId);
    router.back();
  }

  if (lessonLoading) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: colors.neutral.background }}
      >
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator size="large" color={colors.primary.purple} />
        </View>
      </SafeAreaView>
    );
  }

  if (!lesson) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: colors.neutral.background }}
      >
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text
            style={{
              fontFamily: "Poppins-Regular",
              fontSize: 14,
              color: colors.neutral.textSecondary,
            }}
          >
            Lesson not found
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const displayStatus = getDisplayStatus(callStatus, agentStatus);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header — back left, title center, end call right */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleLeave}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={colors.neutral.textPrimary}
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>AI Teacher</Text>

        <TouchableOpacity
          style={styles.endCallButton}
          onPress={handleLeave}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons
            name="call"
            size={18}
            color="#fff"
            style={{ transform: [{ rotate: "135deg" }] }}
          />
        </TouchableOpacity>
      </View>

      {/* Agent status row */}
      <View style={styles.statusRow}>
        <View
          style={[styles.onlineDot, { backgroundColor: displayStatus.color }]}
        />
        <Text style={[styles.onlineText, { color: displayStatus.color }]}>
          {displayStatus.label}
        </Text>
      </View>

      {/* Call area + push-to-talk — inside StreamCall so useCallClosedCaptions works */}
      {callStatus === "joined" && client && call ? (
        <StreamVideo client={client}>
          <StreamCall call={call}>
            <ActiveCallContent
              agentStatus={agentStatus}
              agentErrorMessage={agentErrorMessage}
              lesson={lesson}
              call={call}
              onRetry={() => startAgentSession(call.id)}
            />
          </StreamCall>
        </StreamVideo>
      ) : (
        <>
          {/* Pre-join state: no stream context yet */}
          <View style={styles.callArea}>
            <Image
              source={images.mascotWelcome}
              contentFit="contain"
              style={[styles.mascot, { opacity: 0.5 }]}
            />
            {callStatus === "connecting" && (
              <View style={styles.responseBubble}>
                <ActivityIndicator
                  size="small"
                  color={colors.primary.purple}
                  style={{ marginRight: 12 }}
                />
                <View style={styles.responseBubbleText}>
                  <Text style={styles.responsePrimary}>Connecting...</Text>
                  <Text style={styles.responseSecondary}>
                    Setting up your lesson
                  </Text>
                </View>
              </View>
            )}
            {callStatus === "error" && (
              <View style={styles.responseBubble}>
                <View style={styles.responseBubbleText}>
                  <Text style={styles.responsePrimary}>Connection failed</Text>
                  <Text style={styles.responseSecondary}>Tap to retry</Text>
                </View>
                <TouchableOpacity
                  style={styles.retryButton}
                  onPress={startCall}
                >
                  <Ionicons
                    name="refresh-outline"
                    size={20}
                    color={colors.primary.purple}
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
          <View style={styles.pushToTalkSection}>
            <DisabledMicButton callStatus={callStatus} />
          </View>
        </>
      )}

      {/* Session feedback */}
      <View style={styles.feedbackRow}>
        <View style={styles.feedbackItem}>
          <Text style={styles.feedbackLabel}>Speaking</Text>
          <Text
            style={[styles.feedbackValue, { color: colors.semantic.success }]}
          >
            Excellent
          </Text>
        </View>
        <View style={styles.feedbackDivider} />
        <View style={styles.feedbackItem}>
          <Text style={styles.feedbackLabel}>Pronunciation</Text>
          <Text style={[styles.feedbackValue, { color: colors.primary.blue }]}>
            Great
          </Text>
        </View>
        <View style={styles.feedbackDivider} />
        <View style={styles.feedbackItem}>
          <Text style={styles.feedbackLabel}>Grammar</Text>
          <Text
            style={[styles.feedbackValue, { color: colors.primary.purple }]}
          >
            Good
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

// Rendered inside StreamCall
function ActiveCallContent({
  agentStatus,
  agentErrorMessage,
  lesson,
  call,
  onRetry,
}: {
  agentStatus: AgentStatus;
  agentErrorMessage: string | null;
  lesson: Lesson;
  call: Call;
  onRetry: () => void;
}) {
  const { useMicrophoneState, useCallClosedCaptions } = useCallStateHooks();
  const { microphone } = useMicrophoneState();
  const captions = useCallClosedCaptions();
  const [isHeld, setIsHeld] = useState(false);
  const [vocabIndex, setVocabIndex] = useState(0);
  const [drillPhase, setDrillPhase] = useState<VocabDrillPhase>("loading");
  const [lastHeard, setLastHeard] = useState<string>("");
  const drillStartedRef = useRef(false);
  const vocabPlayRequestRef = useRef(0);

  const vocabItems = lesson.vocabulary;
  const hasVocabDrill = vocabItems.length > 0;
  const currentVocab = vocabItems[vocabIndex] ?? null;
  const drillComplete = drillPhase === "complete";

  const { entry: lodEntry, loading: lodLoading } = useLodEntry(
    hasVocabDrill ? currentVocab?.audioId : undefined
  );

  const usagePhrases = useMemo(
    () =>
      buildUsagePhrases(
        currentVocab,
        lodEntry,
        lesson.aiTeacherPrompt.topics
      ),
    [currentVocab, lodEntry, lesson.aiTeacherPrompt.topics]
  );

  const { lines: captionLines, getLatestUserSpeech } = useLiveCaptions({
    call,
    captions,
    agentUserId: AGENT_USER_ID,
    enabled: agentStatus === "connected",
  });

  useEffect(() => {
    setAudioPlayContext("duringCall");
    return () => setAudioPlayContext("default");
  }, []);

  useEffect(() => {
    if (agentStatus !== "connected" || !hasVocabDrill || drillComplete) return;
    if (!currentVocab) return;

    let cancelled = false;
    const requestId = ++vocabPlayRequestRef.current;
    setDrillPhase("loading");

    void playWord(currentVocab.audioId, { context: "duringCall" }).then(
      (played) => {
        if (cancelled || requestId !== vocabPlayRequestRef.current) return;
        setDrillPhase("speak");
        if (!played) {
          console.warn("[ai-teacher] vocab audio failed to play");
        }
      }
    );

    return () => {
      cancelled = true;
    };
  }, [agentStatus, vocabIndex, currentVocab?.audioId, hasVocabDrill, drillComplete]);

  useEffect(() => {
    if (
      agentStatus === "connected" &&
      hasVocabDrill &&
      !drillStartedRef.current
    ) {
      drillStartedRef.current = true;
      posthog.capture("ai_teacher_vocab_drill_started", {
        lesson_id: lesson.id,
        word_count: vocabItems.length,
      });
    }
  }, [agentStatus, hasVocabDrill, lesson.id, vocabItems.length]);

  function replayCurrentWord() {
    if (!currentVocab) return;
    setDrillPhase("loading");
    void playWord(currentVocab.audioId, { context: "duringCall" }).then(() =>
      setDrillPhase("speak")
    );
  }

  function advanceVocab() {
    if (vocabIndex + 1 >= vocabItems.length) {
      setDrillPhase("complete");
      posthog.capture("ai_teacher_vocab_drill_completed", {
        lesson_id: lesson.id,
        word_count: vocabItems.length,
      });
      return;
    }
    setVocabIndex((index) => index + 1);
    setLastHeard("");
  }

  const isReady =
    agentStatus === "connected" &&
    (!hasVocabDrill || drillPhase === "speak" || drillComplete);
  const showLiveCaptions = agentStatus === "connected";

  function handlePressIn() {
    if (!isReady) return;
    if (hasVocabDrill && !drillComplete && drillPhase !== "speak") return;
    setIsHeld(true);
    microphone.enable();
  }

  async function handlePressOut() {
    setIsHeld(false);
    microphone.disable();

    if (!hasVocabDrill || drillPhase !== "speak" || !currentVocab) return;

    setDrillPhase("checking");
    await new Promise((resolve) => setTimeout(resolve, 700));

    const heard = getLatestUserSpeech();
    setLastHeard(heard || "—");

    if (matchesSpokenWord(heard, currentVocab.word)) {
      setDrillPhase("correct");
      posthog.capture("ai_teacher_vocab_word_matched", {
        lesson_id: lesson.id,
        word: currentVocab.word,
        heard,
      });
    } else {
      setDrillPhase("retry");
      posthog.capture("ai_teacher_vocab_word_retry", {
        lesson_id: lesson.id,
        word: currentVocab.word,
        heard,
      });
    }
  }

  return (
    <>
      {/* Call area */}
      <View style={styles.callArea}>
        <Image
          source={images.mascotWelcome}
          contentFit="contain"
          style={[
            styles.mascot,
            agentStatus === "connecting" && { opacity: 0.5 },
          ]}
        />

        <LiveCaptionsPanel
          lines={captionLines}
          visible={showLiveCaptions}
          emptyHint={
            hasVocabDrill && !drillComplete
              ? "Luna's tips and your speech will show here live."
              : "Live captions appear here as you and Luna speak."
          }
        />

        {agentStatus === "connecting" && (
          <View style={styles.responseBubble}>
            <ActivityIndicator
              size="small"
              color={colors.primary.purple}
              style={{ marginRight: 12 }}
            />
            <View style={styles.responseBubbleText}>
              <Text style={styles.responsePrimary}>Starting lesson...</Text>
              <Text style={styles.responseSecondary}>
                Your AI teacher is joining
              </Text>
            </View>
          </View>
        )}

        {agentStatus === "failed" && (
          <View style={styles.responseBubble}>
            <View style={styles.responseBubbleText}>
              <Text style={styles.responsePrimary}>Agent unavailable</Text>
              <Text style={styles.responseSecondary}>
                {agentErrorMessage?.includes("vision-agent:serve")
                  ? "Run bun run vision-agent:serve in another terminal, then tap retry."
                  : agentErrorMessage ?? "Tap to retry"}
              </Text>
            </View>
            <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
              <Ionicons
                name="refresh-outline"
                size={20}
                color={colors.primary.purple}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {hasVocabDrill && agentStatus === "connected" ? (
        <VocabDrillCard
          item={currentVocab ?? vocabItems[vocabItems.length - 1]!}
          index={drillComplete ? vocabItems.length - 1 : vocabIndex}
          total={vocabItems.length}
          phase={drillPhase}
          usagePhrases={usagePhrases}
          usageLoading={lodLoading}
          lastHeard={lastHeard}
          onReplay={replayCurrentWord}
          onNext={advanceVocab}
          onSkip={advanceVocab}
        />
      ) : null}

      {/* Push-to-talk */}
      <View style={styles.pushToTalkSection}>
        <View style={styles.pushToTalkContainer}>
          <Pressable
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={!isReady}
            style={({ pressed }) => [
              styles.micButtonOuter,
              (pressed || isHeld) && styles.micButtonOuterActive,
            ]}
          >
            {({ pressed }) => {
              const active = pressed || isHeld;
              return (
                <View
                  style={[
                    styles.micButton,
                    active && styles.micButtonActive,
                    !isReady && styles.micButtonDisabled,
                  ]}
                >
                  {agentStatus === "connecting" ? (
                    <ActivityIndicator
                      size="small"
                      color={colors.primary.purple}
                    />
                  ) : (
                    <Ionicons
                      name={active ? "mic" : "mic-outline"}
                      size={34}
                      color={
                        active
                          ? "#fff"
                          : isReady
                            ? colors.neutral.textPrimary
                            : colors.neutral.textSecondary
                      }
                    />
                  )}
                </View>
              );
            }}
          </Pressable>
          <Text
            style={[
              styles.pushToTalkLabel,
              isHeld && { color: colors.primary.purple },
            ]}
          >
            {isHeld
              ? "Listening..."
              : drillComplete
                ? "Free practice with Luna"
                : hasVocabDrill && drillPhase === "speak"
                  ? `Say: ${currentVocab?.word ?? ""}`
                  : hasVocabDrill && drillPhase === "loading"
                    ? "Listen to native audio…"
                    : isReady
                      ? "Push & hold to speak"
                      : "Waiting for teacher..."}
          </Text>
        </View>
      </View>
    </>
  );
}

function getDisplayStatus(
  callStatus: CallStatus,
  agentStatus: AgentStatus,
): { color: string; label: string } {
  if (callStatus === "joined") {
    const map: Record<AgentStatus, { color: string; label: string }> = {
      idle: { color: colors.neutral.textSecondary, label: "Setting up..." },
      connecting: {
        color: colors.semantic.warning,
        label: "Joining lesson...",
      },
      connected: { color: colors.semantic.success, label: "Online" },
      failed: { color: colors.semantic.error, label: "Agent unavailable" },
    };
    return map[agentStatus];
  }
  const map: Record<CallStatus, { color: string; label: string }> = {
    idle: { color: colors.neutral.textSecondary, label: "Starting..." },
    connecting: { color: colors.semantic.warning, label: "Connecting..." },
    joined: { color: colors.semantic.success, label: "Online" },
    error: { color: colors.semantic.error, label: "Connection failed" },
  };
  return map[callStatus];
}

function DisabledMicButton({ callStatus }: { callStatus: CallStatus }) {
  return (
    <View style={styles.pushToTalkContainer}>
      <View style={styles.micButtonOuter}>
        <View style={[styles.micButton, styles.micButtonDisabled]}>
          {callStatus === "connecting" ? (
            <ActivityIndicator size="small" color={colors.primary.purple} />
          ) : (
            <Ionicons
              name="mic-outline"
              size={34}
              color={colors.neutral.textSecondary}
            />
          )}
        </View>
      </View>
      <Text style={styles.pushToTalkLabel}>
        {callStatus === "error" ? "Connection failed" : "Setting up..."}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 6,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
    color: colors.neutral.textPrimary,
  },
  endCallButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#E8453C",
    alignItems: "center",
    justifyContent: "center",
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  onlineText: {
    fontFamily: "Poppins-Medium",
    fontSize: 13,
  },
  callArea: {
    flex: 1,
    marginHorizontal: 16,
    borderRadius: 24,
    backgroundColor: "#F4F2FF",
    overflow: "hidden",
    position: "relative",
  },
  mascot: {
    position: "absolute",
    top: 0,
    bottom: 220,
    left: -20,
    right: -20,
  },
  responseBubble: {
    position: "absolute",
    bottom: 14,
    left: 14,
    right: 14,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  responseBubbleText: {
    flex: 1,
  },
  responsePrimary: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 15,
    color: colors.neutral.textPrimary,
  },
  responseSecondary: {
    fontFamily: "Poppins-Regular",
    fontSize: 13,
    color: colors.neutral.textSecondary,
    marginTop: 1,
  },
  retryButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EDE9FE",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  // Push-to-talk
  pushToTalkSection: {
    paddingVertical: 28,
    alignItems: "center",
  },
  pushToTalkContainer: {
    alignItems: "center",
    gap: 14,
  },
  micButtonOuter: {
    width: 104,
    height: 104,
    borderRadius: 52,
    borderWidth: 3,
    borderColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  micButtonOuterActive: {
    borderColor: "#C4B5FD",
    backgroundColor: "#F5F3FF",
  },
  micButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.neutral.surface,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  micButtonActive: {
    backgroundColor: colors.primary.purple,
    shadowColor: colors.primary.purple,
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 8,
  },
  micButtonDisabled: {
    opacity: 0.5,
  },
  pushToTalkLabel: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    color: colors.neutral.textSecondary,
  },
  // Feedback row
  feedbackRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 20,
    marginHorizontal: 16,
    marginTop: 4,
    backgroundColor: "#fff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.neutral.border,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  feedbackItem: {
    flex: 1,
    alignItems: "center",
    gap: 3,
  },
  feedbackLabel: {
    fontFamily: "Poppins-Regular",
    fontSize: 12,
    color: colors.neutral.textSecondary,
  },
  feedbackValue: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 13,
  },
  feedbackDivider: {
    width: 1,
    height: 32,
    backgroundColor: colors.neutral.border,
  },
});
