export type CaptionSpeaker = "agent" | "user";

export interface LiveCaptionLine {
  id: string;
  speaker: CaptionSpeaker;
  text: string;
  isLive?: boolean;
}

export interface PartialCaption {
  speaker: CaptionSpeaker;
  text: string;
}

export function speakerFromUserId(
  userId: string | undefined,
  agentUserId: string
): CaptionSpeaker {
  return userId === agentUserId ? "agent" : "user";
}

interface StreamClosedCaption {
  start_time?: number;
  text?: string;
  user?: { id?: string; name?: string };
}

/** Merge Stream committed captions with a streaming partial line. */
export function buildLiveCaptionLines(
  captions: StreamClosedCaption[],
  partial: PartialCaption | null,
  agentUserId: string,
  maxLines = 8
): LiveCaptionLine[] {
  const lines: LiveCaptionLine[] = captions
    .filter((caption) => caption.text?.trim())
    .map((caption, index) => ({
      id: `${caption.start_time ?? index}-${index}`,
      speaker: speakerFromUserId(caption.user?.id, agentUserId),
      text: caption.text!.trim(),
    }));

  if (partial?.text.trim()) {
    const last = lines[lines.length - 1];
    if (
      last &&
      last.speaker === partial.speaker &&
      partial.text.startsWith(last.text)
    ) {
      lines[lines.length - 1] = {
        ...last,
        text: partial.text.trim(),
        isLive: true,
      };
    } else {
      lines.push({
        id: "partial",
        speaker: partial.speaker,
        text: partial.text.trim(),
        isLive: true,
      });
    }
  }

  return lines.slice(-maxLines);
}
