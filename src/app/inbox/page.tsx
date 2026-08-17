"use client";

import * as React from "react";
import {
  Inbox,
  UserRound,
  Search,
  Bot,
  BookOpen,
  Activity,
  Zap,
  Settings,
  PlayCircle,
  FileText,
  ChevronDown,
  Filter,
  ArrowDownUp,
  Archive,
  ArchiveX,
  Trash2,
  Clock,
  Reply,
  ReplyAll,
  Forward,
  MoreVertical,
  Calendar,
  Download,
  Palette,
  CheckCircle2,
  Flag,
  Plus,
  Paperclip,
  Mic,
  ArrowRight,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { ScreenNav, ScreenNavGroup, ScreenNavItem } from "@/components/douglas/screen-nav";
import { ApprovalModal, ApprovalModalDiff } from "@/components/douglas/approval-modal";
import {
  ParameterSelector,
  ParameterSelectorItem,
} from "@/components/douglas/parameter-selector";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const THREADS = [
  {
    id: "william",
    name: "William Smith",
    subject: "Meeting Tomorrow",
    when: "2 days ago",
    preview: "Hi, let's have a meeting tomorrow to discuss the project. I've been re…",
  },
  {
    id: "oliver",
    name: "Oliver Johnson",
    subject: "Re: Project update",
    when: "2 days ago",
    preview: "Hi, let's have a meeting tomorrow to discuss the project. I've been re…",
  },
  {
    id: "sophia",
    name: "Sophia Brown",
    subject: "Carpet samples",
    when: "4 days ago",
    preview: "Hi, let's have a meeting tomorrow to discuss the project. I've been re…",
  },
];

const PERMISSIONS = [
  { id: "ask", label: "Ask permission", description: "Confirm before each send." },
  { id: "safe", label: "Send safe replies", description: "Drafts go out unless flagged." },
  { id: "auto", label: "Full autonomy", description: "The agent answers on its own." },
];

const AGENT_TASKS = [
  {
    icon: CheckCircle2,
    title: "Checked document",
    detail: "Reviewed 4 files · Carpet Brand Ki…",
  },
  {
    icon: Palette,
    title: "Found a duplicate color",
    detail: "Two identical color between first…",
  },
  {
    icon: Flag,
    title: "Flagged it for review",
    detail: "Waiting for your confirmation bef…",
  },
  { icon: CheckCircle2, title: "Waiting for meeting to send files" },
];

function SummaryRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className="w-20 shrink-0 pt-1 text-xs text-muted-foreground">{label}</span>
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">{children}</div>
    </div>
  );
}

// Both attached files render with the same tone — they're the same kind of object
// regardless of what's inside them.
function FileChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2 py-1 text-xs text-foreground">
      <FileText className="size-3.5 shrink-0" strokeWidth={1.75} />
      {label}
      <Download className="size-3.5 shrink-0 text-muted-foreground" strokeWidth={1.75} />
    </span>
  );
}

