import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View } from "react-native";

const DUO_GREEN = "#58CC02";

interface LessonStepHeaderProps {
  progress: number;
  onClose: () => void;
}

export function LessonStepHeader({ progress, onClose }: LessonStepHeaderProps) {
  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={onClose}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="close" size={28} color="#AFAFAF" />
      </TouchableOpacity>
      <View style={styles.progressTrack}>
        <View
          style={[styles.progressFill, { width: `${Math.min(progress * 100, 100)}%` }]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 4,
    gap: 12,
  },
  progressTrack: {
    flex: 1,
    height: 14,
    backgroundColor: "#E5E5E5",
    borderRadius: 8,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: DUO_GREEN,
    borderRadius: 8,
  },
});
