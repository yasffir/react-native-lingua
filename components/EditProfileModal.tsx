import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { colors, fontFamily } from "@/constants/theme";
import type { UserProfile } from "@/hooks/useProfile";

interface EditProfileModalProps {
  visible: boolean;
  profile: UserProfile | null;
  saving: boolean;
  onClose: () => void;
  onSave: (data: {
    firstName: string;
    lastName: string;
    username: string;
    bio: string;
  }) => Promise<void>;
}

export function EditProfileModal({
  visible,
  profile,
  saving,
  onClose,
  onSave,
}: EditProfileModalProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (!visible || !profile) return;
    setFirstName(profile.firstName ?? "");
    setLastName(profile.lastName ?? "");
    setUsername(profile.username ?? "");
    setBio(profile.bio ?? "");
    setLocalError(null);
  }, [visible, profile]);

  async function handleSave() {
    setLocalError(null);
    try {
      await onSave({ firstName, lastName, username, bio });
      onClose();
    } catch (e) {
      setLocalError(e instanceof Error ? e.message : "Could not save");
    }
  }

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <Pressable style={styles.overlay} onPress={onClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.keyboard}
        >
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            <View className="flex-row items-center justify-between mb-4">
              <Text className="font-poppins-semibold text-lg text-text-primary">
                Edit profile
              </Text>
              <TouchableOpacity onPress={onClose} hitSlop={12}>
                <Ionicons
                  name="close"
                  size={24}
                  color={colors.neutral.textPrimary}
                />
              </TouchableOpacity>
            </View>

            <Text className="caption mb-1">First name</Text>
            <TextInput
              style={styles.input}
              value={firstName}
              onChangeText={setFirstName}
              placeholder="First name"
              placeholderTextColor={colors.neutral.textSecondary}
              autoCapitalize="words"
            />

            <Text className="caption mb-1 mt-3">Last name</Text>
            <TextInput
              style={styles.input}
              value={lastName}
              onChangeText={setLastName}
              placeholder="Last name"
              placeholderTextColor={colors.neutral.textSecondary}
              autoCapitalize="words"
            />

            <Text className="caption mb-1 mt-3">Username</Text>
            <Text className="caption text-text-secondary mb-1">
              Saved via your account (enable Username in Clerk Dashboard).
            </Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="username"
              placeholderTextColor={colors.neutral.textSecondary}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Text className="caption mb-1 mt-3">Bio</Text>
            <TextInput
              style={[styles.input, styles.bioInput]}
              value={bio}
              onChangeText={setBio}
              placeholder="A short bio about you"
              placeholderTextColor={colors.neutral.textSecondary}
              multiline
              maxLength={160}
            />

            {localError ? (
              <Text className="text-error text-xs mt-2">{localError}</Text>
            ) : null}

            <TouchableOpacity
              style={[styles.saveButton, saving && styles.saveDisabled]}
              onPress={handleSave}
              disabled={saving}
              activeOpacity={0.85}
            >
              {saving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveText}>SAVE CHANGES</Text>
              )}
            </TouchableOpacity>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 19, 40, 0.45)",
    justifyContent: "flex-end",
  },
  keyboard: {
    width: "100%",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.neutral.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: colors.neutral.textPrimary,
  },
  bioInput: {
    minHeight: 88,
    textAlignVertical: "top",
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: "#1CB0F6",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  saveDisabled: {
    opacity: 0.7,
  },
  saveText: {
    fontFamily: fontFamily.bold,
    fontSize: 14,
    color: "#fff",
    letterSpacing: 0.5,
  },
});
