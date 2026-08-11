"use client";

import * as React from "react";
import { Switch } from "@/components/ui/switch";
import { Clock } from "lucide-react";

export function ScheduledTaskCard({
  title,
  description,
  frequency,
  nextRun,
  defaultActive = true,
}: {
  title: string;
  description: string;
  frequency: string;
  nextRun: string;
  defaultActive?: boolean;
}) {
  const [active, setActive] = React.useState(defaultActive);

  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border bg-card p-4">
      <div className="flex flex-col gap-1">
        <span className={active ? "text-sm font-medium" : "text-sm font-medium text-muted-foreground"}>
          {title}
        </span>
        <span className="text-xs text-muted-foreground">{description}</span>
        <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="size-3" strokeWidth={1.75} />
          {frequency} · next run {nextRun}
        </div>
      </div>
      <Switch checked={active} onCheckedChange={setActive} />
    </div>
  );
}
