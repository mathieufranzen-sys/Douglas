import { cva, type VariantProps } from "class-variance-authority";
import { ChevronRight, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const sourceChipVariants = cva(
  "inline-flex max-w-full items-center gap-1.5 whitespace-nowrap",
  {
    variants: {
      style: {
        default: "rounded-md border bg-card px-2 py-0.5 text-xs font-medium",
        result: "rounded-md border bg-card px-2 py-0.5 text-xs font-medium",
        compact: "rounded-md border bg-card px-1.5 py-0.5 text-xs",
        citation:
          "rounded-full bg-muted px-1.5 text-[0.6875rem] leading-4 font-medium text-muted-foreground",
      },
    },
    defaultVariants: { style: "default" },
  }
);

export function SourceChip({
  label,
  icon: Icon,
  detail,
  style = "default",
  href,
  className,
  ...props
}: {
  label: string;
  /** Provider glyph — omitted on the Citation style, which is a bare index marker. */
  icon?: LucideIcon;
  /** Result style only: the snippet or count shown after the label. */
  detail?: string;
  href?: string;
  className?: string;
} & VariantProps<typeof sourceChipVariants> &
  Omit<React.ComponentProps<"span">, "style">) {
  const isCitation = style === "citation";

  return (
    <span className={cn(sourceChipVariants({ style }), className)} {...props}>
      {/* The glyph carries the brand colour: a source chip points at a real system, and
          that is the one thing worth spotting in a row of otherwise grey chips. */}
      {Icon && !isCitation && (
        <Icon className="size-3.5 shrink-0 text-primary" strokeWidth={1.75} />
      )}
      <span className="truncate">{label}</span>
      {style === "result" && detail && (
        <span className="truncate text-muted-foreground">{detail}</span>
      )}
      {href && !isCitation && (
        <ChevronRight className="size-3.5 shrink-0 text-muted-foreground" strokeWidth={1.75} />
      )}
    </span>
  );
}
