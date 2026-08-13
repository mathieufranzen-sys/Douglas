"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { ArrowRight, Loader2, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const approvalModalVariants = cva("flex flex-col gap-4 bg-card text-card-foreground", {
  variants: {
    style: {
      // Bloquant, centré — pour les actions critiques.
      modal: "rounded-xl border p-6 shadow-lg",
      // Encart non bloquant dans le flux.
      inline: "rounded-lg border p-4",
      // Panneau latéral coulissant.
      sheet: "h-full border-l p-6",
    },
  },
  defaultVariants: { style: "modal" },
});

export function ApprovalModal({
  title,
  description,
  children,
  confirmLabel = "Confirm and execute",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  /** Task Validation gates a whole task; Tool Validation gates a single tool call. */
  kind = "task",
  loading,
  style = "modal",
  className,
}: {
  title: string;
  description?: string;
  children?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  kind?: "task" | "tool";
  /** Style=Loading — the confirm button spins and both actions lock. */
  loading?: boolean;
  className?: string;
} & VariantProps<typeof approvalModalVariants>) {
  return (
    <div
      role="group"
      aria-busy={loading}
      data-kind={kind}
      className={cn(approvalModalVariants({ style }), className)}
    >
      <div className="flex flex-col gap-1.5">
        <h2 className="text-lg font-semibold">{title}</h2>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>

      {children}

      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" size="lg" onClick={onCancel} disabled={loading}>
          {cancelLabel}
        </Button>
        <Button size="lg" onClick={onConfirm} disabled={loading}>
          {loading && <Loader2 data-icon="inline-start" className="animate-spin" strokeWidth={1.75} />}
          {confirmLabel}
        </Button>
      </div>
    </div>
  );
}

/** The Before → After pair used when the agent is about to overwrite existing data. */
export function ApprovalModalDiff({
  beforeLabel = "Before",
  afterLabel = "After",
  title,
  before,
  after,
  icon: Icon,
}: {
  beforeLabel?: string;
  afterLabel?: string;
  /** Repeated above both sides — the thing being changed. */
  title: string;
  before: string;
  after: string;
  icon?: LucideIcon;
}) {
  return (
    <div className="flex items-stretch gap-3">
      <DiffSide label={beforeLabel} title={title} value={before} icon={Icon} />
      <div className="flex items-center">
        <ArrowRight className="size-5 shrink-0 text-muted-foreground" strokeWidth={1.75} />
      </div>
      <DiffSide label={afterLabel} title={title} value={after} icon={Icon} />
    </div>
  );
}

function DiffSide({
  label,
  title,
  value,
  icon: Icon,
}: {
  label: string;
  title: string;
  value: string;
  icon?: LucideIcon;
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-start gap-1 rounded-lg border p-3">
      <span className="text-xs font-semibold text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold">{title}</span>
      <span className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-xs font-semibold">
        {Icon && <Icon className="size-3.5 shrink-0" strokeWidth={1.75} />}
        {value}
      </span>
    </div>
  );
}

/** Item — Type=Schedule surfaces a when/recurrence line, Type=Icon a labelled glyph row. */
export function ApprovalModalItem({
  type = "icon",
  icon: Icon,
  label,
  value,
  className,
}: {
  type?: "schedule" | "icon";
  icon?: LucideIcon;
  label: string;
  value?: string;
  className?: string;
}) {
  return (
    <div
      data-type={type}
      className={cn("flex items-center gap-3 rounded-lg border bg-background p-3", className)}
    >
      {Icon && <Icon className="size-4 shrink-0 text-muted-foreground" strokeWidth={1.75} />}
      <span className="min-w-0 flex-1 truncate text-sm">{label}</span>
      {value && (
        <span
          className={cn(
            "shrink-0 text-xs",
            type === "schedule" ? "font-medium text-foreground" : "text-muted-foreground"
          )}
        >
          {value}
        </span>
      )}
    </div>
  );
}