export default function InboxAgentScreen() {
  const [activeThread, setActiveThread] = React.useState(THREADS[0].id);
  const [permission, setPermission] = React.useState(PERMISSIONS[0]);
  const [reply, setReply] = React.useState("Sorry, I'm going to be 10 minutes late");
  const [approval, setApproval] = React.useState<"idle" | "running" | "done">("idle");

  React.useEffect(() => {
    if (approval !== "running") return;
    const id = window.setTimeout(() => setApproval("done"), 1200);
    return () => window.clearTimeout(id);
  }, [approval]);

  return (
    <div className="flex flex-1 border-b">
      <ScreenNav
        title="Douglas"
        badge={
          <>
            <span className="rounded-full bg-primary/15 px-1.5 py-0.5 text-[0.625rem] font-semibold text-primary">
              Pro
            </span>
            <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" strokeWidth={1.75} />
          </>
        }
        footer={
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2 rounded-lg bg-primary/15 p-3">
              <span className="text-sm font-medium">You&apos;re using free plan</span>
              <p className="text-xs text-muted-foreground">
                You can add components to your app by upgrading to the next plan.
              </p>
              <Button size="sm" className="w-fit">
                View plans
                <ArrowRight data-icon="inline-end" strokeWidth={1.75} />
              </Button>
            </div>
            <ScreenNavGroup>
              <ScreenNavItem icon={PlayCircle} label="Tutorials" shortcut="⌘1" />
              <ScreenNavItem icon={FileText} label="Docs" shortcut="⌘2" />
            </ScreenNavGroup>
          </div>
        }
      >
        <ScreenNavGroup>
          <ScreenNavItem icon={Inbox} label="Inbox" count={3} active />
          <ScreenNavItem icon={UserRound} label="Assigned" count={2} />
        </ScreenNavGroup>
        <div className="relative px-1">
          <Search
            className="pointer-events-none absolute top-1/2 left-3.5 size-3.5 -translate-y-1/2 text-muted-foreground"
            strokeWidth={1.75}
          />
          <Input placeholder="Search" aria-label="Search inbox" className="h-8 pl-8 text-xs" />
        </div>
        <ScreenNavGroup label="Manage">
          <ScreenNavItem icon={Bot} label="Agent" />
          <ScreenNavItem icon={BookOpen} label="Knowledge" />
          <ScreenNavItem icon={Activity} label="Hehavior" />
          <ScreenNavItem icon={Zap} label="Actions" />
          <ScreenNavItem icon={Settings} label="Settings" />
        </ScreenNavGroup>
      </ScreenNav>

      {/* Thread list */}
      <div className="flex w-[240px] shrink-0 flex-col gap-3 border-r p-3">
        <span className="px-1 text-sm font-semibold">Inbox</span>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <button type="button" className="inline-flex items-center gap-1 hover:text-foreground">
            1 Todo
            <ChevronDown className="size-3" strokeWidth={1.75} />
          </button>
          <button type="button" className="inline-flex items-center gap-1 hover:text-foreground">
            <Filter className="size-3" strokeWidth={1.75} />
            Filter
          </button>
          <button type="button" className="inline-flex items-center gap-1 hover:text-foreground">
            <ArrowDownUp className="size-3" strokeWidth={1.75} />
            Sort
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {THREADS.map((thread) => (
            <button
              key={thread.id}
              type="button"
              onClick={() => setActiveThread(thread.id)}
              aria-current={activeThread === thread.id ? "true" : undefined}
              className={cn(
                "flex flex-col gap-1 rounded-lg border p-3 text-left transition-colors",
                activeThread === thread.id ? "bg-muted" : "bg-card hover:bg-muted/50"
              )}
            >
              <div className="flex items-center gap-2">
                <span className="min-w-0 flex-1 truncate text-sm font-medium">{thread.name}</span>
                <span className="size-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                <span className="shrink-0 text-xs text-muted-foreground">{thread.when}</span>
              </div>
              <p className="line-clamp-2 text-xs text-muted-foreground">{thread.preview}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Reading pane */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-12 items-center gap-1 border-b px-3">
          {[Archive, ArchiveX, Trash2, Clock].map((Icon, i) => (
            <Button key={i} variant="ghost" size="icon-sm" aria-label="Thread action">
              <Icon strokeWidth={1.75} />
            </Button>
          ))}
          <span className="flex-1" />
          {[Reply, ReplyAll, Forward, MoreVertical].map((Icon, i) => (
            <Button key={i} variant="ghost" size="icon-sm" aria-label="Reply action">
              <Icon strokeWidth={1.75} />
            </Button>
          ))}
        </div>

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
          <div className="flex items-start gap-3">
            <Avatar className="size-9 shrink-0">
              <AvatarFallback>WS</AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="text-sm font-semibold">William Smith</span>
              <span className="text-xs">Meeting Tomorrow</span>
              <span className="text-xs text-muted-foreground">
                Reply-To: williamsmith@example.com
              </span>
            </div>
            <span className="shrink-0 text-xs text-muted-foreground">
              Oct 22, 2023, 9:00:00 AM
            </span>
          </div>

          <div className="flex flex-col gap-4 text-sm leading-relaxed">
            <p>
              Thank you for the project update. It looks great! I&apos;ve gone through the
              report, and the progress is impressive. The team has done a fantastic job, and I
              appreciate the hard work everyone has put in.
            </p>
            <p>
              I have a few minor suggestions that I&apos;ll include in the attached document.
            </p>
            <p>
              Let&apos;s discuss these during our next meeting. Keep up the excellent work!
            </p>
            <p>Best regards, Alice</p>
          </div>

          <ApprovalModal
            title="Confirm irreversible action"
            description="This action can't be undone once executed. Review the change before confirming."
            confirmLabel={approval === "done" ? "Executed" : "Confirm and execute"}
            loading={approval === "running"}
            onConfirm={() => setApproval("running")}
            onCancel={() => setApproval("idle")}
          >
            <ApprovalModalDiff
              title="Scheduled meeting"
              before="Oct 22 • 11 AM"
              after="Oct 22 • 11:10 AM"
              icon={Calendar}
            />
          </ApprovalModal>

          <div className="flex flex-col gap-3 rounded-xl border bg-card p-3">
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              rows={2}
              aria-label="Reply"
              className="w-full resize-none bg-transparent px-1 text-sm outline-none placeholder:text-muted-foreground"
            />
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon-lg" aria-label="Add context">
                  <Plus strokeWidth={1.75} />
                </Button>
                <Button variant="ghost" size="icon-lg" aria-label="Attach a file">
                  <Paperclip strokeWidth={1.75} />
                </Button>
                <Button variant="ghost" size="icon-lg" aria-label="Dictate">
                  <Mic strokeWidth={1.75} />
                </Button>
                <span
                  className="flex size-5 shrink-0 items-center justify-center rounded-md bg-primary text-[0.625rem] font-semibold text-primary-foreground"
                  aria-hidden
                >
                  ⌘
                </span>
              </div>
              <Button size="icon-lg" aria-label="Send reply" disabled={!reply.trim()}>
                <ArrowRight strokeWidth={1.75} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary panel */}
      <aside className="hidden w-[260px] shrink-0 flex-col gap-4 border-l p-4 xl:flex">
        <span className="text-sm font-semibold">Summary</span>

        <SummaryRow label="Priority">
          <Badge>High</Badge>
        </SummaryRow>
        <SummaryRow label="Ton">
          <Badge variant="secondary">Formal</Badge>
        </SummaryRow>
        <SummaryRow label="Files">
          <FileChip label="CR meeting" />
          <FileChip label="Brand kit" />
        </SummaryRow>
        <SummaryRow label="Permission">
          <ParameterSelector label={permission.label} variant="outline">
            {PERMISSIONS.map((option) => (
              <ParameterSelectorItem
                key={option.id}
                label={option.label}
                description={option.description}
                active={option.id === permission.id}
                onSelect={() => setPermission(option)}
              />
            ))}
          </ParameterSelector>
        </SummaryRow>
        <SummaryRow label="Next">
          <span className="inline-flex items-center gap-1.5 text-xs">
            <Calendar className="size-3.5 shrink-0 text-muted-foreground" strokeWidth={1.75} />
            Oct 22 • 11 AM
          </span>
          <Button variant="outline" size="sm" className="w-full justify-center">
            Join meeting
          </Button>
        </SummaryRow>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-muted-foreground">Summary</span>
          <p className="text-sm leading-relaxed">
            Custom modern carpet project. The client has accepted the proposal for axis 2. For
            the next meeting, the client wants to see a change in colour.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs text-muted-foreground">Agent taks</span>
          {AGENT_TASKS.map((task) => (
            <div key={task.title} className="flex items-start gap-2">
              <task.icon
                className="mt-0.5 size-3.5 shrink-0 text-muted-foreground"
                strokeWidth={1.75}
              />
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="text-xs">{task.title}</span>
                {task.detail && (
                  <span className="truncate text-xs text-muted-foreground">{task.detail}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
