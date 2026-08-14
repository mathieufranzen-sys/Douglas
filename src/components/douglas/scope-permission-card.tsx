"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";

const scopePermissionCardVariants = cva("flex items-center bg-card", {
  variants: {
    style: {
      // Label + description + switch: the settings-page presentation.
      default: "gap-3 rounded-lg border p-3 shadow-sm",
      // Label + switch only.
      compact: "gap-3 rounded-lg border px-3 py-2",
      // Category glyph + label + switch, sized to stack inside ScopePermissionGroup.
      grouped: "gap-2.5 px-3 py-2.5",
    },
  },
  defaultVariants: { style: "default" },
});

export function ScopePermissionCard({
  label,
  description,
  icon: Icon,
  checked,
  onCheckedChange,
  disabled,
  style = "default",
  className,
}: {
  label: string;
  /** Rendered by the Default style only. */
  description?: string;
  /** The category glyph the Grouped style leads with. */
  icon?: LucideIcon;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
} & VariantProps<typeof scopePermissionCardVariants>) {
  return (
    <div className={cn(scopePermissionCardVariants({ style }), className)}>
      {style === "grouped" && Icon && (
        <Icon className="size-4 shrink-0 text-muted-foreground" strokeWidth={1.75} />
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-xs font-medium text-card-foreground">{label}</span>
        {style === "default" && description && (
          <span className="text-xs text-muted-foreground">{description}</span>
        )}
      </div>
      <Switch
        checked={checked}
        onCheckedChange={(next) => onCheckedChange?.(next)}
        disabled={disabled}
        aria-label={label}
      />
    </div>
  );
}

/** Wraps stacked Grouped items into the single bordered block the design shows. */
export function ScopePermissionGroup({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-lg border shadow-sm *:not-last:border-b",
        className
      )}
    >
      {children}
    </div>
  );
}
