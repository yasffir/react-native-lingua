import { images } from "@/constants/images";
import { LANGUAGES } from "@/data/languages";
import { posthog } from "@/lib/posthog";
import { isSupabaseConfigured } from "@/lib/config";
import { updatePreferredLanguage } from "@/lib/profile/sync";
import { useSupabase } from "@/hooks/useSupabase";
import { useUser } from "@clerk/expo";
import { useLanguageStore } from "@/store/languageStore";
import { Language, LanguageCode } from "@/types/learning";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LanguageSelectScreen() {
  const { user } = useUser();
  const userId = user?.id;
  const supabase = useSupabase();
  const { setSelectedLanguage } = useLanguageStore();
  const [selectedCode, setSelectedCode] = useState<string>(LANGUAGES[0].code);
  const filtered = LANGUAGES;

  const renderItem = ({ item }: { item: Language }) => {
    const isSelected = item.code === selectedCode;
    return (
      <TouchableOpacity
        onPress={() => setSelectedCode(item.code)}
        className={`flex-row items-center py-3.5 px-3.5 bg-white border-[1.5px] rounded-[14px] ${isSelected ? "bg-[rgba(108,78,245,0.08)] border-lingua-purple" : "border-transparent"}`}
        activeOpacity={0.8}
      >
        <Image source={{ uri: item.flag }} style={styles.flag} />
        <View className="flex-1 ml-3">
          <Text className="font-poppins-semibold text-base text-text-primary">
            {item.name}
          </Text>
          <Text className="body-sm text-text-secondary">
            {item.learners} learners
          </Text>
        </View>
        {isSelected ? (
          <View className="w-6.5 h-6.5 rounded-full bg-lingua-purple items-center justify-center">
            <Ionicons name="checkmark" size={14} color="#fff" />
          </View>
        ) : (
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-8 h-8 items-center justify-center"
        >
          <Ionicons name="chevron-back" size={24} color="#001328" />
        </TouchableOpacity>
        <Text className="flex-1 text-center font-poppins-semibold text-lg text-text-primary">
          Lëtzebuergesch
        </Text>
        <View className="w-8" />
      </View>

      <Text className="px-4 body-md text-text-secondary mb-4">
        This app is set up for Luxembourgish only.
      </Text>

      {/* Language list */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.code}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => (
          <View className="h-px bg-gray-200" />
        )}
      />

      {/* Confirm button */}
      <View className="px-4 pt-3 pb-3">
        <TouchableOpacity
          className="bg-lingua-purple rounded-2xl items-center py-4"
          activeOpacity={0.85}
          testID="language-confirm-button"
          onPress={() => {
            const selectedLang = LANGUAGES.find((l) => l.code === selectedCode);
            posthog.capture("language_selected", {
              language_code: selectedCode,
              language_name: selectedLang?.name ?? selectedCode,
            });
            setSelectedLanguage(selectedCode as LanguageCode);
            if (isSupabaseConfigured && supabase && userId) {
              updatePreferredLanguage(supabase, userId, selectedCode).catch(
                console.warn
              );
            }
            router.replace("/");
          }}
        >
          <Text className="font-poppins-semibold text-base text-white">
            Continue
          </Text>
        </TouchableOpacity>
      </View>

      {/* Earth image */}
      <Image source={images.earth} style={styles.earthImage} resizeMode="cover" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flag: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  listContent: {
    paddingHorizontal: 16,
  },
  earthImage: {
    width: "100%",
    height: 130,
  },
});
