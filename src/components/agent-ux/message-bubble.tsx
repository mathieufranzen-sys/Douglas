import { cn } from "@/lib/utils";

export function MessageBubble({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="flex justify-end">
      <div
        className={cn(
          "max-w-[70%] rounded-2xl bg-secondary px-4 py-3 text-sm text-secondary-foreground",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}
