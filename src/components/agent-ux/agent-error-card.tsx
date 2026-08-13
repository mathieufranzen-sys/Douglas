import { cva, type VariantProps } from "class-variance-authority";
import { CircleAlert } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const agentErrorCardVariants = cva("text-foreground", {
  variants: {
    style: {
      // Full explanation with two ways out.
      card: "flex flex-col gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4",
      // Floating, transient.
      toast:
        "flex w-fit items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 shadow-md",
      // One line inside the message flow.
      inline: "flex items-center gap-2 rounded-md bg-destructive/10 px-3 py-2",
      // Full-width strip at the top of a region.
      banner: "flex w-full items-center gap-2 rounded-lg bg-destructive/20 px-3 py-2",
    },
  },
  defaultVariants: { style: "card" },
});

export function AgentErrorCard({
  title,
  /** Card style only — the toast, inline and banner styles stay to one line. */
  description,
  retryLabel = "Retry",
  handOffLabel = "Take over",
  onRetry,
  onHandOff,
  style = "card",
  className,
}: {
  title: string;
  description?: string;
  retryLabel?: string;
  handOffLabel?: string;
  onRetry?: () => void;
  onHandOff?: () => void;
  className?: string;
} & VariantProps<typeof agentErrorCardVariants>) {
  if (style === "card") {
    return (
      <div className={cn(agentErrorCardVariants({ style }), className)}>
        <div className="flex items-start gap-2">
          <CircleAlert className="mt-0.5 size-4 shrink-0 text-destructive" strokeWidth={1.75} />
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium text-destructive">{title}</span>
            {description && (
              <span className="text-xs text-muted-foreground">{description}</span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onHandOff}>
            {handOffLabel}
          </Button>
          <Button size="sm" onClick={onRetry}>
            {retryLabel}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(agentErrorCardVariants({ style }), className)}>
      <CircleAlert className="size-4 shrink-0 text-destructive" strokeWidth={1.75} />
      <span className="min-w-0 flex-1 truncate text-xs">{title}</span>
      <Button variant="outline" size="xs" onClick={onRetry}>
        {retryLabel}
      </Button>
    </div>
  );
}
