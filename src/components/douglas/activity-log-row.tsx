import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";

export function ActivityLogRow({
  actor,
  action,
  timestamp,
  isError,
}: {
  actor: "agent" | "user";
  action: string;
  timestamp: string;
  isError?: boolean;
}) {
  const Icon = actor === "agent" ? Bot : User;
  // Who acted is the log's primary axis, so the avatar is tinted by actor rather than
  // leaving two grey circles to be told apart by their glyph alone. An error row takes
  // the destructive tint, since that outranks who did it.
  const tint = isError
    ? "bg-destructive/15 text-destructive"
    : actor === "agent"
      ? "bg-info/15 text-info"
      : "bg-secondary text-secondary-foreground";

  return (
    <div className="flex items-center gap-3 border-b py-3 last:border-b-0">
      <div className={cn("flex size-7 shrink-0 items-center justify-center rounded-full", tint)}>
        <Icon className="size-3.5" strokeWidth={1.75} />
      </div>
      <span className={cn("flex-1 text-sm", isError && "text-destructive")}>{action}</span>
      <span className="text-xs text-muted-foreground">{timestamp}</span>
    </div>
  );
}
