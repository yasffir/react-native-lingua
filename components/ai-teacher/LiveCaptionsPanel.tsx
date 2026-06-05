import { useEffect, useMemo, useRef, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { colors, fontFamily } from "@/constants/theme";
import type { LiveCaptionLine } from "@/lib/aiTeacher/liveCaptions";

interface LiveCaptionsPanelProps {
  lines: LiveCaptionLine[];
  visible: boolean;
  emptyHint?: string;
}

export function LiveCaptionsPanel({
  lines,
  visible,
  emptyHint = "Live captions appear here as you and Luna speak.",
}: LiveCaptionsPanelProps) {
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (!visible || lines.length === 0) return;
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [lines, visible]);

  if (!visible) return null;

  return (
    <View style={styles.panel}>
      <View style={styles.headerRow}>
        <View style={styles.liveDot} />
        <Text style={styles.headerLabel}>Live captions</Text>
      </View>

      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {lines.length === 0 ? (
          <Text style={styles.emptyHint}>{emptyHint}</Text>
        ) : (
          lines.map((line) => {
            const isTeacher = line.speaker === "agent";
            return (
              <View
                key={line.id}
                style={[
                  styles.bubble,
                  isTeacher ? styles.bubbleTeacher : styles.bubbleUser,
                  line.isLive ? styles.bubbleLive : null,
                ]}
              >
                <Text
                  style={[
                    styles.speaker,
                    isTeacher ? styles.speakerTeacher : styles.speakerUser,
                  ]}
                >
                  {isTeacher ? "Luna" : "You"}
                  {line.isLive ? " · speaking…" : ""}
                </Text>
                <Text
                  style={[
                    styles.text,
                    isTeacher ? styles.textTeacher : styles.textUser,
                  ]}
                >
                  {line.text}
                </Text>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    position: "absolute",
    bottom: 12,
    left: 12,
    right: 12,
    maxHeight: 210,
    backgroundColor: "rgba(255,255,255,0.96)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.neutral.border,
    paddingTop: 10,
    paddingHorizontal: 10,
    paddingBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.semantic.success,
  },
  headerLabel: {
    fontFamily: fontFamily.semiBold,
    fontSize: 11,
    color: colors.neutral.textSecondary,
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  scroll: {
    maxHeight: 160,
  },
  scrollContent: {
    gap: 6,
    paddingBottom: 4,
  },
  emptyHint: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    lineHeight: 18,
    color: colors.neutral.textSecondary,
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  bubble: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  bubbleTeacher: {
    backgroundColor: colors.primary.purple,
    alignSelf: "flex-start",
    maxWidth: "92%",
  },
  bubbleUser: {
    backgroundColor: "#F3F4F6",
    alignSelf: "flex-end",
    maxWidth: "92%",
  },
  bubbleLive: {
    opacity: 0.92,
  },
  speaker: {
    fontFamily: fontFamily.semiBold,
    fontSize: 10,
    marginBottom: 2,
  },
  speakerTeacher: {
    color: "rgba(255,255,255,0.75)",
  },
  speakerUser: {
    color: colors.neutral.textSecondary,
  },
  text: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    lineHeight: 20,
  },
  textTeacher: {
    color: "#fff",
  },
  textUser: {
    color: colors.neutral.textPrimary,
  },
});
