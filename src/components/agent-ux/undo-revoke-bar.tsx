import { cva, type VariantProps } from "class-variance-authority";
import { RotateCcw } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { RevokeTimerChip } from "@/components/agent-ux/revoke-timer-chip";

const undoRevokeBarVariants = cva("flex items-center gap-2", {
  variants: {
    style: {
      inline: "rounded-md bg-muted py-1 pr-1.5 pl-3",
      chip: "w-fit rounded-full bg-muted py-1 pr-1.5 pl-3 shadow-sm",
      toast:
        "w-fit rounded-lg border bg-popover py-1.5 pr-1.5 pl-3 text-popover-foreground shadow-md",
      banner: "w-full rounded-md bg-muted px-3 py-2",
    },
  },
  defaultVariants: { style: "chip" },
});

export function UndoRevokeBar({
  seconds,
  message,
  timerLabel,
  actionLabel = "Undo",
  onUndo,
  style = "chip",
  className,
}: {
  /** Remaining seconds in the reversal window. */
  seconds: number;
  /** Banner and Toast styles lead with a sentence; Chip and Inline lead with the timer. */
  message?: string;
  timerLabel?: string;
  actionLabel?: string;
  onUndo?: () => void;
  className?: string;
} & VariantProps<typeof undoRevokeBarVariants>) {
  const showsMessage = (style === "banner" || style === "toast") && message;

  return (
    <div className={cn(undoRevokeBarVariants({ style }), className)}>
      {showsMessage ? (
        <>
          <span className="flex-1 truncate text-xs">{message}</span>
          <RevokeTimerChip seconds={seconds} label={timerLabel} />
        </>
      ) : (
        <div className="flex flex-1 items-center">
          <RevokeTimerChip seconds={seconds} label={timerLabel} />
        </div>
      )}
      <Button size="xs" onClick={onUndo}>
        {style === "banner" && <RotateCcw data-icon="inline-start" strokeWidth={1.75} />}
        {actionLabel}
      </Button>
    </div>
  );
}
