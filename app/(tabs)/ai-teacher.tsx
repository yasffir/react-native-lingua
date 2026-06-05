import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { posthog } from "@/lib/posthog";
import { useDailyPlanStore } from "@/store/dailyPlanStore";

export default function AITeacherScreen() {
  const markPlanItemComplete = useDailyPlanStore((s) => s.markComplete);
  const syncToday = useDailyPlanStore((s) => s.syncToday);

  useFocusEffect(
    useCallback(() => {
      syncToday();
      markPlanItemComplete("ai-conversation");
      posthog.capture("ai_teacher_viewed");
    }, [markPlanItemComplete, syncToday])
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View className="flex-1 items-center justify-center">
        <Text className="h2">AI Teacher</Text>
      </View>
    </SafeAreaView>
  );
}
