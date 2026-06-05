import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { colors, fontFamily } from "@/constants/theme";
import { isLessonUnlocked } from "@/lib/curriculum/isLessonUnlocked";
import type { Lesson, Unit } from "@/types/learning";

interface AiTeacherLessonPickerProps {
  units: Unit[];
  allLessons: Lesson[];
  completedLessonIds: string[];
  selectedLessonId: string | null;
  recommendedLessonId: string | null;
  onSelect: (lessonId: string) => void;
}

export function AiTeacherLessonPicker({
  units,
  allLessons,
  completedLessonIds,
  selectedLessonId,
  recommendedLessonId,
  onSelect,
}: AiTeacherLessonPickerProps) {
  const lessonById = new Map(allLessons.map((lesson) => [lesson.id, lesson]));

  return (
    <View>
      <Text style={styles.sectionTitle}>Your lessons</Text>
      <Text style={styles.sectionHint}>
        Complete lessons on Learn to unlock the next one for Luna.
      </Text>
      {units.map((unit) => {
        const unitLessons = unit.lessonIds
          .map((id) => lessonById.get(id))
          .filter((lesson): lesson is Lesson => Boolean(lesson));

        if (unitLessons.length === 0) return null;

        return (
          <View key={unit.id} style={styles.unitBlock}>
            <Text style={styles.unitLabel}>
              Unit {unit.order} · {unit.title}
            </Text>
            {unitLessons.map((lesson, index) => {
              const isSelected = lesson.id === selectedLessonId;
              const isCompleted = completedLessonIds.includes(lesson.id);
              const isRecommended = lesson.id === recommendedLessonId;
              const isUnlocked = isLessonUnlocked(
                lesson,
                allLessons,
                completedLessonIds
              );
              const isLocked = !isUnlocked;

              return (
                <TouchableOpacity
                  key={lesson.id}
                  style={[
                    styles.row,
                    isSelected && !isLocked && styles.rowSelected,
                    isLocked && styles.rowLocked,
                  ]}
                  activeOpacity={isLocked ? 1 : 0.8}
                  disabled={isLocked}
                  onPress={() => onSelect(lesson.id)}
                  testID={`ai-teacher-lesson-${lesson.id}`}
                >
                  <Text style={[styles.emoji, isLocked && styles.emojiLocked]}>
                    {lesson.icon}
                  </Text>
                  <View style={styles.rowText}>
                    <Text
                      style={[
                        styles.lessonNumber,
                        isLocked && styles.textLocked,
                      ]}
                    >
                      Lesson {index + 1}
                      {isRecommended && !isLocked ? " · Recommended" : ""}
                      {isLocked ? " · Locked" : ""}
                    </Text>
                    <Text
                      style={[styles.lessonTitle, isLocked && styles.textLocked]}
                      numberOfLines={2}
                    >
                      {lesson.title}
                    </Text>
                    <Text style={[styles.lessonMeta, isLocked && styles.textLocked]}>
                      {lesson.vocabulary.length} words
                    </Text>
                  </View>
                  {isLocked ? (
                    <Ionicons
                      name="lock-closed"
                      size={20}
                      color={colors.neutral.textSecondary}
                    />
                  ) : isCompleted ? (
                    <View style={styles.checkCircle}>
                      <Ionicons name="checkmark" size={14} color="#fff" />
                    </View>
                  ) : isSelected ? (
                    <Ionicons
                      name="radio-button-on"
                      size={22}
                      color={colors.primary.purple}
                    />
                  ) : (
                    <Ionicons
                      name="radio-button-off"
                      size={22}
                      color={colors.neutral.border}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontFamily: fontFamily.semiBold,
    fontSize: 16,
    color: colors.neutral.textPrimary,
    marginBottom: 4,
  },
  sectionHint: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    lineHeight: 18,
    color: colors.neutral.textSecondary,
    marginBottom: 12,
  },
  unitBlock: {
    marginBottom: 16,
  },
  unitLabel: {
    fontFamily: fontFamily.medium,
    fontSize: 12,
    color: colors.neutral.textSecondary,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.neutral.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
    gap: 10,
  },
  rowSelected: {
    borderColor: colors.primary.purple,
    backgroundColor: "#F8F7FF",
  },
  rowLocked: {
    opacity: 0.45,
    backgroundColor: colors.neutral.background,
  },
  emoji: {
    fontSize: 24,
    width: 32,
    textAlign: "center",
  },
  emojiLocked: {
    opacity: 0.7,
  },
  rowText: {
    flex: 1,
  },
  lessonNumber: {
    fontFamily: fontFamily.medium,
    fontSize: 11,
    color: colors.primary.purple,
    marginBottom: 2,
  },
  lessonTitle: {
    fontFamily: fontFamily.semiBold,
    fontSize: 14,
    color: colors.neutral.textPrimary,
    marginBottom: 2,
  },
  lessonMeta: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: colors.neutral.textSecondary,
  },
  textLocked: {
    color: colors.neutral.textSecondary,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.semantic.success,
    alignItems: "center",
    justifyContent: "center",
  },
});
