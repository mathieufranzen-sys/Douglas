"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { RotateCcw, Undo2, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ConfidenceBadge, type ConfidenceLevel } from "@/components/douglas/confidence-badge";

const agentActionCardVariants = cva("bg-card text-card-foreground", {
  variants: {
    style: {
      card: "flex flex-col gap-3 rounded-lg border p-4",
      compact: "flex items-center gap-3 rounded-lg border px-3 py-2",
      detailed: "flex flex-col gap-3 rounded-xl border p-4",
    },
  },
  defaultVariants: { style: "card" },
});

/** Which buttons the footer offers — mirrors AgentActionCard / ActionRow in Figma. */
export type ActionRowType = "triple" | "confirmOnly" | "revoke" | "retry" | "none";

export function AgentActionRow({
  type = "triple",
  confirmLabel = "Approve",
  rejectLabel = "Reject",
  detailsLabel = "Details",
  onConfirm,
  onReject,
  onDetails,
  onRevoke,
  onRetry,
  className,
}: {
  type?: ActionRowType;
  confirmLabel?: string;
  rejectLabel?: string;
  detailsLabel?: string;
  onConfirm?: () => void;
  onReject?: () => void;
  onDetails?: () => void;
  onRevoke?: () => void;
  onRetry?: () => void;
  className?: string;
}) {
  if (type === "none") return null;

  return (
    <div data-type={type} className={cn("flex items-center gap-2", className)}>
      {type === "triple" && (
        <>
          <Button variant="ghost" size="sm" onClick={onDetails}>
            {detailsLabel}
          </Button>
          <span className="flex-1" />
          <Button variant="outline" size="sm" onClick={onReject}>
            {rejectLabel}
          </Button>
          <Button size="sm" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </>
      )}
      {type === "confirmOnly" && (
        <Button size="sm" onClick={onConfirm}>
          {confirmLabel}
        </Button>
      )}
      {type === "revoke" && (
        <Button variant="outline" size="sm" onClick={onRevoke}>
          <Undo2 data-icon="inline-start" strokeWidth={1.75} />
          Revoke
        </Button>
      )}
      {type === "retry" && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          <RotateCcw data-icon="inline-start" strokeWidth={1.75} />
          Retry
        </Button>
      )}
    </div>
  );
}

export function AgentActionCard({
  title,
  description,
  icon: Icon,
  confidence,
  /** Detailed style only: the parameter rows the agent is about to act on. */
  parameters,
  actionRow = "triple",
  actionProps,
  style = "card",
  className,
}: {
  title: string;
  description?: string;
  icon?: LucideIcon;
  confidence?: ConfidenceLevel;
  parameters?: { label: string; value: string }[];
  actionRow?: ActionRowType;
  actionProps?: Omit<React.ComponentProps<typeof AgentActionRow>, "type">;
  className?: string;
} & VariantProps<typeof agentActionCardVariants>) {
  if (style === "compact") {
    return (
      <div className={cn(agentActionCardVariants({ style }), className)}>
        {Icon && <Icon className="size-4 shrink-0 text-muted-foreground" strokeWidth={1.75} />}
        <span className="min-w-0 flex-1 truncate text-sm font-medium">{title}</span>
        {confidence && <ConfidenceBadge level={confidence} style="dot" />}
        <AgentActionRow type={actionRow === "triple" ? "confirmOnly" : actionRow} {...actionProps} />
      </div>
    );
  }

  return (
    <div className={cn(agentActionCardVariants({ style }), className)}>
      <div className="flex items-start gap-2">
        {Icon && <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" strokeWidth={1.75} />}
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="text-sm font-semibold">{title}</span>
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
        {confidence && <ConfidenceBadge level={confidence} />}
      </div>

      {style === "detailed" && parameters && parameters.length > 0 && (
        <dl className="flex flex-col gap-0 overflow-hidden rounded-lg border">
          {parameters.map((param, i) => (
            <div
              key={param.label}
              className={cn("flex items-baseline gap-3 px-3 py-2 text-xs", i > 0 && "border-t")}
            >
              <dt className="w-28 shrink-0 text-muted-foreground">{param.label}</dt>
              <dd className="min-w-0 flex-1 truncate font-medium">{param.value}</dd>
            </div>
          ))}
        </dl>
      )}

      <AgentActionRow type={actionRow} {...actionProps} />
    </div>
  );
}
