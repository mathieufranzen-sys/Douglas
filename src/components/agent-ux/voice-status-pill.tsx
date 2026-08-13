"use client";

import { Mic, Loader2, X } from "lucide-react";

import { cn } from "@/lib/utils";

export type VoiceState = "idle" | "listening" | "processing" | "close";

const LABELS: Record<Exclude<VoiceState, "close">, string> = {
  listening: "Listening…",
  processing: "Processing…",
  idle: "Tap to speak",
};

/** The five bars that animate while the mic is open. */
function Waveform() {
  return (
    <span className="flex items-center gap-0.5" aria-hidden>
      {[0, 120, 240, 80, 200].map((delay, i) => (
        <span
          key={i}
          className="w-0.5 animate-pulse rounded-full bg-current"
          style={{ height: `${[6, 10, 14, 8, 5][i]}px`, animationDelay: `${delay}ms` }}
        />
      ))}
    </span>
  );
}

export function VoiceStatusPill({
  state = "idle",
  label,
  onClick,
  className,
}: {
  state?: VoiceState;
  /** Overrides the state's default wording. */
  label?: string;
  onClick?: () => void;
  className?: string;
}) {
  // State=Close collapses the pill to a single icon-sized dismiss control.
  if (state === "close") {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label="Close voice input"
        className={cn(
          "inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
          className
        )}
      >
        <X className="size-4" strokeWidth={1.75} />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      data-state={state}
      className={cn(
        "inline-flex h-9 items-center gap-2 rounded-md px-3 text-xs font-medium transition-colors",
        state === "listening" && "bg-primary text-primary-foreground",
        state === "processing" && "bg-muted text-foreground",
        state === "idle" && "text-muted-foreground hover:bg-muted hover:text-foreground",
        className
      )}
    >
      {state === "processing" ? (
        <Loader2 className="size-4 animate-spin" strokeWidth={1.75} />
      ) : (
        <Mic className="size-4" strokeWidth={1.75} />
      )}
      <span>{label ?? LABELS[state]}</span>
      {state === "listening" && <Waveform />}
    </button>
  );
}
