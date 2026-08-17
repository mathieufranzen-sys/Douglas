"use client";

import * as React from "react";
import {
  PanelLeft,
  Search,
  Settings,
  RotateCcw,
  Pencil,
  ArrowDown,
  Table2,
  Database,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { MessageBubble } from "@/components/douglas/message-bubble";
import { MessageActionRow } from "@/components/douglas/message-action-row";
import { ArtifactCard } from "@/components/douglas/artifact-card";
import { SourceChip } from "@/components/douglas/source-chip";
import { ConfidenceBadge } from "@/components/douglas/confidence-badge";
import { MultimodalInputBar } from "@/components/douglas/multimodal-input-bar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const TABS = ["Dashboard", "Preview"] as const;

const DID_YOU_KNOW = [
  "Set roles and permissions by telling the chat what you need",
  "Ask for a schema change and the entities update in place",
  "Every generated screen inherits your active theme tokens",
];

export default function BuildConversationScreen() {
  const [tab, setTab] = React.useState<(typeof TABS)[number]>("Dashboard");
  const [progress, setProgress] = React.useState(45);
  const [tipIndex, setTipIndex] = React.useState(0);
  const [sent, setSent] = React.useState<string | null>(null);
  const building = progress < 100;

  React.useEffect(() => {
    if (!building) return;
    const id = window.setTimeout(() => setProgress((p) => Math.min(100, p + 5)), 800);
    return () => window.clearTimeout(id);
  }, [building, progress]);

  React.useEffect(() => {
    const id = window.setInterval(
      () => setTipIndex((i) => (i + 1) % DID_YOU_KNOW.length),
      4000
    );
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="flex min-w-0 flex-1 flex-col border-b">
      {/* Workspace bar */}
      <div className="flex h-14 shrink-0 items-center gap-3 border-b px-4">
        <Avatar className="size-6 shrink-0">
          <AvatarFallback className="text-[0.625rem]">CN</AvatarFallback>
        </Avatar>
        <span className="text-muted-foreground">/</span>
        <Avatar className="size-6 shrink-0">
          <AvatarFallback className="bg-primary text-[0.625rem] text-primary-foreground">
            CN
          </AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-xs font-medium">FlowStateFinance</span>
          <span className="truncate text-xs text-muted-foreground">Personal Workspace</span>
        </div>

        <Button variant="ghost" size="icon-sm" aria-label="Toggle panel">
          <PanelLeft strokeWidth={1.75} />
        </Button>

        <div className="flex items-center gap-0.5 rounded-lg bg-muted p-0.5">
          {TABS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setTab(item)}
              aria-pressed={tab === item}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                tab === item
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item}
            </button>
          ))}
        </div>

        <span className="text-muted-foreground">/</span>
        <div className="flex min-w-0 flex-1 items-center gap-2 text-muted-foreground">
          <Search className="size-4 shrink-0" strokeWidth={1.75} />
          <span className="truncate text-sm">Search</span>
        </div>

        <div className="flex items-center -space-x-1.5">
          {["CI", "CI", "CN"].map((initials, i) => (
            <Avatar key={i} className="size-6 shrink-0 ring-2 ring-background">
              <AvatarFallback className="text-[0.625rem]">{initials}</AvatarFallback>
            </Avatar>
          ))}
        </div>
        <Button variant="ghost" size="icon-sm" aria-label="Settings">
          <Settings strokeWidth={1.75} />
        </Button>
        <Button size="sm">Publish</Button>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 p-4 lg:grid-cols-2">
        {/* Chat side */}
        <div className="flex min-h-0 min-w-0 flex-col gap-3">
          <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pr-1">
            <div className="flex justify-end">
              <span className="inline-flex items-center gap-1.5 rounded-md border bg-card px-2 py-1 text-xs">
                <Table2 className="size-3.5 shrink-0 text-muted-foreground" strokeWidth={1.75} />
                csv
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              <MessageBubble>
                Buld an App for my finances. Here the csv with in/out money
              </MessageBubble>
              <div className="flex items-center justify-end gap-2 text-xs text-muted-foreground">
                2 hours ago
                <RotateCcw className="size-3.5" strokeWidth={1.75} />
                <Pencil className="size-3.5" strokeWidth={1.75} />
              </div>
            </div>

            <div className="flex flex-col gap-3 text-sm leading-relaxed">
              <p>
                I&apos;ll build a finance app with the blue-to-green gradient color scheme from
                your image. Here&apos;s my plan:
              </p>
              <p className="font-medium">Features:</p>
              <ol className="flex flex-col gap-1">
                <li>1. Dashboard — overview of balance, recent transactions, spending chart</li>
                <li>2. Transactions — add/view income &amp; expenses</li>
                <li>3. Budgets — set monthly budgets per category and track progress</li>
              </ol>
              <p>
                Design: Blue (#2563EB) to teal/green (#10B981) gradients, soft rounded cards,
                clean white backgrounds, modern typography.
              </p>
              <p className="font-medium">Structure:</p>
              <ul className="flex flex-col gap-1">
                <li>• Entities: Transaction, Budget</li>
                <li>• Layout with sidebar navigation</li>
                <li>• Dashboard, Transactions, and Budgets pages with focused components</li>
              </ul>
            </div>

            <ArtifactCard title="Finance Dashboard" meta="18.2 MB" style="compact" />

            <div className="flex flex-wrap gap-2">
              <SourceChip label="Wrote entities /Transaction" icon={Database} />
              <SourceChip label="Wrote entities /Budget" icon={Database} />
            </div>

            <div className="flex items-center gap-3">
              <MessageActionRow timestamp="2 hours ago" />
              <ConfidenceBadge level="high" style="dot" />
            </div>

            <div className="flex justify-center">
              <Button variant="outline" size="xs" className="rounded-full">
                <ArrowDown data-icon="inline-start" strokeWidth={1.75} />
                Latest message
              </Button>
            </div>
          </div>

          <MultimodalInputBar onSubmit={setSent} />
          {sent && (
            <span className="text-xs text-muted-foreground">Queued for the build: “{sent}”</span>
          )}
        </div>

        {/* Preview side */}
        <div className="flex min-h-0 min-w-0 items-center justify-center rounded-xl border bg-sidebar p-6">
          {building ? (
            <div className="flex w-full max-w-sm flex-col items-center gap-4 text-center">
              <span
                className="size-14 shrink-0 animate-pulse rounded-full bg-primary"
                aria-hidden
              />
              <span className="text-lg font-semibold">Building your idea…</span>
              <div
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Build progress"
                className="h-1 w-full overflow-hidden rounded-full bg-muted"
              >
                <div
                  className="h-full rounded-full bg-primary transition-[width] duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-sm text-muted-foreground">Did you know?</span>
              <p className="text-xs text-muted-foreground">{DID_YOU_KNOW[tipIndex]}</p>
            </div>
          ) : (
            <div className="flex w-full max-w-sm flex-col items-center gap-3 text-center">
              <span className="text-lg font-semibold">{tab} ready</span>
              <p className="text-xs text-muted-foreground">
                Entities written, screens generated. Publish when you&apos;re happy with it.
              </p>
              <Button variant="outline" size="sm" onClick={() => setProgress(45)}>
                <RotateCcw data-icon="inline-start" strokeWidth={1.75} />
                Rebuild
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
