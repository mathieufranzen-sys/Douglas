"use client";

import * as React from "react";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  ChevronRight,
  Code2,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

/** State in Figma: how far along this single reasoning step is. */
export type ReasoningState = "default" | "ongoing" | "done" | "error";

/** Style in Figma: the presentation this step takes inside the timeline. */
export type ReasoningStyle = "simple" | "tool" | "code" | "accordion";

function StateIcon({ state, icon: Icon }: { state: ReasoningState; icon?: LucideIcon }) {
  if (state === "ongoing") {
    return <Loader2 className="size-4 shrink-0 animate-spin text-muted-foreground" strokeWidth={1.75} />;
  }
  if (state === "error") {
    return <XCircle className="size-4 shrink-0 text-destructive" strokeWidth={1.75} />;
  }
  if (state === "done") {
    return <CheckCircle2 className="size-4 shrink-0 text-muted-foreground" strokeWidth={1.75} />;
  }
  const Glyph = Icon ?? CheckCircle2;
  return <Glyph className="size-4 shrink-0 text-muted-foreground" strokeWidth={1.75} />;
}

/**
 * One atomic step. Repeat it to build the trace; set showConnector={false} on the last
 * one so the vertical rule stops there.
 */
export function ReasoningTimeline({
  title,
  description,
  timestamp,
  icon,
  /** Detailed=false collapses to a single dense line with no description or connector. */
  detailed = true,
  state = "default",
  style = "simple",
  showConnector = true,
  /** Code style: the payload rendered in the monospace block. */
  code,
  /** Accordion style: the body revealed when the row is expanded. */
  children,
  defaultOpen = false,
  className,
}: {
  title: string;
  description?: string;
  timestamp?: string;
  icon?: LucideIcon;
  detailed?: boolean;
  state?: ReasoningState;
  style?: ReasoningStyle;
  showConnector?: boolean;
  code?: string;
  children?: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}) {
  const [open, setOpen] = React.useState(defaultOpen);

  if (style === "accordion") {
    return (
      <div className={cn("flex flex-col rounded-lg border bg-card", className)}>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="flex items-center gap-2 px-3 py-2.5 text-left"
        >
          <StateIcon state={state} icon={icon} />
          <span
            className={cn(
              "min-w-0 flex-1 truncate text-sm font-medium",
              state === "error" && "text-destructive"
            )}
          >
            {title}
          </span>
          {timestamp && (
            <span className="shrink-0 text-xs text-muted-foreground">{timestamp}</span>
          )}
          <ChevronRight
            className={cn(
              "size-4 shrink-0 text-muted-foreground transition-transform",
              open && "rotate-90"
            )}
            strokeWidth={1.75}
          />
        </button>
        {open && (
          <div className="border-t px-3 py-2.5 text-xs text-muted-foreground">
            {children ?? description}
          </div>
        )}
      </div>
    );
  }

  // Detailed=false — the compact one-liner used to stack a dozen steps tightly.
  if (!detailed) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        {style === "tool" ? (
          <span className="inline-flex items-center gap-1.5 rounded-md border bg-card px-1.5 py-0.5">
            <StateIcon state={state} icon={icon} />
            <span
              className={cn(
                "truncate text-xs",
                state === "error" ? "text-destructive" : "text-foreground"
              )}
            >
              {title}
            </span>
          </span>
        ) : (
          <>
            <StateIcon state={state} icon={icon} />
            <span
              className={cn(
                "min-w-0 flex-1 truncate text-xs",
                state === "error" ? "text-destructive" : "text-muted-foreground"
              )}
            >
              {title}
            </span>
          </>
        )}
        {timestamp && <span className="shrink-0 text-xs text-muted-foreground">{timestamp}</span>}
      </div>
    );
  }

  return (
    <div className={cn("flex gap-3", className)}>
      <div className="flex flex-col items-center">
        <StateIcon state={state} icon={icon} />
        {showConnector && <div className="mt-1 w-px flex-1 bg-border" />}
      </div>
      <div className={cn("flex min-w-0 flex-1 flex-col gap-1", showConnector ? "pb-4" : "pb-0")}>
        <div className="flex items-baseline gap-2">
          <span
            className={cn(
              "text-sm font-medium",
              state === "error" ? "text-destructive" : "text-foreground"
            )}
          >
            {title}
          </span>
          {timestamp && <span className="text-xs text-muted-foreground">{timestamp}</span>}
        </div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
        {style === "code" && code && (
          <pre className="mt-1 max-w-full overflow-x-auto rounded-lg border bg-muted/40 p-3 font-mono text-xs text-muted-foreground">
            <code>{code}</code>
          </pre>
        )}
        {style === "tool" && children}
      </div>
    </div>
  );
}

/** The "Thinking process for 21s" summary that heads a collapsed trace. */
export function ReasoningTimelineSummary({
  label,
  onClick,
  className,
}: {
  label: string;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground",
        className
      )}
    >
      <Code2 className="size-3.5" strokeWidth={1.75} />
      {label}
    </button>
  );
}
