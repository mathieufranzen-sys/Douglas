import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle, Loader2, type LucideIcon } from "lucide-react";

export type ThinkingStepStatus = "done" | "failed" | "loading";

export function ThinkingStep({
  icon: Icon,
  title,
  description,
  timestamp,
  status = "done",
  showConnector = true,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  timestamp?: string;
  status?: ThinkingStepStatus;
  showConnector?: boolean;
}) {
  const StatusIcon =
    status === "failed" ? XCircle : status === "loading" ? Loader2 : Icon ?? CheckCircle2;

  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <StatusIcon
          className={cn(
            "size-4 shrink-0",
            status === "failed" && "text-destructive",
            status === "loading" && "animate-spin text-muted-foreground",
            status === "done" && "text-muted-foreground"
          )}
          strokeWidth={1.75}
        />
        {showConnector && <div className="mt-1 w-px flex-1 bg-border" />}
      </div>
      <div className={cn("flex flex-col gap-0.5", showConnector ? "pb-4" : "pb-0")}>
        <div className="flex items-baseline gap-2">
          <span
            className={cn(
              "text-sm font-medium",
              status === "failed" ? "text-destructive" : "text-foreground"
            )}
          >
            {title}
          </span>
          {timestamp && <span className="text-xs text-muted-foreground">{timestamp}</span>}
        </div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
    </div>
  );
}
