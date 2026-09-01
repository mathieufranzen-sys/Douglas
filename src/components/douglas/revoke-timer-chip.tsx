import { cn } from "@/lib/utils";

export type RevokeTimerChipState = "default" | "urgent";

/** Below this many seconds the timer flips to Urgent on its own. */
export const URGENT_THRESHOLD_SECONDS = 5;

export function formatRemaining(seconds: number) {
  const safe = Math.max(0, Math.floor(seconds));
  return `${Math.floor(safe / 60)}:${String(safe % 60).padStart(2, "0")}`;
}

export function RevokeTimerChip({
  seconds,
  label = "Undoable",
  state,
  className,
}: {
  /** Remaining seconds in the undo window. */
  seconds: number;
  label?: string;
  /** Leave unset to derive Urgent from the remaining time. */
  state?: RevokeTimerChipState;
  className?: string;
}) {
  const resolved = state ?? (seconds < URGENT_THRESHOLD_SECONDS ? "urgent" : "default");

  return (
    <span
      data-state={resolved}
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-semibold",
        // A window that is still open is a caution, not a neutral label — it closes on
        // its own. Only the last seconds escalate to destructive.
        resolved === "urgent"
          ? "border-destructive/40 bg-destructive/10 text-destructive"
          : "border-warning/40 bg-warning/10 text-warning",
        className
      )}
    >
      {label} · {formatRemaining(seconds)}
    </span>
  );
}
