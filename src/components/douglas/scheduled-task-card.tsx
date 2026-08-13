"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { CalendarClock, Repeat } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

const scheduledTaskCardVariants = cva("bg-card text-card-foreground", {
  variants: {
    style: {
      card: "flex flex-col gap-3 rounded-xl border p-4",
      list: "flex items-center gap-3 rounded-lg border px-3 py-2.5",
      compact: "flex items-center gap-2 rounded-md px-2 py-1.5",
    },
  },
  defaultVariants: { style: "card" },
});

export function ScheduledTaskCard({
  title,
  description,
  /** Human-readable recurrence, e.g. "Every Monday at 7:00 AM". */
  frequency,
  /** Optional status line under the recurrence — "Paused", "Next run in 2h". */
  status,
  enabled,
  defaultEnabled = true,
  onEnabledChange,
  editLabel = "Edit schedule",
  onEdit,
  style = "card",
  className,
}: {
  title: string;
  description?: string;
  frequency?: string;
  status?: string;
  enabled?: boolean;
  defaultEnabled?: boolean;
  onEnabledChange?: (enabled: boolean) => void;
  editLabel?: string;
  onEdit?: () => void;
  className?: string;
} & VariantProps<typeof scheduledTaskCardVariants>) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultEnabled);
  const isOn = enabled ?? uncontrolled;

  const toggle = (next: boolean) => {
    if (enabled === undefined) setUncontrolled(next);
    onEnabledChange?.(next);
  };

  if (style === "compact") {
    return (
      <div className={cn(scheduledTaskCardVariants({ style }), className)}>
        <CalendarClock className="size-3.5 shrink-0 text-muted-foreground" strokeWidth={1.75} />
        <span
          className={cn(
            "min-w-0 flex-1 truncate text-xs",
            !isOn && "text-muted-foreground line-through"
          )}
        >
          {title}
        </span>
        {frequency && (
          <span className="shrink-0 text-xs text-muted-foreground">{frequency}</span>
        )}
        <Switch size="sm" checked={isOn} onCheckedChange={toggle} aria-label={title} />
      </div>
    );
  }

  if (style === "list") {
    return (
      <div className={cn(scheduledTaskCardVariants({ style }), className)}>
        <CalendarClock className="size-4 shrink-0 text-muted-foreground" strokeWidth={1.75} />
        <div className="flex min-w-0 flex-1 flex-col">
          <span className={cn("truncate text-sm font-medium", !isOn && "text-muted-foreground")}>
            {title}
          </span>
          {frequency && (
            <span className="truncate text-xs text-muted-foreground">{frequency}</span>
          )}
        </div>
        <Switch checked={isOn} onCheckedChange={toggle} aria-label={title} />
      </div>
    );
  }

  return (
    <div className={cn(scheduledTaskCardVariants({ style }), className)}>
      <div className="flex items-center gap-2">
        <CalendarClock className="size-4.5 shrink-0 text-muted-foreground" strokeWidth={1.75} />
        <span
          className={cn(
            "min-w-0 flex-1 text-sm font-semibold",
            !isOn && "text-muted-foreground"
          )}
        >
          {title}
        </span>
        <Switch checked={isOn} onCheckedChange={toggle} aria-label={title} />
      </div>

      {description && <p className="text-xs text-muted-foreground">{description}</p>}

      {frequency && (
        <div className="flex items-center gap-1.5 text-xs">
          <Repeat className="size-3.5 shrink-0 text-muted-foreground" strokeWidth={1.75} />
          {frequency}
        </div>
      )}

      {status && <span className="text-xs text-muted-foreground">{status}</span>}

      <div>
        <Button variant="outline" size="sm" onClick={onEdit}>
          {editLabel}
        </Button>
      </div>
    </div>
  );
}
