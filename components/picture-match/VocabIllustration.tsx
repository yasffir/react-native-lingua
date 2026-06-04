import { StyleSheet, Text, View } from "react-native";

import type { VocabIllustrationKey } from "@/types/pictureMatch";

interface VocabIllustrationProps {
  type: VocabIllustrationKey;
  emoji?: string;
}

/** Flat Duolingo-style illustrations (no extra image assets). */
export function VocabIllustration({ type, emoji }: VocabIllustrationProps) {
  if (type === "emoji") {
    return (
      <View style={styles.emojiWrap}>
        <Text style={styles.emoji}>{emoji ?? "📖"}</Text>
      </View>
    );
  }

  switch (type) {
    case "coffee":
      return (
        <View style={styles.wrap}>
          <View style={styles.coffeePot}>
            <View style={styles.coffeeLiquid} />
            <View style={styles.coffeeHandle} />
          </View>
        </View>
      );
    case "tea":
      return (
        <View style={styles.wrap}>
          <View style={styles.teaSaucer} />
          <View style={styles.teaCup}>
            <View style={styles.teaLiquid} />
          </View>
          <View style={styles.teaTag} />
        </View>
      );
    case "milk":
      return (
        <View style={styles.wrap}>
          <View style={styles.milkCarton}>
            <View style={styles.milkCow} />
            <Text style={styles.milkCartonText}>MILK</Text>
          </View>
          <View style={styles.milkGlass}>
            <View style={styles.milkFill} />
          </View>
        </View>
      );
    case "sugar":
      return (
        <View style={styles.wrap}>
          <View style={styles.sugarBag}>
            <Text style={styles.sugarLabel}>SUGAR</Text>
          </View>
          <View style={styles.sugarCubesRow}>
            <View style={styles.sugarCube} />
            <View style={styles.sugarCube} />
          </View>
        </View>
      );
    case "water":
      return (
        <View style={styles.wrap}>
          <View style={styles.waterGlass}>
            <View style={styles.waterFill} />
          </View>
        </View>
      );
    case "bread":
      return (
        <View style={styles.wrap}>
          <View style={styles.breadLoaf} />
        </View>
      );
    case "cake":
      return (
        <View style={styles.wrap}>
          <View style={styles.cakeBase} />
          <View style={styles.cakeFrosting} />
        </View>
      );
    default:
      return (
        <View style={styles.emojiWrap}>
          <Text style={styles.emoji}>{emoji ?? "📖"}</Text>
        </View>
      );
  }
}

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
    height: 88,
    alignItems: "center",
    justifyContent: "center",
  },
  emojiWrap: {
    width: "100%",
    height: 88,
    alignItems: "center",
    justifyContent: "center",
  },
  emoji: {
    fontSize: 52,
  },
  coffeePot: {
    width: 56,
    height: 64,
    borderWidth: 3,
    borderColor: "#9CA3AF",
    borderRadius: 6,
    borderTopWidth: 0,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  coffeeLiquid: {
    height: "72%",
    backgroundColor: "#6B4423",
  },
  coffeeHandle: {
    position: "absolute",
    right: -14,
    top: 18,
    width: 14,
    height: 28,
    borderWidth: 3,
    borderColor: "#9CA3AF",
    borderLeftWidth: 0,
    borderRadius: 8,
  },
  teaSaucer: {
    position: "absolute",
    bottom: 8,
    width: 72,
    height: 14,
    borderRadius: 20,
    backgroundColor: "#FCD34D",
  },
  teaCup: {
    width: 52,
    height: 40,
    borderWidth: 3,
    borderColor: "#93C5FD",
    borderRadius: 4,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    justifyContent: "flex-end",
    overflow: "hidden",
    zIndex: 1,
  },
  teaLiquid: {
    height: "65%",
    backgroundColor: "#FDE68A",
  },
  teaTag: {
    position: "absolute",
    top: 6,
    right: 22,
    width: 8,
    height: 22,
    backgroundColor: "#EF4444",
    borderRadius: 2,
  },
  milkCarton: {
    position: "absolute",
    left: 28,
    width: 44,
    height: 58,
    backgroundColor: "#93C5FD",
    borderRadius: 4,
    alignItems: "center",
    paddingTop: 8,
  },
  milkCow: {
    width: 18,
    height: 14,
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 4,
  },
  milkCartonText: {
    fontSize: 7,
    fontWeight: "700",
    color: "#1E40AF",
  },
  milkGlass: {
    position: "absolute",
    right: 32,
    width: 28,
    height: 48,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    borderRadius: 4,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  milkFill: {
    height: "80%",
    backgroundColor: "#F9FAFB",
  },
  sugarBag: {
    width: 48,
    height: 56,
    backgroundColor: "#60A5FA",
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  sugarLabel: {
    fontSize: 8,
    fontWeight: "700",
    color: "#fff",
  },
  sugarCubesRow: {
    position: "absolute",
    right: 36,
    bottom: 18,
    flexDirection: "row",
    gap: 4,
  },
  sugarCube: {
    width: 14,
    height: 14,
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 2,
  },
  waterGlass: {
    width: 36,
    height: 56,
    borderWidth: 2,
    borderColor: "#93C5FD",
    borderRadius: 4,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  waterFill: {
    height: "75%",
    backgroundColor: "#BFDBFE",
  },
  breadLoaf: {
    width: 64,
    height: 36,
    backgroundColor: "#D97706",
    borderRadius: 18,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  cakeBase: {
    width: 56,
    height: 28,
    backgroundColor: "#F59E0B",
    borderRadius: 4,
  },
  cakeFrosting: {
    position: "absolute",
    top: 22,
    width: 56,
    height: 16,
    backgroundColor: "#F472B6",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
});
