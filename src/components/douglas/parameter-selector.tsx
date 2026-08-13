"use client";

import { ChevronDown, Check, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * The generic trigger + menu the design system reuses whenever an agent parameter
 * (model, tone, autonomy, effort) has to be picked from a toolbar.
 */
export function ParameterSelector({
  label,
  hint,
  children,
  variant = "ghost",
  disabled,
  className,
  contentClassName,
}: {
  label: string;
  /** Trailing muted qualifier, e.g. the "Moyen" in "Fable 5 Moyen". */
  hint?: string;
  children: React.ReactNode;
  variant?: "ghost" | "outline";
  disabled?: boolean;
  className?: string;
  contentClassName?: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={disabled}
        render={<Button variant={variant} size="lg" className={cn("text-xs", className)} />}
      >
        <span>
          {label}
          {hint && <span className="ml-1 text-muted-foreground">{hint}</span>}
        </span>
        <ChevronDown data-icon="inline-end" strokeWidth={1.75} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className={cn("w-[17rem]", contentClassName)}>
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** Item / Label — a title, an optional description, and a check when Active. */
export function ParameterSelectorItem({
  label,
  description,
  icon: Icon,
  active,
  disabled,
  onSelect,
  className,
}: {
  label: string;
  description?: string;
  icon?: LucideIcon;
  active?: boolean;
  disabled?: boolean;
  onSelect?: () => void;
  className?: string;
}) {
  return (
    <DropdownMenuItem
      disabled={disabled}
      onClick={onSelect}
      data-active={active ? "" : undefined}
      className={cn("items-start gap-2 px-2 py-1.5", className)}
    >
      {Icon && <Icon className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />}
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-sm">{label}</span>
        {description && (
          <span className="text-xs text-muted-foreground">{description}</span>
        )}
      </span>
      {active && <Check className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />}
    </DropdownMenuItem>
  );
}

/** Item / SubTrigger — opens a nested set of parameter values. */
export function ParameterSelectorSub({
  label,
  icon: Icon,
  disabled,
  children,
}: {
  label: string;
  icon?: LucideIcon;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger disabled={disabled} className="gap-2 px-2 py-1.5">
        {Icon && <Icon className="size-4 shrink-0" strokeWidth={1.75} />}
        <span className="flex-1 truncate text-sm">{label}</span>
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent className="w-56">{children}</DropdownMenuSubContent>
    </DropdownMenuSub>
  );
}

/** Item / Switch — a boolean parameter toggled without dismissing the menu. */
export function ParameterSelectorSwitchItem({
  label,
  description,
  checked,
  onCheckedChange,
  disabled,
}: {
  label: string;
  description?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <DropdownMenuItem
      closeOnClick={false}
      disabled={disabled}
      onClick={() => onCheckedChange?.(!checked)}
      className="items-center gap-2 px-2 py-1.5"
    >
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-sm">{label}</span>
        {description && (
          <span className="text-xs text-muted-foreground">{description}</span>
        )}
      </span>
      <Switch
        size="sm"
        checked={checked}
        onCheckedChange={(next) => onCheckedChange?.(next)}
        disabled={disabled}
        aria-label={label}
      />
    </DropdownMenuItem>
  );
}

export { DropdownMenuSeparator as ParameterSelectorSeparator };
