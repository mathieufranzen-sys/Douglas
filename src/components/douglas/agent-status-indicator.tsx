import { cva, type VariantProps } from "class-variance-authority";
import { Loader2, Check, Ban, Clock, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export type AgentStatus = "idle" | "thinking" | "acting" | "blocked" | "waiting";

const STATUS_CONFIG: Record<AgentStatus, { icon: LucideIcon; label: string; spins?: boolean }> = {
  idle: { icon: Check, label: "Idle" },
  thinking: { icon: Loader2, label: "Thinking…", spins: true },
  acting: { icon: Loader2, label: "Acting…", spins: true },
  blocked: { icon: Ban, label: "Blocked" },
  waiting: { icon: Clock, label: "Waiting for approval" },
};

/** One colour per state, so the five statuses aren't five identical grey pills. */
const STATUS_TINTS: Record<AgentStatus, string> = {
  idle: "text-success",
  thinking: "text-info",
  acting: "text-info",
  blocked: "text-destructive",
  waiting: "text-warning",
};

const indicatorVariants = cva(
  "inline-flex items-center rounded-full text-xs font-medium whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "bg-muted text-muted-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        outline: "border bg-background text-muted-foreground",
        failure: "bg-destructive/10 text-destructive",
      },
      type: {
        "text-icon": "gap-1.5 px-2.5 py-1",
        "text-image": "gap-1.5 py-1 pr-2.5 pl-1",
        icon: "size-9 justify-center",
        image: "size-9 justify-center overflow-hidden",
      },
    },
    defaultVariants: { variant: "default", type: "text-icon" },
  }
);

export function AgentStatusIndicator({
  status = "idle",
  label,
  /** Type=Text Image / image swap the glyph for an agent avatar. */
  avatarUrl,
  avatarAlt = "",
  variant,
  type = "text-icon",
  className,
}: {
  status?: AgentStatus;
  /** Overrides the status's default wording. */
  label?: string;
  avatarUrl?: string;
  avatarAlt?: string;
  className?: string;
} & VariantProps<typeof indicatorVariants>) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;
  // Blocked reads as a failure unless the caller overrides the variant explicitly.
  const resolvedVariant = variant ?? (status === "blocked" ? "failure" : "default");
  const showsText = type === "text-icon" || type === "text-image";
  const showsImage = type === "text-image" || type === "image";

  return (
    <span
      role="status"
      className={cn(indicatorVariants({ variant: resolvedVariant, type }), className)}
    >
      {showsImage ? (
        avatarUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={avatarUrl}
            alt={avatarAlt}
            className={cn("shrink-0 rounded-full object-cover", type === "image" ? "size-7" : "size-6")}
          />
        ) : (
          <span
            className={cn(
              "shrink-0 rounded-full bg-foreground/10",
              type === "image" ? "size-7" : "size-6"
            )}
          />
        )
      ) : (
        /* The glyph is tinted by status even inside a neutral pill: at a glance, whether
           the agent is working, waiting on you, or done is the thing being read. */
        <Icon
          className={cn(
            "size-3.5 shrink-0",
            config.spins && "animate-spin",
            STATUS_TINTS[status],
            resolvedVariant === "failure" && "text-current"
          )}
          strokeWidth={1.75}
        />
      )}
      {showsText && (label ?? config.label)}
      {!showsText && <span className="sr-only">{label ?? config.label}</span>}
    </span>
  );
}
