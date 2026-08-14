"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Send } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AutonomyLevelSelector,
  type AutonomyLevel,
} from "@/components/douglas/autonomy-level-selector";

const delegationCardVariants = cva("bg-card text-card-foreground", {
  variants: {
    style: {
      // Formulaire complet bloquant.
      modal: "flex flex-col gap-4 rounded-xl border p-6 shadow-sm",
      // Formulaire embarqué dans le flux.
      inline: "flex flex-col gap-4 rounded-lg border p-4 shadow-sm",
      // Délégation rapide sur une ligne.
      compact: "flex items-center gap-2 rounded-lg border p-2",
    },
  },
  defaultVariants: { style: "modal" },
});

export type DelegationDraft = {
  task: string;
  duration: string;
  autonomy: AutonomyLevel;
};

export function DelegationCard({
  title = "Delegate a task",
  taskLabel = "Task",
  taskPlaceholder = "e.g. Watch my inbox for invoice replies and flag late ones",
  durationLabel = "Duration",
  durationPlaceholder = "e.g. 30 days",
  autonomyLabel = "Autonomy level",
  submitLabel = "Delegate",
  cancelLabel = "Cancel",
  defaultAutonomy = "confirm",
  onSubmit,
  onCancel,
  style = "modal",
  className,
}: {
  title?: string;
  taskLabel?: string;
  taskPlaceholder?: string;
  durationLabel?: string;
  durationPlaceholder?: string;
  autonomyLabel?: string;
  submitLabel?: string;
  cancelLabel?: string;
  defaultAutonomy?: AutonomyLevel;
  onSubmit?: (draft: DelegationDraft) => void;
  onCancel?: () => void;
  className?: string;
} & VariantProps<typeof delegationCardVariants>) {
  const [task, setTask] = React.useState("");
  const [duration, setDuration] = React.useState("");
  const [autonomy, setAutonomy] = React.useState<AutonomyLevel>(defaultAutonomy);

  const submit = () => {
    if (!task.trim()) return;
    onSubmit?.({ task: task.trim(), duration: duration.trim(), autonomy });
    setTask("");
    setDuration("");
  };

  if (style === "compact") {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className={cn(delegationCardVariants({ style }), className)}
      >
        <Input
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder={taskPlaceholder}
          aria-label={taskLabel}
          className="h-8 flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0"
        />
        <Button type="submit" size="icon-sm" disabled={!task.trim()} aria-label={submitLabel}>
          <Send strokeWidth={1.75} />
        </Button>
      </form>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className={cn(delegationCardVariants({ style }), className)}
    >
      <h2 className="text-lg font-semibold">{title}</h2>

      <div className="flex flex-col gap-2">
        <Label htmlFor="delegation-task">{taskLabel}</Label>
        <Input
          id="delegation-task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder={taskPlaceholder}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="delegation-duration">{durationLabel}</Label>
        <Input
          id="delegation-duration"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder={durationPlaceholder}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>{autonomyLabel}</Label>
        <AutonomyLevelSelector
          style="dropdown"
          value={autonomy}
          onValueChange={setAutonomy}
          className="w-fit"
        />
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button type="button" variant="outline" size="lg" onClick={onCancel}>
          {cancelLabel}
        </Button>
        <Button type="submit" size="lg" disabled={!task.trim()}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
