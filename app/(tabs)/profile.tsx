import { useAuth, useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AchievementsModal } from "@/components/AchievementsModal";
import { EditProfileModal } from "@/components/EditProfileModal";
import { colors, fontFamily } from "@/constants/theme";
import { LANGUAGES } from "@/data/languages";
import { useLearningProgress } from "@/hooks/useLearningProgress";
import { useProfile } from "@/hooks/useProfile";
import { posthog } from "@/lib/posthog";
import { TRANSLATION_LANGUAGES } from "@/lib/translation";
import { useLanguageStore } from "@/store/languageStore";

const DUO_BLUE = "#1CB0F6";

function formatJoined(iso: string | null | undefined): string {
  if (!iso) return "Joined recently";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "Joined recently";
  return `Joined ${date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })}`;
}

function displayName(
  first: string | null | undefined,
  last: string | null | undefined
): string {
  const name = [first, last].filter(Boolean).join(" ").trim();
  return name || "Learner";
}

function displayHandle(
  username: string | null | undefined,
  email: string | null | undefined
): string {
  if (username) return username.startsWith("@") ? username : `@${username}`;
  if (email) return email.split("@")[0];
  return "@learner";
}

export default function ProfileScreen() {
  const router = useRouter();
  const { signOut } = useAuth();
  const { user, isLoaded } = useUser();
  const { selectedLanguage, translationLanguage, setTranslationLanguage } =
    useLanguageStore();
  const { profile, loading, saving, saveProfile } = useProfile();
  const {
    streak,
    totalXp,
    completedLessonIds,
    weekXp,
    weekXpTotal,
    league,
    unlockedAchievements,
    allAchievements,
    loading: progressLoading,
    refresh: refreshProgress,
  } = useLearningProgress();

  const [editVisible, setEditVisible] = useState(false);
  const [achievementsVisible, setAchievementsVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      refreshProgress();
    }, [refreshProgress])
  );
  const [friendsTab, setFriendsTab] = useState<"following" | "followers">(
    "following"
  );

  const language = LANGUAGES.find((l) => l.code === selectedLanguage);
  const maxWeekXp = Math.max(...weekXp.map((d) => d.xp), 1);
  const lessonsCompleted = completedLessonIds.length;
  const previewAchievements = useMemo(() => {
    const unlocked = unlockedAchievements.map((a) => a.definition);
    const locked = allAchievements.filter(
      (d) => !unlocked.some((u) => u.id === d.id)
    );
    return [...unlocked, ...locked].slice(0, 3);
  }, [allAchievements, unlockedAchievements]);
  const moreAchievementsCount = Math.max(
    allAchievements.length - previewAchievements.length,
    0
  );

  const avatarInitial =
    (profile?.firstName?.[0] ?? user?.firstName?.[0] ?? "L").toUpperCase();

  if (!isLoaded || loading || progressLoading) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: colors.neutral.background }}
      >
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary.purple} />
        </View>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: colors.neutral.background }}
      >
        <View className="flex-1 items-center justify-center px-8">
          <Text className="h3 text-center mb-3">Sign in to view profile</Text>
          <TouchableOpacity
            className="bg-lingua-purple rounded-2xl px-6 py-3"
            onPress={() => router.replace("/onboarding")}
          >
            <Text className="font-poppins-semibold text-white">Get started</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.neutral.background }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <Text style={styles.displayName}>
              {displayName(profile?.firstName, profile?.lastName)}
            </Text>
            <Text style={styles.handle}>
              {displayHandle(profile?.username, profile?.email)}
            </Text>
            <View style={styles.metaRow}>
              <Ionicons
                name="time-outline"
                size={14}
                color={colors.neutral.textSecondary}
              />
              <Text style={styles.metaText}>
                {formatJoined(profile?.createdAt ?? user.createdAt?.toISOString())}
              </Text>
            </View>
            <View style={styles.metaRow}>
              <Ionicons
                name="people-outline"
                size={14}
                color={colors.neutral.textSecondary}
              />
              <Text style={styles.metaText}>0 Friends</Text>
            </View>
            {language ? (
              <Image
                source={{ uri: language.flag }}
                style={styles.flag}
                contentFit="cover"
              />
            ) : null}
            {profile?.bio ? (
              <Text style={styles.bio}>{profile.bio}</Text>
            ) : null}
          </View>

          {profile?.imageUrl ? (
            <Image
              source={{ uri: profile.imageUrl }}
              style={styles.avatarImage}
            />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarLetter}>{avatarInitial}</Text>
            </View>
          )}
        </View>

        {/* Edit + settings */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.editButton}
            activeOpacity={0.85}
            onPress={() => {
              posthog.capture("profile_edit_opened");
              setEditVisible(true);
            }}
          >
            <Ionicons name="create-outline" size={18} color="#fff" />
            <Text style={styles.editButtonText}>EDIT PROFILE</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => signOut()}
            activeOpacity={0.8}
          >
            <Ionicons
              name="log-out-outline"
              size={20}
              color={colors.neutral.textSecondary}
            />
          </TouchableOpacity>
        </View>

        {/* Translation Language */}
        <Text style={styles.sectionTitle}>Translation Language</Text>
        <View style={styles.card}>
          {TRANSLATION_LANGUAGES.map((lang) => {
            const isSelected = translationLanguage === lang.code;
            return (
              <TouchableOpacity
                key={lang.code}
                style={styles.langRow}
                activeOpacity={0.7}
                onPress={() => {
                  setTranslationLanguage(lang.code);
                  posthog.capture("translation_language_changed", {
                    language: lang.code,
                  });
                }}
              >
                <Text style={styles.langFlag}>{lang.flag}</Text>
                <Text style={styles.langLabel}>{lang.nativeLabel}</Text>
                {isSelected ? (
                  <Ionicons
                    name="checkmark-circle"
                    size={22}
                    color={colors.primary.purple}
                  />
                ) : null}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Dictionary */}
        <Text style={styles.sectionTitle}>Dictionary</Text>
        <TouchableOpacity
          style={styles.dictionaryCard}
          activeOpacity={0.85}
          onPress={() => {
            posthog.capture("dictionary_opened", { source: "profile" });
            router.push("/dictionary");
          }}
          testID="profile-dictionary-link"
        >
          <View style={styles.dictionaryIcon}>
            <Ionicons name="book-outline" size={22} color={DUO_BLUE} />
          </View>
          <View style={styles.dictionaryText}>
            <Text style={styles.dictionaryTitle}>LOD Dictionary</Text>
            <Text style={styles.dictionarySubtitle}>
              Search in English or Luxembourgish (GWS A1 list)
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={colors.neutral.textSecondary}
          />
        </TouchableOpacity>

        {/* Statistics */}
        <Text style={styles.sectionTitle}>Statistics</Text>
        <View style={styles.statsGrid}>
          <StatCard
            icon="flame"
            iconColor={colors.semantic.streak}
            value={String(streak)}
            label="Day streak"
          />
          <StatCard
            icon="flash"
            iconColor={colors.semantic.warning}
            value={String(totalXp)}
            label="Total XP"
          />
          <StatCard
            icon="shield"
            iconColor={colors.primary.blue}
            value={league.name}
            label="League"
            badge={league.weekLabel}
          />
          <StatCard
            icon="trophy"
            iconColor={colors.semantic.warning}
            value={String(lessonsCompleted)}
            label="Lessons completed"
          />
        </View>

        {/* XP this week */}
        <Text style={styles.sectionTitle}>XP this week</Text>
        <View style={styles.card}>
          <View style={styles.chartLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: DUO_BLUE }]} />
              <Text style={styles.legendText}>
                {displayName(profile?.firstName, profile?.lastName)} ·{" "}
                {weekXpTotal} XP this week
              </Text>
            </View>
          </View>
          <View style={styles.chartArea}>
            {weekXp.map((point) => (
              <View key={point.day} style={styles.chartColumn}>
                <View style={styles.chartBarTrack}>
                  <View
                    style={[
                      styles.chartBarFill,
                      {
                        height: Math.max(
                          (point.xp / maxWeekXp) * 90,
                          point.xp > 0 ? 8 : 0
                        ),
                        backgroundColor: DUO_BLUE,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.chartLabel}>{point.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Friends */}
        <Text style={styles.sectionTitle}>Friends</Text>
        <View style={styles.card}>
          <View style={styles.tabRow}>
            <TouchableOpacity
              style={styles.tab}
              onPress={() => setFriendsTab("following")}
            >
              <Text
                style={[
                  styles.tabText,
                  friendsTab === "following" && styles.tabTextActive,
                ]}
              >
                FOLLOWING
              </Text>
              {friendsTab === "following" ? (
                <View style={styles.tabUnderline} />
              ) : null}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.tab}
              onPress={() => setFriendsTab("followers")}
            >
              <Text
                style={[
                  styles.tabText,
                  friendsTab === "followers" && styles.tabTextActive,
                ]}
              >
                FOLLOWERS
              </Text>
              {friendsTab === "followers" ? (
                <View style={styles.tabUnderline} />
              ) : null}
            </TouchableOpacity>
          </View>
          <Text style={styles.emptyFriends}>
            {friendsTab === "following"
              ? "Not following anyone yet"
              : "No followers yet"}
          </Text>
        </View>

        {/* Achievements */}
        <Text style={styles.sectionTitle}>Achievements</Text>
        <View style={styles.card}>
          <View style={styles.achievementsRow}>
            {previewAchievements.map((def) => {
              const isUnlocked = unlockedAchievements.some(
                (a) => a.id === def.id
              );
              return (
                <AchievementBadge
                  key={def.id}
                  emoji={def.emoji}
                  title={def.title}
                  bg={def.bgColor}
                  locked={!isUnlocked}
                />
              );
            })}
          </View>
          <TouchableOpacity
            style={styles.viewMoreRow}
            activeOpacity={0.7}
            onPress={() => setAchievementsVisible(true)}
          >
            <Text style={styles.viewMoreText}>
              {moreAchievementsCount > 0
                ? `View all ${allAchievements.length} achievements`
                : "View all achievements"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footerSpacer} />
      </ScrollView>

      <AchievementsModal
        visible={achievementsVisible}
        onClose={() => setAchievementsVisible(false)}
        allAchievements={allAchievements}
        unlocked={unlockedAchievements}
      />

      <EditProfileModal
        visible={editVisible}
        profile={profile}
        saving={saving}
        onClose={() => setEditVisible(false)}
        onSave={async (data) => {
          await saveProfile({
            ...data,
            preferredLanguage: selectedLanguage,
          });
          posthog.capture("profile_updated");
        }}
      />
    </SafeAreaView>
  );
}

function StatCard({
  icon,
  iconColor,
  value,
  label,
  badge,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  value: string;
  label: string;
  badge?: string;
}) {
  return (
    <View style={styles.statCard}>
      {badge ? (
        <View style={styles.statBadge}>
          <Text style={styles.statBadgeText}>{badge}</Text>
        </View>
      ) : null}
      <Ionicons name={icon} size={22} color={iconColor} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function AchievementBadge({
  emoji,
  title,
  bg,
  locked,
}: {
  emoji: string;
  title: string;
  bg: string;
  locked?: boolean;
}) {
  return (
    <View
      style={[
        styles.achievement,
        { backgroundColor: bg },
        locked && styles.achievementLocked,
      ]}
    >
      <Text style={[styles.achievementEmoji, locked && { opacity: 0.4 }]}>
        {emoji}
      </Text>
      <Text style={styles.achievementLevel} numberOfLines={1}>
        {locked ? "LOCKED" : title.toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 120,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  headerLeft: {
    flex: 1,
    paddingRight: 12,
  },
  displayName: {
    fontFamily: fontFamily.bold,
    fontSize: 22,
    color: colors.neutral.textPrimary,
    marginBottom: 2,
  },
  handle: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: colors.neutral.textSecondary,
    marginBottom: 10,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  metaText: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: colors.neutral.textSecondary,
  },
  flag: {
    width: 28,
    height: 20,
    borderRadius: 3,
    marginTop: 8,
  },
  bio: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: colors.neutral.textPrimary,
    marginTop: 8,
    lineHeight: 18,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#E8DEFF",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImage: {
    width: 88,
    height: 88,
    borderRadius: 44,
  },
  avatarLetter: {
    fontFamily: fontFamily.bold,
    fontSize: 36,
    color: colors.primary.purple,
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 24,
  },
  editButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: DUO_BLUE,
    borderRadius: 14,
    paddingVertical: 12,
  },
  editButtonText: {
    fontFamily: fontFamily.bold,
    fontSize: 14,
    color: "#fff",
    letterSpacing: 0.3,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.neutral.border,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 17,
    color: colors.neutral.textPrimary,
    marginBottom: 12,
  },
  dictionaryCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.neutral.border,
    padding: 14,
    marginBottom: 24,
    gap: 12,
  },
  dictionaryIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#E8F7FF",
    alignItems: "center",
    justifyContent: "center",
  },
  dictionaryText: {
    flex: 1,
  },
  dictionaryTitle: {
    fontFamily: fontFamily.semiBold,
    fontSize: 15,
    color: colors.neutral.textPrimary,
  },
  dictionarySubtitle: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: colors.neutral.textSecondary,
    marginTop: 2,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 24,
  },
  statCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.neutral.border,
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: "center",
    position: "relative",
  },
  statBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: colors.semantic.warning,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  statBadgeText: {
    fontFamily: fontFamily.bold,
    fontSize: 9,
    color: colors.neutral.textPrimary,
  },
  statValue: {
    fontFamily: fontFamily.bold,
    fontSize: 18,
    color: colors.neutral.textPrimary,
    marginTop: 6,
  },
  statLabel: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: colors.neutral.textSecondary,
    marginTop: 2,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.neutral.border,
    padding: 16,
    marginBottom: 24,
  },
  chartLegend: {
    marginBottom: 12,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontFamily: fontFamily.medium,
    fontSize: 13,
    color: colors.neutral.textPrimary,
  },
  chartArea: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 120,
    paddingTop: 8,
  },
  chartColumn: {
    flex: 1,
    alignItems: "center",
  },
  chartBarTrack: {
    width: "70%",
    height: 90,
    justifyContent: "flex-end",
  },
  chartBarFill: {
    width: "100%",
    borderRadius: 4,
    minHeight: 0,
  },
  chartLabel: {
    fontFamily: fontFamily.regular,
    fontSize: 11,
    color: colors.neutral.textSecondary,
    marginTop: 6,
  },
  tabRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.border,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingBottom: 10,
  },
  tabText: {
    fontFamily: fontFamily.bold,
    fontSize: 12,
    color: colors.neutral.textSecondary,
    letterSpacing: 0.5,
  },
  tabTextActive: {
    color: DUO_BLUE,
  },
  tabUnderline: {
    position: "absolute",
    bottom: 0,
    left: "15%",
    right: "15%",
    height: 2,
    backgroundColor: DUO_BLUE,
  },
  emptyFriends: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: colors.neutral.textSecondary,
    textAlign: "center",
    paddingVertical: 20,
  },
  achievementsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 8,
  },
  achievement: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  achievementEmoji: {
    fontSize: 32,
  },
  achievementLocked: {
    opacity: 0.55,
  },
  achievementLevel: {
    fontFamily: fontFamily.bold,
    fontSize: 8,
    color: colors.neutral.textPrimary,
    marginTop: 4,
    textAlign: "center",
    paddingHorizontal: 4,
  },
  viewMoreRow: {
    borderTopWidth: 1,
    borderTopColor: colors.neutral.border,
    marginTop: 12,
    paddingTop: 14,
    alignItems: "center",
  },
  viewMoreText: {
    fontFamily: fontFamily.bold,
    fontSize: 14,
    color: colors.neutral.textPrimary,
  },
  langRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.neutral.border,
  },
  langFlag: {
    fontSize: 22,
    marginRight: 12,
  },
  langLabel: {
    flex: 1,
    fontFamily: fontFamily.medium,
    fontSize: 15,
    color: colors.neutral.textPrimary,
  },
  footerSpacer: {
    height: 24,
  },
});
