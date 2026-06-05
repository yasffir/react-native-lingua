import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { LodEntryDetailView } from "@/components/dictionary/LodEntryDetailView";
import { colors, fontFamily } from "@/constants/theme";
import { useLodDictionary } from "@/hooks/useLodDictionary";
import { posthog } from "@/lib/posthog";

export default function DictionaryScreen() {
  const router = useRouter();
  const {
    query,
    setQuery,
    results,
    selectedEntry,
    selectedLodId,
    selectHit,
    clearSelection,
    recentSearches,
    searching,
    entryLoading,
    error,
    total,
  } = useLodDictionary();

  useEffect(() => {
    posthog.capture("dictionary_opened");
  }, []);

  const selectedLemma =
    results.find((hit) => hit.lodId === selectedLodId)?.lemma ??
    selectedEntry?.lemma ??
    "";

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
          <Ionicons
            name="chevron-back"
            size={28}
            color={colors.neutral.textSecondary}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>LOD Dictionary</Text>
        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.searchWrap}>
          <Ionicons
            name="search"
            size={20}
            color={colors.neutral.textSecondary}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search in English or Luxembourgish…"
            placeholderTextColor={colors.neutral.textSecondary}
            value={query}
            onChangeText={setQuery}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            testID="dictionary-search-input"
          />
          {query.length > 0 ? (
            <TouchableOpacity
              hitSlop={8}
              onPress={() => {
                setQuery("");
                clearSelection();
              }}
            >
              <Ionicons
                name="close-circle"
                size={20}
                color={colors.neutral.textSecondary}
              />
            </TouchableOpacity>
          ) : null}
        </View>

        <Text style={styles.hint}>
          GWS A1 word list · English uses bundled translations; Luxembourgish
          uses live LOD search
        </Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {selectedLodId ? (
          <View style={styles.detailSection}>
            <TouchableOpacity
              style={styles.backToResults}
              onPress={clearSelection}
            >
              <Ionicons
                name="arrow-back"
                size={18}
                color={colors.primary.purple}
              />
              <Text style={styles.backToResultsText}>Back to results</Text>
            </TouchableOpacity>
            <LodEntryDetailView
              lemma={selectedLemma}
              lodId={selectedLodId}
              entry={selectedEntry}
              loading={entryLoading}
            />
          </View>
        ) : (
          <View style={styles.listSection}>
            {query.trim().length < 2 && recentSearches.length > 0 ? (
              <View style={styles.recentBlock}>
                <Text style={styles.sectionLabel}>Recent searches</Text>
                {recentSearches.map((item) => (
                  <TouchableOpacity
                    key={`${item.query}-${item.searchedAt}`}
                    style={styles.recentRow}
                    onPress={() => setQuery(item.query)}
                  >
                    <Ionicons
                      name="time-outline"
                      size={18}
                      color={colors.neutral.textSecondary}
                    />
                    <Text style={styles.recentText}>{item.query}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : null}

            {searching ? (
              <ActivityIndicator
                color={colors.primary.purple}
                style={styles.listLoader}
              />
            ) : null}

            {query.trim().length >= 2 && !searching ? (
              <Text style={styles.sectionLabel}>
                {total === 0
                  ? "No matches"
                  : `${total} result${total === 1 ? "" : "s"}`}
              </Text>
            ) : null}

            {results.map((hit) => (
              <TouchableOpacity
                key={hit.lodId}
                style={styles.resultRow}
                activeOpacity={0.85}
                onPress={() => selectHit(hit)}
                testID={`dictionary-result-${hit.lodId}`}
              >
                <View style={styles.resultText}>
                    <Text style={styles.resultLemma}>{hit.lemma}</Text>
                    {hit.englishHint ? (
                      <Text style={styles.resultHint}>{hit.englishHint}</Text>
                    ) : null}
                    {hit.partOfSpeech ? (
                      <Text style={styles.resultPos}>{hit.partOfSpeech}</Text>
                    ) : null}
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={colors.neutral.border}
                />
              </TouchableOpacity>
            ))}

            {query.trim().length < 2 && recentSearches.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons
                  name="book-outline"
                  size={40}
                  color={colors.primary.purple}
                />
                <Text style={styles.emptyTitle}>Look up any word</Text>
                <Text style={styles.emptyBody}>
                  Type at least 2 characters — try English (hello, coffee) or
                  Luxembourgish (Moien, Kaffi).
                </Text>
              </View>
            ) : null}
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.neutral.background,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontFamily: fontFamily.bold,
    fontSize: 17,
    color: colors.neutral.textPrimary,
  },
  headerSpacer: {
    width: 28,
  },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginHorizontal: 20,
    marginBottom: 8,
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.neutral.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    fontFamily: fontFamily.regular,
    fontSize: 16,
    color: colors.neutral.textPrimary,
    padding: 0,
  },
  hint: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: colors.neutral.textSecondary,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  error: {
    fontFamily: fontFamily.medium,
    fontSize: 13,
    color: colors.semantic.error,
    marginHorizontal: 20,
    marginBottom: 8,
  },
  listSection: {
    flex: 1,
    paddingHorizontal: 20,
  },
  detailSection: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionLabel: {
    fontFamily: fontFamily.semiBold,
    fontSize: 13,
    color: colors.neutral.textSecondary,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  recentBlock: {
    marginBottom: 16,
  },
  recentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
  },
  recentText: {
    fontFamily: fontFamily.medium,
    fontSize: 15,
    color: colors.neutral.textPrimary,
  },
  listLoader: {
    marginTop: 24,
  },
  resultRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.neutral.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 8,
  },
  resultText: {
    flex: 1,
  },
  resultLemma: {
    fontFamily: fontFamily.semiBold,
    fontSize: 16,
    color: colors.neutral.textPrimary,
  },
  resultHint: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: colors.neutral.textSecondary,
    marginTop: 2,
  },
  resultPos: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: colors.neutral.textSecondary,
    marginTop: 2,
  },
  backToResults: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  backToResultsText: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    color: colors.primary.purple,
  },
  emptyState: {
    alignItems: "center",
    paddingTop: 48,
    paddingHorizontal: 24,
    gap: 10,
  },
  emptyTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 18,
    color: colors.neutral.textPrimary,
  },
  emptyBody: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    lineHeight: 21,
    color: colors.neutral.textSecondary,
    textAlign: "center",
  },
});
