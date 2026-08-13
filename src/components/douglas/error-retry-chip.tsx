import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ErrorRetryChip({
  label,
  onRetry,
}: {
  label: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-destructive/10 px-3 py-2">
      <div className="flex items-center gap-2">
        <AlertCircle className="size-4 text-destructive" strokeWidth={1.75} />
        <span className="text-sm font-medium text-destructive">{label}</span>
      </div>
      <Button variant="ghost" size="sm" className="h-7 text-destructive hover:text-destructive" onClick={onRetry}>
        Retry
      </Button>
    </div>
  );
}
