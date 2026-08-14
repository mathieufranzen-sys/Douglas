"use client";

import * as React from "react";
import { MessageCircleQuestion } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export type AgentQuestionStyle = "choices" | "freeText" | "freeTextArea" | "compact";

export function AgentQuestionCard({
  question,
  /** Choices style: the buttons offered. Ignored by the free-text styles. */
  options = [],
  /** Progress marker such as "1/3". */
  step,
  /** Choices style also accepts a typed answer through this placeholder. */
  otherPlaceholder = "Other answer…",
  placeholder = "Type your answer…",
  submitLabel = "Send",
  onAnswer,
  style = "choices",
  className,
}: {
  question: string;
  options?: string[];
  step?: string;
  otherPlaceholder?: string;
  placeholder?: string;
  submitLabel?: string;
  onAnswer?: (answer: string) => void;
  style?: AgentQuestionStyle;
  className?: string;
}) {
  const [selected, setSelected] = React.useState<string | null>(null);
  const [draft, setDraft] = React.useState("");

  const answer = (value: string) => {
    if (!value.trim()) return;
    setSelected(value);
    onAnswer?.(value);
    setDraft("");
  };

  const header = (
    <div className="flex items-center gap-2">
      <MessageCircleQuestion className="size-4 shrink-0 text-muted-foreground" strokeWidth={1.75} />
      <span className="min-w-0 flex-1 truncate text-sm font-semibold">{question}</span>
      {step && <span className="shrink-0 text-xs text-muted-foreground">{step}</span>}
    </div>
  );

  // Compact — a single line for a dense thread, no answer affordance of its own.
  if (style === "compact") {
    return (
      <div
        className={cn(
          "flex items-center gap-2 rounded-md border bg-card px-3 py-2 text-card-foreground",
          className
        )}
      >
        {header}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-3.5 rounded-md border bg-card p-4 text-card-foreground shadow-sm",
        className
      )}
    >
      {header}

      {style === "choices" && (
        <div className="flex flex-col gap-2">
          {options.map((option) => (
            <Button
              key={option}
              variant="outline"
              size="lg"
              onClick={() => answer(option)}
              className={cn(
                "justify-start",
                selected === option && "border-primary bg-muted"
              )}
            >
              {option}
            </Button>
          ))}
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") answer(draft);
            }}
            placeholder={otherPlaceholder}
            aria-label={otherPlaceholder}
          />
        </div>
      )}

      {style === "freeText" && (
        <div className="flex items-center gap-2">
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") answer(draft);
            }}
            placeholder={placeholder}
            aria-label={question}
          />
          <Button size="lg" onClick={() => answer(draft)} disabled={!draft.trim()}>
            {submitLabel}
          </Button>
        </div>
      )}

      {style === "freeTextArea" && (
        <div className="flex flex-col items-end gap-2">
          <Textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={placeholder}
            aria-label={question}
            rows={3}
          />
          <Button size="lg" onClick={() => answer(draft)} disabled={!draft.trim()}>
            {submitLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
