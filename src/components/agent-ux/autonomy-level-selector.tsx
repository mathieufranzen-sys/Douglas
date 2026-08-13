"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  ParameterSelector,
  ParameterSelectorItem,
} from "@/components/agent-ux/parameter-selector";

export type AutonomyLevel = "suggest" | "confirm" | "autonomous";

export const AUTONOMY_LEVELS: {
  value: AutonomyLevel;
  label: string;
  description: string;
}[] = [
  {
    value: "suggest",
    label: "Suggest only",
    description: "The agent proposes, you execute every step yourself.",
  },
  {
    value: "confirm",
    label: "Confirm before acting",
    description: "The agent asks for a green light before each action.",
  },
  {
    value: "autonomous",
    label: "Act autonomously",
    description: "The agent acts alone and reports afterwards.",
  },
];

export function AutonomyLevelSelector({
  value,
  defaultValue = "confirm",
  onValueChange,
  /** Segmented for a toolbar, List for a settings page, Dropdown for a dense bar. */
  style = "segmented",
  className,
}: {
  value?: AutonomyLevel;
  defaultValue?: AutonomyLevel;
  onValueChange?: (value: AutonomyLevel) => void;
  style?: "segmented" | "list" | "dropdown";
  className?: string;
}) {
  const [uncontrolled, setUncontrolled] = React.useState<AutonomyLevel>(defaultValue);
  const current = value ?? uncontrolled;

  const select = React.useCallback(
    (next: AutonomyLevel) => {
      if (value === undefined) setUncontrolled(next);
      onValueChange?.(next);
    },
    [value, onValueChange]
  );

  const active = AUTONOMY_LEVELS.find((l) => l.value === current) ?? AUTONOMY_LEVELS[1];

  if (style === "dropdown") {
    return (
      <ParameterSelector
        label={active.label}
        variant="outline"
        className={cn("w-full justify-between", className)}
      >
        {AUTONOMY_LEVELS.map((level) => (
          <ParameterSelectorItem
            key={level.value}
            label={level.label}
            description={level.description}
            active={level.value === current}
            onSelect={() => select(level.value)}
          />
        ))}
      </ParameterSelector>
    );
  }

  if (style === "list") {
    return (
      <RadioGroup
        value={current}
        onValueChange={(next) => select(next as AutonomyLevel)}
        className={cn("flex w-full flex-col gap-0 overflow-hidden rounded-lg border", className)}
      >
        {AUTONOMY_LEVELS.map((level, i) => (
          <label
            key={level.value}
            className={cn(
              "flex cursor-pointer items-start gap-3 p-3 transition-colors hover:bg-muted/50",
              i > 0 && "border-t"
            )}
          >
            <RadioGroupItem value={level.value} className="mt-0.5" />
            <span className="flex flex-col gap-0.5">
              <span className="text-sm font-medium">{level.label}</span>
              <span className="text-xs text-muted-foreground">{level.description}</span>
            </span>
          </label>
        ))}
      </RadioGroup>
    );
  }

  return (
    <div
      role="radiogroup"
      aria-label="Autonomy level"
      className={cn("flex w-full items-stretch overflow-hidden rounded-lg border bg-popover", className)}
    >
      {AUTONOMY_LEVELS.map((level) => {
        const selected = level.value === current;
        return (
          <button
            key={level.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => select(level.value)}
            className={cn(
              "flex-1 px-3 py-2 text-xs font-medium transition-colors",
              selected
                ? "bg-primary text-primary-foreground"
                : "text-popover-foreground hover:bg-muted"
            )}
          >
            {level.label}
          </button>
        );
      })}
    </div>
  );
}
