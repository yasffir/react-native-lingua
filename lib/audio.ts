import { Platform } from "react-native";
import { requireOptionalNativeModule } from "expo-modules-core";
import Constants from "expo-constants";

import { AUDIO_FILES } from "@/data/audioMap";
import { getLodEntry } from "@/lib/lod/cache";

type AudioPlayer = import("expo-audio").AudioPlayer;
type AudioSource = import("expo-audio").AudioSource;
type ExpoAudioModule = typeof import("expo-audio");

export type AudioPlayContext = "default" | "duringCall";

export interface PlayAudioOptions {
  context?: AudioPlayContext;
  downloadFirst?: boolean;
}

let expoAudio: ExpoAudioModule | null | undefined;
let nativeUnavailableLogged = false;
let simulatorWarningLogged = false;
let modeReady: Promise<void> | null = null;
let activePlayer: AudioPlayer | null = null;
let playQueue: Promise<void> = Promise.resolve();
let playGeneration = 0;
let playContext: AudioPlayContext = "default";

function hasExpoAudioNative(): boolean {
  return requireOptionalNativeModule("ExpoAudio") != null;
}

function loadExpoAudio(): ExpoAudioModule | null {
  if (expoAudio !== undefined) return expoAudio;

  if (!hasExpoAudioNative()) {
    if (!nativeUnavailableLogged) {
      console.warn(
        "[audio] Native audio unavailable in this build. Run: npx expo run:ios"
      );
      nativeUnavailableLogged = true;
    }
    expoAudio = null;
    return null;
  }

  try {
    expoAudio = require("expo-audio") as ExpoAudioModule;
    return expoAudio;
  } catch (error) {
    console.warn("[audio] Failed to load expo-audio", error);
    expoAudio = null;
    return null;
  }
}

export function isNativeAudioAvailable(): boolean {
  if (expoAudio !== undefined) return expoAudio !== null;
  return hasExpoAudioNative();
}

export function isIosSimulator(): boolean {
  return Platform.OS === "ios" && Constants.isDevice === false;
}

/** Set while Stream / WebRTC owns the mic so playback uses a compatible session. */
export function setAudioPlayContext(context: AudioPlayContext): void {
  playContext = context;
}

async function applyAudioMode(context: AudioPlayContext): Promise<void> {
  const audio = loadExpoAudio();
  if (!audio) return;

  await audio.setIsAudioActiveAsync(true);
  await audio.setAudioModeAsync({
    playsInSilentMode: true,
    interruptionMode: context === "duringCall" ? "duckOthers" : "mixWithOthers",
    allowsRecording: context !== "duringCall",
  });
}

async function restoreAfterCallPlayback(): Promise<void> {
  const audio = loadExpoAudio();
  if (!audio) return;

  await audio.setIsAudioActiveAsync(true);
  await audio.setAudioModeAsync({
    playsInSilentMode: true,
    interruptionMode: "mixWithOthers",
    allowsRecording: true,
  });
}

function ensureDefaultAudioMode(): Promise<void> {
  const audio = loadExpoAudio();
  if (!audio) return Promise.resolve();

  if (!modeReady) {
    modeReady = applyAudioMode("default").catch((error) => {
      console.warn("[audio] session setup failed", error);
      modeReady = null;
    });
  }
  return modeReady ?? Promise.resolve();
}

/** Call once at app start so the first tap does not race session setup. */
export function bootstrapAudio(): void {
  if (!isNativeAudioAvailable()) return;
  if (isIosSimulator() && !simulatorWarningLogged) {
    simulatorWarningLogged = true;
    console.warn(
      "[audio] iOS Simulator audio is unreliable (mic + WebRTC + playback). Test on a physical device for AI Teacher audio."
    );
  }
  void ensureDefaultAudioMode();
}

function describeSource(source: AudioSource | number | string): string {
  if (typeof source === "number") return "bundled";
  if (typeof source === "string") return source.slice(0, 80);
  if (source && typeof source === "object" && "uri" in source) {
    return String(source.uri).slice(0, 80);
  }
  return "unknown";
}

