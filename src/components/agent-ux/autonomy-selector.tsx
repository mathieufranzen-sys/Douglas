"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const LEVELS = ["Suggest only", "Confirm before acting", "Act autonomously"];

export function AutonomySelector({
  defaultValue = LEVELS[1],
  onChange,
}: {
  defaultValue?: string;
  onChange?: (value: string) => void;
}) {
  const [value, setValue] = React.useState(defaultValue);

  return (
    <div className="inline-flex items-center gap-0.5 rounded-lg bg-muted p-1">
      {LEVELS.map((level) => (
        <button
          key={level}
          onClick={() => {
            setValue(level);
            onChange?.(level);
          }}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm transition-colors",
            value === level
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {level}
        </button>
      ))}
    </div>
  );
}
