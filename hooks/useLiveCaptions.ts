import { useEffect, useMemo, useRef, useState } from "react";

import {
  buildLiveCaptionLines,
  type PartialCaption,
} from "@/lib/aiTeacher/liveCaptions";

interface StreamCustomEvent {
  custom?: {
    type?: string;
    speaker?: "agent" | "user";
    text?: string;
  };
}

interface UseLiveCaptionsOptions {
  call: { on: (event: string, handler: (event: StreamCustomEvent) => void) => () => void };
  captions: Array<{
    start_time?: number;
    text?: string;
    user?: { id?: string; name?: string };
  }>;
  agentUserId: string;
  enabled?: boolean;
}

export function useLiveCaptions({
  call,
  captions,
  agentUserId,
  enabled = true,
}: UseLiveCaptionsOptions) {
  const [partial, setPartial] = useState<PartialCaption | null>(null);
  const partialTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const unsubscribe = call.on("custom", (event: StreamCustomEvent) => {
      const data = event?.custom ?? {};

      if (data.type === "transcript_partial" && data.text) {
        setPartial({
          speaker: data.speaker ?? "agent",
          text: data.text,
        });
        if (partialTimerRef.current) clearTimeout(partialTimerRef.current);
        partialTimerRef.current = setTimeout(() => setPartial(null), 4000);
        return;
      }

      if (data.type === "transcript_final") {
        setPartial(null);
        if (partialTimerRef.current) clearTimeout(partialTimerRef.current);
      }
    });

    return () => {
      unsubscribe();
      if (partialTimerRef.current) clearTimeout(partialTimerRef.current);
    };
  }, [call, enabled]);

  const lines = useMemo(
    () => buildLiveCaptionLines(captions, partial, agentUserId),
    [captions, partial, agentUserId]
  );

  function getLatestUserSpeech(): string {
    if (partial?.speaker === "user" && partial.text.trim()) {
      return partial.text.trim();
    }

    return captions
      .filter((caption) => caption.user?.id !== agentUserId)
      .map((caption) => caption.text ?? "")
      .join(" ")
      .trim();
  }

  return {
    lines,
    partial,
    hasContent: lines.length > 0,
    getLatestUserSpeech,
  };
}
