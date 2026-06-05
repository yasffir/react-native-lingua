import { useEffect } from "react";

import { bootstrapAudio } from "@/lib/audio";

/** Enables playback in silent mode and warms the audio session at startup. */
export function AudioBootstrap() {
  useEffect(() => {
    bootstrapAudio();
  }, []);

  return null;
}
