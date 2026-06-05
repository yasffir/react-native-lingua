import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef } from "react";
import {
  ActivityIndicator,
  Image as RNImage,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { LessonCard } from "@/components/LessonCard";
import { images } from "@/constants/images";
import { colors } from "@/constants/theme";
import { useCurriculum } from "@/hooks/useCurriculum";
import { useLearningProgress } from "@/hooks/useLearningProgress";
import { useWarmLessonLodCache } from "@/hooks/useWarmLessonLodCache";
import { getCurrentUnitIndex } from "@/lib/curriculum/getCurrentUnitIndex";
import { useLanguageStore } from "@/store/languageStore";

export default function LearnScreen() {
  const router = useRouter();
  const { selectedLanguage } = useLanguageStore();
  const { completedLessonIds, refresh: refreshProgress } =
    useLearningProgress();

  useWarmLessonLodCache();

  const { unit, units, lessons, loading, setUnitIndex } =
    useCurriculum(selectedLanguage);

  const unitScrollRef = useRef<ScrollView>(null);
  const unitRowRef = useRef<View>(null);
  const unitPillRefs = useRef<(View | null)[]>([]);
  const unitScrollViewportWidth = useRef(0);

  const currentUnitIndex = useMemo(
    () => getCurrentUnitIndex(units, completedLessonIds),
    [units, completedLessonIds]
  );

  const scrollUnitIntoView = useCallback((index: number, animated = true) => {
    const pill = unitPillRefs.current[index];
    const row = unitRowRef.current;
    const scroll = unitScrollRef.current;
    if (!pill || !row || !scroll || index < 0) return;

    pill.measureLayout(
      row,
      (x, _y, width) => {
        const viewport = unitScrollViewportWidth.current;
        const centeredOffset =
          viewport > 0 ? x - (viewport - width) / 2 : x - 20;
        scroll.scrollTo({
          x: Math.max(0, centeredOffset),
          animated,
        });
      },
      () => {
        scroll.scrollTo({
          x: Math.max(0, index * 88 - 40),
          animated,
        });
      }
    );
  }, []);

  useEffect(() => {
    if (units.length === 0) return;
    setUnitIndex(currentUnitIndex);
    const timer = setTimeout(() => {
      scrollUnitIntoView(currentUnitIndex);
    }, 50);
    return () => clearTimeout(timer);
  }, [currentUnitIndex, scrollUnitIntoView, setUnitIndex, units.length]);

  useFocusEffect(
    useCallback(() => {
      refreshProgress();
      const timer = setTimeout(() => {
        scrollUnitIntoView(currentUnitIndex);
      }, 150);
      return () => clearTimeout(timer);
    }, [refreshProgress, scrollUnitIntoView, currentUnitIndex])
  );

  const handleSelectUnit = useCallback(
    (index: number) => {
      setUnitIndex(index);
      requestAnimationFrame(() => scrollUnitIntoView(index));
    },
    [scrollUnitIntoView, setUnitIndex]
  );

  const completedCount = lessons.filter((l) =>
    completedLessonIds.includes(l.id)
  ).length;

  const inProgressIndex = lessons.findIndex(
    (l) => !completedLessonIds.includes(l.id)
  );

  const selectedIndex = unit ? units.indexOf(unit) : 0;

  if (!selectedLanguage || !unit) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: colors.neutral.background }}
      >
        <View className="flex-1 items-center justify-center px-8">
          <Text className="h3 text-center mb-2">No language selected</Text>
          <Text className="body-md text-text-secondary text-center">
            Go to the home screen and pick a language to start learning.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const showInitialLoader = loading && lessons.length === 0;

  if (showInitialLoader) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: colors.neutral.background }}
      >
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary.purple} />
          <Text className="body-md text-text-secondary mt-3">
            Loading lessons…
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.neutral.background }}
    >
      {/* Header */}
      <View className="px-5 pt-2 pb-3">
        <View className="flex-row items-center mb-1">
          <TouchableOpacity
            onPress={() => router.navigate("/(tabs)")}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name="chevron-back"
              size={24}
              color={colors.neutral.textPrimary}
            />
          </TouchableOpacity>

          <Text
            className="flex-1 text-center font-poppins-semibold text-base text-text-primary"
            numberOfLines={1}
          >
            {unit.title}
          </Text>

          <TouchableOpacity
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name="bookmark-outline"
              size={22}
              color={colors.neutral.textPrimary}
            />
          </TouchableOpacity>
        </View>

        <Text className="caption text-center">
          Unit {unit.order} · {completedCount}/{lessons.length} lessons
        </Text>
      </View>

      {/* Unit selector */}
      {units.length > 1 && (
        <View
          className="mb-3"
          onLayout={(event) => {
            unitScrollViewportWidth.current = event.nativeEvent.layout.width;
          }}
        >
          <ScrollView
            ref={unitScrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            <View ref={unitRowRef} style={styles.unitSelectorContent}>
              {units.map((u, i) => {
                const isSelected = i === selectedIndex;
                const isCurrent = i === currentUnitIndex;
                return (
                  <View
                    key={u.id}
                    ref={(element) => {
                      unitPillRefs.current[i] = element;
                    }}
                    collapsable={false}
                  >
                    <TouchableOpacity
                      onPress={() => handleSelectUnit(i)}
                      style={[
                        styles.unitPill,
                        isSelected && styles.unitPillSelected,
                        isCurrent && !isSelected && styles.unitPillCurrent,
                      ]}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.unitPillText,
                          isSelected && styles.unitPillTextSelected,
                          isCurrent && !isSelected && styles.unitPillTextCurrent,
                        ]}
                        numberOfLines={1}
                      >
                        Unit {u.order}
                        {isCurrent ? " · Current" : ""}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </View>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Section */}
        <View style={styles.heroContainer}>
          <Image
            source={images.palace}
            contentFit="contain"
            style={styles.heroImage}
          />
          <RNImage
            source={images.mascotWelcome}
            style={styles.mascotImage}
            resizeMode="contain"
          />
        </View>

        {/* Lessons / Practice tabs */}
        <View className="flex-row border-b border-border mb-5">
          <View className="pb-3 mr-6 border-b-2 border-lingua-purple">
            <Text className="font-poppins-semibold text-sm text-lingua-purple">
              Lessons
            </Text>
          </View>
          <View className="pb-3">
            <Text className="font-poppins-semibold text-sm text-text-secondary">
              Practice
            </Text>
          </View>
        </View>

        {/* Lesson cards */}
        <View className="gap-3">
          {lessons.map((lesson, index) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              index={index}
              isCompleted={completedLessonIds.includes(lesson.id)}
              isInProgress={
                !completedLessonIds.includes(lesson.id) &&
                index === inProgressIndex
              }
              onPress={() => router.push(`/lesson/${lesson.id}`)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  heroContainer: {
    height: 180,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 20,
    backgroundColor: "#ffffff",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  mascotImage: {
    position: "absolute",
    bottom: 0,
    right: 16,
    width: 110,
    height: 110,
  },
  unitSelectorContent: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 8,
  },
  unitPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.neutral.surface,
    borderWidth: 1,
    borderColor: colors.neutral.border,
  },
  unitPillSelected: {
    backgroundColor: colors.primary.purple,
    borderColor: colors.primary.purple,
  },
  unitPillCurrent: {
    borderColor: colors.primary.purple,
    backgroundColor: "#F8F7FF",
  },
  unitPillText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 13,
    color: colors.neutral.textSecondary,
  },
  unitPillTextSelected: {
    color: "#FFFFFF",
  },
  unitPillTextCurrent: {
    color: colors.primary.purple,
  },
});
