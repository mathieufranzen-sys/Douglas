"use client";

import { TriangleAlert } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  ParameterSelector,
  ParameterSelectorItem,
} from "@/components/agent-ux/parameter-selector";

export type ConflictOption = {
  id: string;
  label: string;
  description?: string;
};

/**
 * Raised when the agent found more than one defensible reading of the request and
 * refuses to guess. Warning-toned rather than destructive: nothing failed yet.
 */
export function ConflictAmbiguityCard({
  title,
  description,
  options,
  onSelect,
  /** Card and List explain, Choices is compact, Dropdown collapses to a trigger. */
  style = "card",
  selectLabel = "Pick one",
  className,
}: {
  title: string;
  description?: string;
  options: ConflictOption[];
  onSelect?: (id: string) => void;
  style?: "card" | "list" | "dropdown" | "choices";
  selectLabel?: string;
  className?: string;
}) {
  const header = (
    <div className="flex items-start gap-2">
      <TriangleAlert className="mt-0.5 size-4 shrink-0 text-warning" strokeWidth={1.75} />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="text-sm font-semibold">{title}</span>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
    </div>
  );

  if (style === "dropdown") {
    return (
      <div
        className={cn(
          "flex flex-col gap-3 rounded-lg border border-warning/30 bg-warning/5 p-3",
          className
        )}
      >
        {header}
        <ParameterSelector label={selectLabel} variant="outline" className="w-fit">
          {options.map((option) => (
            <ParameterSelectorItem
              key={option.id}
              label={option.label}
              description={option.description}
              onSelect={() => onSelect?.(option.id)}
            />
          ))}
        </ParameterSelector>
      </div>
    );
  }

  if (style === "choices") {
    return (
      <div
        className={cn(
          "flex flex-col gap-2 rounded-lg border border-warning/30 bg-warning/5 p-3",
          className
        )}
      >
        {header}
        <div className="flex flex-wrap gap-2">
          {options.map((option) => (
            <Button
              key={option.id}
              variant="outline"
              size="sm"
              onClick={() => onSelect?.(option.id)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>
    );
  }

  if (style === "list") {
    return (
      <div
        className={cn(
          "flex flex-col gap-3 rounded-lg border border-warning/30 bg-warning/5 p-3",
          className
        )}
      >
        {header}
        <div className="flex flex-col overflow-hidden rounded-lg border bg-card">
          {options.map((option, i) => (
            <button
              key={option.id}
              type="button"
              onClick={() => onSelect?.(option.id)}
              className={cn(
                "flex flex-col items-start gap-0.5 px-3 py-2 text-left transition-colors hover:bg-muted/50",
                i > 0 && "border-t"
              )}
            >
              <span className="text-sm font-medium">{option.label}</span>
              {option.description && (
                <span className="text-xs text-muted-foreground">{option.description}</span>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-lg border border-warning/30 bg-warning/5 p-4",
        className
      )}
    >
      {header}
      <div className="flex flex-col gap-2">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onSelect?.(option.id)}
            className="flex flex-col items-start gap-0.5 rounded-lg border bg-card px-3 py-2 text-left transition-colors hover:bg-muted/50"
          >
            <span className="text-sm font-medium">{option.label}</span>
            {option.description && (
              <span className="text-xs text-muted-foreground">{option.description}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
