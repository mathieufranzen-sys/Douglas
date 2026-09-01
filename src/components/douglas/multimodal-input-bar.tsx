"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Plus, Paperclip, ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { VoiceStatusPill, type VoiceState } from "@/components/douglas/voice-status-pill";

const multimodalInputBarVariants = cva("bg-card text-card-foreground transition-colors", {
  variants: {
    style: {
      // Input above, toolbar below.
      default: "flex flex-col gap-2 rounded-xl border p-3",
      // Single row, no toolbar.
      compact: "flex items-center gap-1 rounded-md border py-1 pr-1 pl-3",
      // Taller composer for long prompts.
      expanded: "flex flex-col gap-3 rounded-2xl border p-3",
    },
    state: {
      default: "",
      filled: "",
      focus: "border-ring ring-3 ring-ring/50",
      disabled: "pointer-events-none opacity-50",
    },
  },
  defaultVariants: { style: "default", state: "default" },
});

export function MultimodalInputBar({
  placeholder = "Type a message…",
  value,
  onValueChange,
  onSubmit,
  /** Rendered between the attachment buttons and the send action — parameter selectors. */
  children,
  voiceState = "idle",
  onVoiceClick,
  style = "default",
  state,
  className,
}: {
  placeholder?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  children?: React.ReactNode;
  voiceState?: VoiceState;
  onVoiceClick?: () => void;
  className?: string;
} & VariantProps<typeof multimodalInputBarVariants>) {
  const [uncontrolled, setUncontrolled] = React.useState("");
  const [focused, setFocused] = React.useState(false);
  const text = value ?? uncontrolled;

  const setText = (next: string) => {
    if (value === undefined) setUncontrolled(next);
    onValueChange?.(next);
  };

  const submit = () => {
    if (!text.trim()) return;
    onSubmit?.(text.trim());
    setText("");
  };

  // State is derived unless the caller pins it — that's what makes the showcase honest.
  const resolvedState =
    state ?? (focused ? "focus" : text.trim().length > 0 ? "filled" : "default");
  const disabled = resolvedState === "disabled";

  const field = (
    <textarea
      value={text}
      onChange={(e) => setText(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          submit();
        }
      }}
      placeholder={placeholder}
      rows={style === "expanded" ? 2 : 1}
      disabled={disabled}
      aria-label={placeholder}
      className="w-full resize-none bg-transparent px-1 text-sm outline-none placeholder:text-muted-foreground"
    />
  );

  if (style === "compact") {
    return (
      <div className={cn(multimodalInputBarVariants({ style, state: resolvedState }), className)}>
        {field}
        <Button size="icon-sm" className="rounded-md" onClick={submit} disabled={!text.trim()}>
          <ArrowRight strokeWidth={1.75} />
        </Button>
      </div>
    );
  }

  return (
    <div className={cn(multimodalInputBarVariants({ style, state: resolvedState }), className)}>
      {field}
      {/* Wraps rather than overflowing: with parameter selectors passed in as children,
          the toolbar outgrows a narrow bar — in a phone-width chat panel the send button
          was being clipped off the right edge. ml-auto rather than justify-between on the
          row, so send stays hard right whether or not the group has wrapped onto a line
          of its own; justify-between would leave it at flex-start once alone. */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex min-w-0 items-center gap-1">
          <Button variant="ghost" size="icon-lg" aria-label="Add context">
            <Plus strokeWidth={1.75} />
          </Button>
          <Button variant="ghost" size="icon-lg" aria-label="Attach a file">
            <Paperclip strokeWidth={1.75} />
          </Button>
          <VoiceStatusPill
            state={voiceState}
            onClick={onVoiceClick}
            className={voiceState === "idle" ? "size-9 justify-center px-0" : undefined}
            label={voiceState === "idle" ? "" : undefined}
          />
        </div>
        <div className="ml-auto flex min-w-0 flex-wrap items-center justify-end gap-1">
          {children}
          <Button
            size="icon-lg"
            className="rounded-md"
            onClick={submit}
            disabled={!text.trim()}
            aria-label="Send"
          >
            <ArrowRight strokeWidth={1.75} />
          </Button>
        </div>
      </div>
    </div>
  );
}
