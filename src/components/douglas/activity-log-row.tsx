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
  return (
    <div className="flex items-center gap-3 border-b py-3 last:border-b-0">
      <div
        className={cn(
          "flex size-7 shrink-0 items-center justify-center rounded-full",
          actor === "agent" ? "bg-muted" : "bg-secondary"
        )}
      >
        <Icon className="size-3.5 text-muted-foreground" strokeWidth={1.75} />
      </div>
      <span className={cn("flex-1 text-sm", isError && "text-destructive")}>{action}</span>
      <span className="text-xs text-muted-foreground">{timestamp}</span>
    </div>
  );
}
