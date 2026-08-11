import { cn } from "@/lib/utils";

const CONFIG: Record<string, { dot: string; label: string }> = {
  high: { dot: "bg-blue-500", label: "High" },
  medium: { dot: "bg-neutral-400", label: "Medium" },
  low: { dot: "bg-destructive", label: "Low" },
  unknown: { dot: "bg-muted-foreground", label: "Unknown" },
};

export function ConfidenceBadge({
  level,
  className,
}: {
  level: "high" | "medium" | "low" | "unknown";
  className?: string;
}) {
  const config = CONFIG[level];
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium", className)}>
      <span className={cn("size-1.5 rounded-full", config.dot)} />
      {config.label}
    </span>
  );
}
