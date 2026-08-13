import { cn } from "@/lib/utils";

export type ConfidenceLevel = "high" | "medium" | "low" | "unknown";

const CONFIG: Record<
  ConfidenceLevel,
  { label: string; percentage: string; dot: string; text: string; badge: string }
> = {
  high: {
    label: "High",
    percentage: "92%",
    dot: "bg-info",
    text: "text-info",
    badge: "bg-info/10 text-info",
  },
  medium: {
    label: "Medium",
    percentage: "64%",
    dot: "bg-warning",
    text: "text-warning",
    badge: "bg-warning/10 text-warning",
  },
  low: {
    label: "Low",
    percentage: "31%",
    dot: "bg-destructive",
    text: "text-destructive",
    badge: "bg-destructive/10 text-destructive",
  },
  unknown: {
    label: "Unknown",
    percentage: "—",
    dot: "bg-muted-foreground",
    text: "text-muted-foreground",
    badge: "bg-muted text-muted-foreground",
  },
};

export function ConfidenceBadge({
  level,
  /** Badge for a detailed view, Dot for dense lists, Percentage for data-driven products. */
  style = "badge",
  value,
  className,
}: {
  level: ConfidenceLevel;
  style?: "badge" | "dot" | "percentage";
  /** Overrides the canned percentage on the Percentage style. */
  value?: string;
  className?: string;
}) {
  const config = CONFIG[level];

  if (style === "dot") {
    return (
      <span
        className={cn("inline-flex items-center gap-1.5 text-xs font-medium", className)}
        title={`Confidence: ${config.label}`}
      >
        <span className={cn("size-1.5 rounded-full", config.dot)} />
        {config.label}
      </span>
    );
  }

  if (style === "percentage") {
    return (
      <span className={cn("text-xs font-semibold tabular-nums", config.text, className)}>
        {value ?? config.percentage}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold",
        config.badge,
        className
      )}
    >
      {config.label}
    </span>
  );
}
