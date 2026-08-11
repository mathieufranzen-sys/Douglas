import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AgentErrorCard({
  title,
  description,
  retryLabel = "Retry",
  handOffLabel = "Take over",
}: {
  title: string;
  description: string;
  retryLabel?: string;
  handOffLabel?: string;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4">
      <div className="flex items-start gap-2">
        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" strokeWidth={1.75} />
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-destructive">{title}</span>
          <span className="text-xs text-muted-foreground">{description}</span>
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm">
          {handOffLabel}
        </Button>
        <Button size="sm">{retryLabel}</Button>
      </div>
    </div>
  );
}
