import { cn } from "@/lib/utils";

/**
 * The in-screen product sidebar the mockups carry, distinct from the theme panel that
 * frames them. Kept generic so all three screens share one nav shell.
 */
export function ScreenNav({
  title,
  badge,
  children,
  footer,
  className,
}: {
  title: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}) {
  return (
    <nav
      className={cn(
        "flex w-[225px] shrink-0 flex-col justify-between gap-4 border-r bg-background p-3",
        className
      )}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 px-1">
          <span className="flex size-5 shrink-0 items-center justify-center rounded-md bg-primary text-[0.625rem] font-semibold text-primary-foreground">
            ⌘
          </span>
          <span className="text-sm font-semibold">{title}</span>
          {badge}
        </div>
        {children}
      </div>
      {footer}
    </nav>
  );
}

export function ScreenNavGroup({ label, children }: { label?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      {label && (
        <span className="px-2 pt-2 pb-1 text-xs text-muted-foreground">{label}</span>
      )}
      {children}
    </div>
  );
}

export function ScreenNavItem({
  icon: Icon,
  label,
  count,
  shortcut,
  active,
  trailingChevron,
}: {
  icon?: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  count?: number;
  shortcut?: string;
  active?: boolean;
  trailingChevron?: boolean;
}) {
  return (
    <button
      type="button"
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors",
        active ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
      )}
    >
      {Icon && <Icon className="size-4 shrink-0" strokeWidth={1.75} />}
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {count !== undefined && <span className="shrink-0 text-xs">{count}</span>}
      {shortcut && <span className="shrink-0 text-xs">{shortcut}</span>}
      {trailingChevron && <span className="shrink-0 text-xs">›</span>}
    </button>
  );
}
