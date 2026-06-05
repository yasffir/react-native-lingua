import { AUDIO_FILES } from "@/data/audioMap";

let createAudioPlayer: typeof import("expo-audio").createAudioPlayer | null =
  null;
try {
  createAudioPlayer = require("expo-audio").createAudioPlayer;
} catch {
  // Native module not available — audio will be silently skipped
}

export async function playWord(audioId: string | undefined): Promise<void> {
  if (!createAudioPlayer || !audioId || !AUDIO_FILES[audioId]) return;
  const player = createAudioPlayer(AUDIO_FILES[audioId]);
  player.play();
  // Clean up after playback finishes
  const sub = player.addListener("playbackStatusUpdate", (status) => {
    if (status.didJustFinish) {
      sub.remove();
      player.remove();
    }
  });
}
