"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { FileIcon, Download, Loader2, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const artifactCardVariants = cva("bg-card text-card-foreground", {
  variants: {
    style: {
      card: "flex flex-col gap-3 rounded-xl border p-3 shadow-sm",
      compact: "flex items-center gap-3 rounded-lg border px-3 py-2",
      inline: "inline-flex items-center gap-2 rounded-full border px-3 py-1.5",
    },
  },
  defaultVariants: { style: "card" },
});

export function ArtifactCard({
  title,
  /** File weight, page count, or whatever secondary line the artifact carries. */
  meta,
  icon: Icon = FileIcon,
  /** While true the card shows the generating label and the progress track. */
  generating,
  /** 0–100. Omit for an indeterminate bar. */
  progress,
  generatingLabel = "Generating…",
  downloadLabel = "Download",
  onDownload,
  style = "card",
  className,
}: {
  title: string;
  meta?: string;
  icon?: LucideIcon;
  generating?: boolean;
  progress?: number;
  generatingLabel?: string;
  downloadLabel?: string;
  onDownload?: () => void;
  className?: string;
} & VariantProps<typeof artifactCardVariants>) {
  if (style === "inline") {
    return (
      <span className={cn(artifactCardVariants({ style }), className)}>
        {generating ? (
          <Loader2 className="size-3.5 shrink-0 animate-spin text-muted-foreground" strokeWidth={1.75} />
        ) : (
          <Icon className="size-3.5 shrink-0 text-muted-foreground" strokeWidth={1.75} />
        )}
        <span className="truncate text-xs font-medium">{title}</span>
      </span>
    );
  }

  if (style === "compact") {
    return (
      <div className={cn(artifactCardVariants({ style }), className)}>
        <Icon className="size-4 shrink-0 text-muted-foreground" strokeWidth={1.75} />
        <span className="min-w-0 flex-1 truncate text-sm font-medium">{title}</span>
        {meta && <span className="shrink-0 text-xs text-muted-foreground">{meta}</span>}
        {!generating && (
          <Button variant="ghost" size="icon-sm" onClick={onDownload} aria-label={downloadLabel}>
            <Download strokeWidth={1.75} />
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={cn(artifactCardVariants({ style }), className)}>
      <div className="flex items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
          {generating ? (
            <Loader2 className="size-4 animate-spin text-muted-foreground" strokeWidth={1.75} />
          ) : (
            <Icon className="size-4 text-muted-foreground" strokeWidth={1.75} />
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-sm font-medium">{title}</span>
          <span className="text-xs text-muted-foreground">
            {generating ? generatingLabel : meta}
          </span>
        </div>
      </div>

      {generating && (
        <div
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          className="h-1 w-full overflow-hidden rounded-full bg-muted"
        >
          <div
            className={cn(
              "h-full rounded-full bg-primary transition-[width] duration-500",
              progress === undefined && "w-1/3 animate-pulse"
            )}
            style={progress === undefined ? undefined : { width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      )}

      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={onDownload} disabled={generating}>
          <Download data-icon="inline-start" strokeWidth={1.75} />
          {downloadLabel}
        </Button>
      </div>
    </div>
  );
}