function waitUntilPlayable(
  player: AudioPlayer,
  generation: number,
  timeoutMs = 15000
): Promise<void> {
  if (player.isLoaded && player.duration > 0) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      cleanup();
      if (generation !== playGeneration) {
        resolve();
        return;
      }
      if (player.isLoaded && player.duration > 0) resolve();
      else reject(new Error("Audio load timeout"));
    }, timeoutMs);

    const cleanup = () => {
      clearTimeout(timer);
      sub.remove();
    };

    const sub = player.addListener("playbackStatusUpdate", (status) => {
      if (generation !== playGeneration) {
        cleanup();
        resolve();
        return;
      }

      if (!status.isLoaded) return;

      if (player.duration > 0 || status.playing) {
        cleanup();
        resolve();
      }
    });
  });
}

function waitUntilFinished(
  player: AudioPlayer,
  generation: number,
  timeoutMs = 30000
): Promise<void> {
  if (generation !== playGeneration) return Promise.resolve();

  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      cleanup();
      resolve();
    }, timeoutMs);

    const cleanup = () => {
      clearTimeout(timer);
      sub.remove();
    };

    const sub = player.addListener("playbackStatusUpdate", (status) => {
      if (generation !== playGeneration) {
        cleanup();
        resolve();
        return;
      }
      if (status.didJustFinish) {
        cleanup();
        resolve();
      }
    });
  });
}

function releasePlayer(player: AudioPlayer | null): void {
  if (!player) return;
  try {
    player.pause();
    player.remove();
  } catch {
    // Player may already be released.
  }
  if (activePlayer === player) {
    activePlayer = null;
  }
}

async function playSourceInternal(
  source: AudioSource | number | string,
  options?: PlayAudioOptions
): Promise<boolean> {
  const audio = loadExpoAudio();
  if (!audio) return false;

  const context = options?.context ?? playContext;
  const generation = ++playGeneration;
  const sourceLabel = describeSource(source);
  let player: AudioPlayer | null = null;
  let succeeded = false;

  try {
    await applyAudioMode(context);
    releasePlayer(activePlayer);

    player = audio.createAudioPlayer(source, {
      downloadFirst: options?.downloadFirst ?? false,
      keepAudioSessionActive: true,
    });
    activePlayer = player;

    await waitUntilPlayable(player, generation);
    if (generation !== playGeneration) return false;

    await player.seekTo(0);
    player.volume = 1;
    player.play();

    await waitUntilFinished(player, generation);
    succeeded = generation === playGeneration;
    return succeeded;
  } catch (error) {
    console.warn(`[audio] playback failed (${sourceLabel})`, error);
    return false;
  } finally {
    releasePlayer(player);
    if (succeeded && context === "duringCall") {
      await restoreAfterCallPlayback().catch(() => undefined);
    }
  }
}

function enqueuePlay(task: () => Promise<boolean>): Promise<boolean> {
  const run = playQueue.then(task);
  playQueue = run.then(
    () => undefined,
    () => undefined
  );
  return run;
}

async function playSource(
  source: AudioSource | number | string,
  options?: PlayAudioOptions
): Promise<boolean> {
  return enqueuePlay(() => playSourceInternal(source, options));
}

export async function playAudioUri(
  uri: string,
  options?: PlayAudioOptions
): Promise<boolean> {
  if (!uri) return false;
  return playSource(uri, { ...options, downloadFirst: true });
}

export async function playWord(
  audioId: string | undefined,
  options?: PlayAudioOptions
): Promise<boolean> {
  if (!audioId) return false;

  const bundled = AUDIO_FILES[audioId];
  if (bundled) {
    return playSource(bundled, options);
  }

  const entry = await getLodEntry(audioId);
  if (entry?.audioAac) {
    return playAudioUri(entry.audioAac, options);
  }

  console.warn(`[audio] No audio found for "${audioId}"`);
  return false;
}
