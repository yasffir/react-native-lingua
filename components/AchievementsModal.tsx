import { Ionicons } from "@expo/vector-icons";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import type { AchievementDefinition } from "@/data/achievements";
import { colors, fontFamily } from "@/constants/theme";
import type { UnlockedAchievement } from "@/hooks/useLearningProgress";

interface AchievementsModalProps {
  visible: boolean;
  onClose: () => void;
  allAchievements: AchievementDefinition[];
  unlocked: UnlockedAchievement[];
}

export function AchievementsModal({
  visible,
  onClose,
  allAchievements,
  unlocked,
}: AchievementsModalProps) {
  const unlockedIds = new Set(unlocked.map((a) => a.id));

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Achievements</Text>
            <TouchableOpacity onPress={onClose} hitSlop={12}>
              <Ionicons
                name="close"
                size={24}
                color={colors.neutral.textPrimary}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.subtitle}>
            {unlocked.length} of {allAchievements.length} unlocked
          </Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            {allAchievements.map((def) => {
              const isUnlocked = unlockedIds.has(def.id);
              const row = unlocked.find((a) => a.id === def.id);
              return (
                <View
                  key={def.id}
                  style={[styles.row, !isUnlocked && styles.rowLocked]}
                >
                  <View
                    style={[
                      styles.badge,
                      { backgroundColor: def.bgColor },
                      !isUnlocked && styles.badgeLocked,
                    ]}
                  >
                    <Text style={styles.emoji}>{def.emoji}</Text>
                  </View>
                  <View style={styles.rowText}>
                    <Text style={styles.rowTitle}>{def.title}</Text>
                    <Text style={styles.rowDesc}>{def.description}</Text>
                    {isUnlocked && row ? (
                      <Text style={styles.unlockedAt}>
                        Unlocked{" "}
                        {new Date(row.unlockedAt).toLocaleDateString()}
                      </Text>
                    ) : (
                      <Text style={styles.lockedLabel}>Locked</Text>
                    )}
                  </View>
                  {isUnlocked ? (
                    <Ionicons
                      name="checkmark-circle"
                      size={22}
                      color={colors.semantic.success}
                    />
                  ) : (
                    <Ionicons
                      name="lock-closed"
                      size={18}
                      color={colors.neutral.textSecondary}
                    />
                  )}
                </View>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "85%",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  title: {
    fontFamily: fontFamily.bold,
    fontSize: 20,
    color: colors.neutral.textPrimary,
  },
  subtitle: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: colors.neutral.textSecondary,
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.border,
  },
  rowLocked: {
    opacity: 0.65,
  },
  badge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeLocked: {
    backgroundColor: colors.neutral.surface,
  },
  emoji: {
    fontSize: 26,
  },
  rowText: {
    flex: 1,
  },
  rowTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 15,
    color: colors.neutral.textPrimary,
  },
  rowDesc: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: colors.neutral.textSecondary,
    marginTop: 2,
  },
  unlockedAt: {
    fontFamily: fontFamily.regular,
    fontSize: 11,
    color: colors.semantic.success,
    marginTop: 4,
  },
  lockedLabel: {
    fontFamily: fontFamily.medium,
    fontSize: 11,
    color: colors.neutral.textSecondary,
    marginTop: 4,
  },
});
