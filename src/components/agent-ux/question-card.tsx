"use client";

import * as React from "react";
import { MessageCircleQuestion } from "lucide-react";
import { cn } from "@/lib/utils";

export function QuestionCard({
  question,
  options,
  step,
  onSelect,
}: {
  question: string;
  options: string[];
  step?: string;
  onSelect?: (option: string) => void;
}) {
  const [selected, setSelected] = React.useState<string | null>(null);

  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-card p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircleQuestion className="size-4 text-muted-foreground" strokeWidth={1.75} />
          <span className="text-sm font-medium">{question}</span>
        </div>
        {step && <span className="text-xs text-muted-foreground">{step}</span>}
      </div>
      <div className="flex flex-col gap-2">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => {
              setSelected(option);
              onSelect?.(option);
            }}
            className={cn(
              "w-full rounded-lg border px-3 py-2 text-left text-sm transition-colors hover:bg-accent",
              selected === option && "border-primary bg-accent"
            )}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
