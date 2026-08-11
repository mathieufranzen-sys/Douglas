import { cn } from "@/lib/utils";
import { Loader2, Check, Ban } from "lucide-react";

type Status = "thinking" | "answered" | "blocked" | "idle";

const CONFIG: Record<Status, { icon: React.ElementType; label: string; className: string }> = {
  thinking: { icon: Loader2, label: "Thinking…", className: "text-muted-foreground" },
  answered: { icon: Check, label: "Answered", className: "text-muted-foreground" },
  blocked: { icon: Ban, label: "Blocked", className: "text-destructive" },
  idle: { icon: Check, label: "Idle", className: "text-muted-foreground" },
};

export function StatusPill({ status, className }: { status: Status; className?: string }) {
  const { icon: Icon, label, className: colorClass } = CONFIG[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium", colorClass, className)}>
      <Icon className={cn("size-3", status === "thinking" && "animate-spin")} strokeWidth={1.75} />
      {label}
    </span>
  );
}
