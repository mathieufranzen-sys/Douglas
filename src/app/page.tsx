"use client";

import * as React from "react";
import Link from "next/link";
import {
  Calendar,
  MessageSquare,
  CalendarDays,
  CreditCard,
  Frame,
  Contact,
  Wrench,
  AppWindow,
  ListChecks,
  Send,
  Database,
  Sparkles,
  Inbox,
  Blocks,
  ArrowUpRight,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { ApprovalModal, ApprovalModalDiff } from "@/components/douglas/approval-modal";
import {
  ScopePermissionCard,
  ScopePermissionGroup,
} from "@/components/douglas/scope-permission-card";
import { UndoRevokeBar } from "@/components/douglas/undo-revoke-bar";
import { AgentQuestionCard } from "@/components/douglas/agent-question-card";
import { MultimodalInputBar } from "@/components/douglas/multimodal-input-bar";
import {
  ParameterSelector,
  ParameterSelectorItem,
} from "@/components/douglas/parameter-selector";
import { AutonomyLevelSelector } from "@/components/douglas/autonomy-level-selector";
import { DelegationCard } from "@/components/douglas/delegation-card";
import { ScheduledTaskCard } from "@/components/douglas/scheduled-task-card";
import { AgentErrorCard } from "@/components/douglas/agent-error-card";
import { AgentActionCard } from "@/components/douglas/agent-action-card";
import { ConflictAmbiguityCard } from "@/components/douglas/conflict-ambiguity-card";
import { ActivityLogRow } from "@/components/douglas/activity-log-row";
import { ErrorRetryChip } from "@/components/douglas/error-retry-chip";
import { AgentStatusIndicator } from "@/components/douglas/agent-status-indicator";
import {
  ReasoningTimeline,
  ReasoningTimelineSummary,
} from "@/components/douglas/reasoning-timeline";
import { ArtifactCard } from "@/components/douglas/artifact-card";
import { SourceChip } from "@/components/douglas/source-chip";
import { MessageBubble } from "@/components/douglas/message-bubble";
import { MessageActionRow } from "@/components/douglas/message-action-row";
import { ConfidenceBadge } from "@/components/douglas/confidence-badge";
import { Button } from "@/components/ui/button";
import type { VoiceState } from "@/components/douglas/voice-status-pill";

const FIGMA_URL =
  "https://www.figma.com/design/y2p1cRz0jVS0gHCI5dPavR/Untitled?node-id=291-127590";

const UNDO_WINDOW_SECONDS = 5;

const QUESTIONS = [
  { question: "Which calendar should the agent write to?", options: ["Work", "Personal"] },
  { question: "Should attendees be notified?", options: ["Notify everyone", "Stay silent"] },
  { question: "Which tone should the reply use?", options: ["Formal", "Direct"] },
];

const SCOPES = [
  { id: "clients", label: "Contact external clients", icon: MessageSquare },
  { id: "calendar", label: "Access calendar", icon: CalendarDays },
  { id: "billing", label: "Modify billing settings", icon: CreditCard },
];

const MODELS = [
  { id: "fable-5", label: "Fable 5", hint: "Moyen", description: "For difficult challenges" },
  { id: "fable-5-fast", label: "Fable 5", hint: "Rapide", description: "For everyday work" },
  { id: "fable-5-pro", label: "Fable 5", hint: "Profond", description: "For long research runs" },
];

const APPROVAL_MODES = [
  { id: "manual", label: "Manually approve", description: "Nothing runs without a click." },
  { id: "safe", label: "Act on safe changes", description: "Reversible actions run alone." },
  { id: "auto", label: "Act autonomously", description: "The agent decides and reports." },
];

const DUPLICATE_CONTACTS = [
  { id: "crm", label: "Ada Lovelace — Workday", description: "Updated 3 days ago" },
  { id: "figma", label: "Ada Lovelace — Employee CRM", description: "Updated 2 hours ago" },
];

const ACTIVITY: { actor: "agent" | "user"; action: string; timestamp: string; isError?: boolean }[] = [
  { actor: "user", action: "Asked to update the employee CRM", timestamp: "11:02" },
  { actor: "agent", action: "Read 12 records from Workday", timestamp: "11:02" },
  { actor: "agent", action: "Couldn't reach the Figma API", timestamp: "11:05", isError: true },
  { actor: "agent", action: "Generated 12 business cards", timestamp: "11:06" },
];

const STATUSES = ["idle", "thinking", "acting", "waiting", "blocked"] as const;

const EXAMPLES = [
  {
    href: "/prompt",
    icon: Sparkles,
    title: "Prompt Input",
    description: "Starting a task — the composer, voice input, model picker.",
  },
  {
    href: "/inbox",
    icon: Inbox,
    title: "Inbox Agent",
    description: "Triage, approval, and a live summary panel.",
  },
  {
    href: "/build",
    icon: Blocks,
    title: "Build Conversation",
    description: "A working session with an artifact preview.",
  },
] as const;

/**
 * Ticks only while `armed`. The undo window is five seconds long, so if it started at
 * page load it had always expired by the time anyone scrolled down to it — the section
 * arms it when it comes into view instead.
 */
function useCountdown(initial: number, armed = true) {
  const [seconds, setSeconds] = React.useState(initial);
  const [stopped, setStopped] = React.useState(false);

  React.useEffect(() => {
    if (!armed || stopped || seconds <= 0) return;
    const id = window.setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => window.clearTimeout(id);
  }, [armed, stopped, seconds]);

  return {
    seconds,
    stop: () => setStopped(true),
    restart: () => {
      setSeconds(initial);
      setStopped(false);
    },
  };
}

/** True once the element has been scrolled into the page's scroll container. */
function useInView<T extends HTMLElement>() {
  const ref = React.useRef<T>(null);
  const [inView, setInView] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { root: el.closest("main"), rootMargin: "0px 0px -15% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, inView] as const;
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">
      {children}
    </span>
  );
}

/**
 * Fades a section up as it comes into view. Deliberately an observer and not a CSS
 * `view()` timeline: this page scrolls inside <main>, not the document, and measured
 * against that nested scrollport view() reported every section as long past fully
 * revealed while it was still below the fold, so the animation was a no-op.
 *
 * Renders visible and only hides itself once JS is running and the section is confirmed
 * off screen — in a layout effect, so it happens before paint and nothing flashes. With
 * no JS, or with reduced motion asked for, the content just stays where it is.
 */
function Reveal({ children }: { children: React.ReactNode }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = React.useState(false);

  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = el.closest("main");
    const limit = root ? root.getBoundingClientRect().bottom : window.innerHeight;
    if (el.getBoundingClientRect().top < limit) return;

    setHidden(true);
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setHidden(false);
          observer.disconnect();
        }
      },
      { root, rootMargin: "0px 0px -10% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "transition-[opacity,translate] duration-700 ease-out motion-reduce:transition-none",
        hidden ? "translate-y-5 opacity-0" : "translate-y-0 opacity-100"
      )}
    >
      {children}
    </div>
  );
}

/**
 * Bento tiles carry a colour rather than all sitting on the same grey card: a wash of
 * one semantic token bleeding out of the top-left corner into --card. Keeps every
 * foreground on its normal token, so tinting costs nothing in legibility.
 */
type Tone = "plain" | "primary" | "info" | "success" | "warning" | "destructive";

const TONE: Record<Tone, string> = {
  plain: "border-border bg-card",
  primary: "border-primary/40 bg-gradient-to-br from-primary/25 via-card to-card",
  info: "border-info/40 bg-gradient-to-br from-info/25 via-card to-card",
  success: "border-success/40 bg-gradient-to-br from-success/25 via-card to-card",
  warning: "border-warning/40 bg-gradient-to-br from-warning/25 via-card to-card",
  destructive:
    "border-destructive/40 bg-gradient-to-br from-destructive/25 via-card to-card",
};

function Tile({
  children,
  tone = "plain",
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-w-0 items-center justify-center rounded-2xl border p-4 shadow-sm",
        TONE[tone],
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * The plinth a component is presented on. A showcase lives or dies on this: the same
 * card looks like debug output on a bare page and like a product shot once it is lit,
 * raised and given room.
 */
function Stage({
  children,
  className,
  align = "center",
}: {
  children: React.ReactNode;
  className?: string;
  align?: "center" | "stretch";
}) {
  return (
    <div className={cn("relative", className)}>
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-4 rounded-[2rem] bg-primary/10 blur-3xl sm:-inset-8"
      />
      <div
        className={cn(
          "relative flex flex-col gap-5 rounded-2xl border bg-gradient-to-b from-card to-sidebar p-6 shadow-xl sm:p-8",
          align === "center" ? "items-center" : "items-stretch"
        )}
      >
        {children}
      </div>
    </div>
  );
}

/**
 * One argument, one visual, alternating sides down the page — the rhythm every product
 * site in this reference set uses. Prose is the only text; the component beside it has
 * no caption, because it has to be self-explanatory to be worth shipping.
 */
function Feature({
  eyebrow,
  title,
  body,
  reverse,
  align,
  children,
}: {
  eyebrow: string;
  title: string;
  body: string;
  reverse?: boolean;
  align?: "center" | "stretch";
  children: React.ReactNode;
}) {
  return (
    <Reveal>
      {/* min-w-0 on both columns: a grid item's min-width defaults to its min-content,
          and the cards on the Stage have a wide one, which grew the track past the
          viewport and gave the whole page a horizontal scrollbar on a phone. */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 lg:grid-cols-2 lg:gap-20 lg:py-24">
        <div className={cn("flex min-w-0 flex-col items-start gap-4", reverse && "lg:order-2")}>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 className="text-balance text-3xl font-semibold tracking-[-0.01em] lg:text-4xl">
            {title}
          </h2>
          <p className="max-w-md text-base leading-relaxed text-muted-foreground">{body}</p>
        </div>
        <Stage align={align} className={cn("min-w-0", reverse && "lg:order-1")}>
          {children}
        </Stage>
      </section>
    </Reveal>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="text-2xl font-semibold tracking-tight">{value}</span>
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  );
}

/**
 * One conversation, presented as the product surface it is: window chrome with the
 * agent's live status, the thread, and the composer fixed at the foot.
 *
 * The thread opens pinned to its latest turn, the way a live one would, which is what
 * puts earlier messages behind the faded top edge.
 */
function ConversationWindow({
  children,
  footer,
}: {
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  const scroller = React.useRef<HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const pin = () => {
      el.scrollTop = el.scrollHeight;
    };
    pin();
    const frame = requestAnimationFrame(pin);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-5 rounded-[2.5rem] bg-primary/10 blur-3xl"
      />
      <div className="relative flex flex-col overflow-hidden rounded-2xl border bg-card shadow-2xl">
        <div className="flex items-center gap-2.5 border-b bg-gradient-to-b from-sidebar to-card px-5 py-3.5">
          <span
            aria-hidden
            className="flex size-6 shrink-0 items-center justify-center rounded-md bg-primary text-[0.625rem] font-semibold text-primary-foreground"
          >
            ⌘
          </span>
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-xs leading-tight font-semibold">Douglas</span>
            <span className="truncate text-[0.6875rem] leading-tight text-muted-foreground">
              Employee CRM
            </span>
          </div>
          <AgentStatusIndicator status="acting" variant="outline" className="ml-auto" />
        </div>

        <div className="relative">
          {/* Fixed height, not max-height: the thread has to genuinely overflow for the
              faded top edge to be hiding something. */}
          <div ref={scroller} className="flex h-[26rem] flex-col gap-7 overflow-y-auto p-6">
            {children}
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-card via-card/85 to-transparent"
          />
        </div>

        <div className="border-t bg-sidebar/60 p-3">{footer}</div>
      </div>
    </div>
  );
}

/** A card that leaves the showcase for the full, assembled screen it belongs to. */
function ExampleCard({
  href,
  icon: Icon,
  title,
  description,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col justify-between gap-10 rounded-2xl border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg"
    >
      <div className="flex items-center justify-between">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="size-4.5" strokeWidth={1.75} />
        </span>
        <ArrowUpRight
          className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
          strokeWidth={1.75}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="text-base font-semibold">{title}</span>
        <span className="text-sm leading-relaxed text-muted-foreground">{description}</span>
      </div>
    </Link>
  );
}

export default function ComponentsScreen() {
  // Approval modal
  const [approvalState, setApprovalState] = React.useState<"idle" | "running" | "done">("idle");

  // Undo window after the agent moved the meeting on its own. Armed on scroll, so the
  // five-second window is still running when it is actually looked at.
  const [undoRef, undoInView] = useInView<HTMLDivElement>();
  const undo = useCountdown(UNDO_WINDOW_SECONDS, undoInView);
  const [undone, setUndone] = React.useState(false);

  // Scope permissions
  const [scopes, setScopes] = React.useState<Record<string, boolean>>({
    clients: false,
    calendar: true,
    billing: false,
  });

  // Clarification loop
  const [questionIndex, setQuestionIndex] = React.useState(0);
  const [answers, setAnswers] = React.useState<string[]>([]);

  // Command bar
  const [model, setModel] = React.useState(MODELS[0]);
  const [approvalMode, setApprovalMode] = React.useState(APPROVAL_MODES[0]);
  const [voiceState, setVoiceState] = React.useState<VoiceState>("idle");
  const [sent, setSent] = React.useState<string | null>(null);

  // Delegation
  const [delegated, setDelegated] = React.useState<string | null>(null);

  // Scheduled task
  const [taskEnabled, setTaskEnabled] = React.useState(false);

  // Error recovery
  const [retrying, setRetrying] = React.useState(false);
  const [errorCleared, setErrorCleared] = React.useState(false);

  // Standalone action card
  const [actionState, setActionState] = React.useState<"pending" | "approved" | "rejected">(
    "pending"
  );

  // Duplicate-contact conflict
  const [resolved, setResolved] = React.useState<string | null>(null);

  // Chip-level retry inside the thread
  const [chipRetried, setChipRetried] = React.useState(false);

  // Artifact generation
  const [progress, setProgress] = React.useState(35);
  const generating = progress < 100;

  React.useEffect(() => {
    if (!generating) return;
    const id = window.setTimeout(() => setProgress((p) => Math.min(100, p + 5)), 700);
    return () => window.clearTimeout(id);
  }, [generating, progress]);

  React.useEffect(() => {
    if (approvalState !== "running") return;
    const id = window.setTimeout(() => setApprovalState("done"), 1200);
    return () => window.clearTimeout(id);
  }, [approvalState]);

  React.useEffect(() => {
    if (!retrying) return;
    const id = window.setTimeout(() => {
      setRetrying(false);
      setErrorCleared(true);
    }, 1200);
    return () => window.clearTimeout(id);
  }, [retrying]);

  const currentQuestion = QUESTIONS[Math.min(questionIndex, QUESTIONS.length - 1)];
  const allAnswered = questionIndex >= QUESTIONS.length;

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      {/* ── Hero: the claim, then the whole set as a bento underneath ───── */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(65%_55%_at_50%_-10%,var(--color-primary)_0%,transparent_60%)] opacity-[0.14]"
        />
        <div className="relative mx-auto flex max-w-6xl flex-col items-center px-6 pt-20 pb-12 text-center lg:pt-28">
          <Eyebrow>Douglas · Design system</Eyebrow>
          <h1 className="mt-5 max-w-3xl text-balance text-4xl font-semibold tracking-[-0.02em] leading-[1.05] sm:text-5xl lg:text-6xl">
            Interfaces for agents
            <br />
            <span className="text-primary">you can actually trust.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Twenty components for showing intent before acting, making reasoning legible,
            and keeping every automated move reversible.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" nativeButton={false} render={<a href="#examples" />}>
              See it assembled
              <ArrowRight data-icon="inline-end" strokeWidth={1.75} />
            </Button>
            <Button
              variant="outline"
              size="lg"
              nativeButton={false}
              render={<a href={FIGMA_URL} target="_blank" rel="noreferrer" />}
            >
              Open in Figma
              <ExternalLink data-icon="inline-end" strokeWidth={1.75} />
            </Button>
          </div>
        </div>

        {/* The set, live, right under the claim. Dense flow so the short tiles pack in
            beside the tall ones instead of leaving holes. */}
        <div className="relative mx-auto w-full max-w-6xl px-6 pb-14">
          <div className="grid grid-flow-row-dense grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            <Tile tone="success" className="col-span-2 row-span-2">
              <ScopePermissionGroup className="w-full">
                {SCOPES.map((scope) => (
                  <ScopePermissionCard
                    key={scope.id}
                    style="grouped"
                    icon={scope.icon}
                    label={scope.label}
                    checked={scopes[scope.id]}
                    onCheckedChange={(next) => setScopes((s) => ({ ...s, [scope.id]: next }))}
                  />
                ))}
              </ScopePermissionGroup>
            </Tile>

            <Tile tone="warning" className="col-span-2 row-span-2">
              {resolved ? (
                <div className="flex w-full flex-col gap-2">
                  <span className="text-sm font-semibold">Conflict resolved</span>
                  <span className="text-xs text-muted-foreground">
                    Keeping {DUPLICATE_CONTACTS.find((c) => c.id === resolved)?.label}.
                  </span>
                  <button
                    type="button"
                    onClick={() => setResolved(null)}
                    className="w-fit text-xs text-muted-foreground underline-offset-4 hover:underline"
                  >
                    Ask again
                  </button>
                </div>
              ) : (
                <ConflictAmbiguityCard
                  className="w-full border-0 bg-transparent p-0 shadow-none"
                  title="Two records match “Ada Lovelace”"
                  description="Pick the source of truth before the write."
                  options={DUPLICATE_CONTACTS}
                  onSelect={setResolved}
                />
              )}
            </Tile>

            <Tile className="col-span-2 row-span-2">
              <div className="flex w-full flex-col">
                {ACTIVITY.map((entry) => (
                  <ActivityLogRow
                    key={entry.action}
                    actor={entry.actor}
                    action={entry.action}
                    timestamp={entry.timestamp}
                    isError={entry.isError}
                  />
                ))}
              </div>
            </Tile>

            <Tile tone="primary" className="col-span-2 sm:col-span-2 lg:col-span-3">
              <AutonomyLevelSelector className="w-full" />
            </Tile>

            <Tile tone="info" className="col-span-2 sm:col-span-2 lg:col-span-3">
              <div className="flex flex-wrap items-center justify-center gap-2">
                <SourceChip label="Figma" icon={Frame} href="#" />
                <SourceChip label="Employee CRM" icon={Contact} href="#" />
                <SourceChip label="Wrote /Transaction" icon={Database} />
              </div>
            </Tile>

            <Tile tone="primary" className="col-span-2">
              <ArtifactCard
                className="w-full border-0 bg-transparent shadow-none"
                title="Finance Dashboard"
                meta="18.2 MB"
                style="compact"
              />
            </Tile>

            <Tile tone="warning" className="col-span-2">
              <div className="flex flex-wrap items-center justify-center gap-2">
                <ConfidenceBadge level="high" />
                <ConfidenceBadge level="medium" />
                <ConfidenceBadge level="low" />
              </div>
            </Tile>

            <Tile tone="destructive" className="col-span-2">
              <AgentErrorCard
                className="w-full bg-transparent"
                style="banner"
                title="Coundn't move the meeting"
              />
            </Tile>

            <Tile tone="info" className="col-span-2 lg:col-span-3">
              <ScheduledTaskCard
                className="w-full bg-transparent"
                style="compact"
                title="Nightly backup sync"
                frequency="2:00 AM"
              />
            </Tile>

            <Tile className="col-span-2 lg:col-span-3">
              <div className="flex flex-wrap items-center justify-center gap-4">
                <MessageActionRow timestamp="2 hours ago" />
                <ReasoningTimelineSummary label="Thinking process for 21s" />
              </div>
            </Tile>
          </div>
        </div>

        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-10 gap-y-4 border-t px-6 py-8">
          <Metric value="20" label="components" />
          <Metric value="5" label="themes" />
          <Metric value="3" label="screens" />
          <Metric value="AA" label="contrast audited" />
        </div>
      </section>

      {/* ── Features: one argument, one visual, alternating ─────────────── */}
      <Feature
        eyebrow="Before acting"
        title="Nothing runs unannounced."
        body="An irreversible change is shown as a before and an after, and waits. When more than one reading of the request is defensible, the agent asks rather than picking one and hoping."
        align="stretch"
      >
        <ApprovalModal
          className="w-full border-0 bg-transparent p-0 shadow-none"
          title="Confirm irreversible action"
          description="This action can't be undone once executed. Review the change before confirming."
          confirmLabel={approvalState === "done" ? "Executed" : "Confirm and execute"}
          loading={approvalState === "running"}
          onConfirm={() => setApprovalState("running")}
          onCancel={() => setApprovalState("idle")}
        >
          <ApprovalModalDiff
            title="Scheduled meeting"
            before="Oct 22 • 11 AM"
            after="Oct 22 • 11:10 AM"
            icon={Calendar}
          />
        </ApprovalModal>

        {allAnswered ? (
          <div className="flex w-full flex-col gap-2 rounded-xl border bg-card p-4 shadow-sm">
            <span className="text-sm font-semibold">All set</span>
            <span className="text-xs text-muted-foreground">{answers.join(" · ")}</span>
            <button
              type="button"
              onClick={() => {
                setQuestionIndex(0);
                setAnswers([]);
              }}
              className="w-fit text-xs text-muted-foreground underline-offset-4 hover:underline"
            >
              Ask again
            </button>
          </div>
        ) : (
          <AgentQuestionCard
            key={questionIndex}
            className="w-full"
            question={currentQuestion.question}
            options={currentQuestion.options}
            step={`${questionIndex + 1}/${QUESTIONS.length}`}
            onAnswer={(answer) => {
              setAnswers((a) => [...a, answer]);
              setQuestionIndex((i) => i + 1);
            }}
          />
        )}
      </Feature>

      <Feature
        eyebrow="In flight"
        title="You can see it thinking."
        body="The trace is the product. Every step names the tool it reached for and what came back, and the five run states each carry their own colour so the status is readable at a glance."
        align="stretch"
        reverse
      >
        <div className="flex flex-wrap items-center justify-center gap-2">
          {STATUSES.map((status) => (
            <AgentStatusIndicator key={status} status={status} variant="outline" />
          ))}
        </div>
        <div className="flex w-full flex-col">
          <ReasoningTimeline
            title="Use Application"
            icon={AppWindow}
            state="done"
            timestamp="3 min ago"
          />
          <ReasoningTimeline
            title="Added task : name of the task"
            icon={ListChecks}
            state="done"
            timestamp="2 min ago"
            style="code"
            code={"Request\n{\n}\n\nreturn {\n}"}
          />
          <ReasoningTimeline
            title="Writing the business cards"
            icon={Frame}
            state="ongoing"
            timestamp="now"
            showConnector={false}
          />
        </div>
      </Feature>

      <Feature
        eyebrow="Afterwards"
        title="Every move has an undo."
        body="An action the agent took on its own opens a window to take it back, and the window says how long it has left. Approval and reversal are the same control at two moments in time."
        align="stretch"
      >
        <AgentActionCard
          className="w-full"
          title="Send the onboarding recap"
          description="One email to the 12 new starters, with their business card attached."
          icon={Send}
          confidence="medium"
          parameters={[
            { label: "Recipients", value: "12 new starters" },
            { label: "Attachment", value: "business-card.pdf" },
          ]}
          actionRow={actionState === "pending" ? "triple" : "revoke"}
          actionProps={{
            confirmLabel: "Send",
            onConfirm: () => setActionState("approved"),
            onReject: () => setActionState("rejected"),
            onRevoke: () => setActionState("pending"),
          }}
        />
        <div ref={undoRef} className="flex w-full justify-center">
          {undone ? (
            <span className="rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
              Reverted. The meeting is back at 11 AM.
            </span>
          ) : undo.seconds > 0 ? (
            <UndoRevokeBar
              seconds={undo.seconds}
              onUndo={() => {
                undo.stop();
                setUndone(true);
              }}
            />
          ) : (
            <button
              type="button"
              onClick={() => {
                setUndone(false);
                undo.restart();
              }}
              className="rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Window closed — replay the countdown
            </button>
          )}
        </div>
      </Feature>

      <Feature
        eyebrow="Standing orders"
        title="Hand over the work that repeats."
        body="Delegation is a contract: a task, a duration, and a level of autonomy agreed up front. Once it is running it stays visible and stays switchable off."
        align="stretch"
        reverse
      >
        {/* Overlapped on purpose — the schedule is a second, different object that the
            delegation produces, not another field on the same form. */}
        <div className="relative w-full pb-6">
          <DelegationCard
            className="relative z-10 w-full shadow-lg"
            onSubmit={(draft) => setDelegated(draft.task)}
          />
          <ScheduledTaskCard
            className="relative z-0 -mt-4 ml-6 w-[calc(100%-3rem)] shadow-md"
            style="list"
            title={delegated ?? "Weekly competitor price check"}
            frequency={delegated ? "Delegated just now" : "Every Monday at 7:00 AM"}
            enabled={taskEnabled}
            onEnabledChange={setTaskEnabled}
          />
        </div>
      </Feature>

      <Feature
        eyebrow="When it fails"
        title="It stops instead of guessing."
        body="A refused write is a state the interface holds, with the reason attached and a way forward that is the operator's choice — retry, or take it over by hand."
        align="stretch"
      >
        {errorCleared ? (
          <span className="rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
            Meeting moved on the second attempt.
          </span>
        ) : (
          <AgentErrorCard
            className="w-full"
            title="The calendar refused the write"
            description="Workday returned 403. The agent stopped rather than retrying blindly."
            retryLabel={retrying ? "Retrying…" : "Retry"}
            onRetry={() => setRetrying(true)}
          />
        )}
        <div className="flex w-full justify-center">
          {chipRetried ? (
            <AgentStatusIndicator status="acting" label="Retrying the card export…" />
          ) : (
            <ErrorRetryChip
              label="Business card export failed"
              onRetry={() => setChipRetried(true)}
            />
          )}
        </div>
      </Feature>

      {/* ── Conversation: one window, centred, nothing written around it ── */}
      <Reveal>
        <section className="border-y bg-sidebar">
          <div className="mx-auto flex max-w-3xl flex-col gap-10 px-6 py-16 lg:py-24">
            <div className="flex flex-col gap-4 text-center">
              <Eyebrow>In conversation</Eyebrow>
              <h2 className="text-balance text-3xl font-semibold tracking-[-0.01em] lg:text-4xl">
                One thread, and nothing hidden in it.
              </h2>
              <p className="mx-auto max-w-xl text-base leading-relaxed text-muted-foreground">
                A single exchange, start to finish: the request, the trace of how it was
                answered, what it touched, and what it produced.
              </p>
            </div>

            <div className="min-w-0">
              <ConversationWindow
                footer={
                  <MultimodalInputBar
                    style="expanded"
                    voiceState={voiceState}
                    onVoiceClick={() =>
                      setVoiceState((s) =>
                        s === "idle" ? "listening" : s === "listening" ? "processing" : "idle"
                      )
                    }
                    onSubmit={setSent}
                  >
                    <ParameterSelector label={approvalMode.label}>
                      {APPROVAL_MODES.map((mode) => (
                        <ParameterSelectorItem
                          key={mode.id}
                          label={mode.label}
                          description={mode.description}
                          active={mode.id === approvalMode.id}
                          onSelect={() => setApprovalMode(mode)}
                        />
                      ))}
                    </ParameterSelector>
                    <ParameterSelector label={model.label} hint={model.hint}>
                      {MODELS.map((option) => (
                        <ParameterSelectorItem
                          key={option.id}
                          label={`${option.label} ${option.hint}`}
                          description={option.description}
                          active={option.id === model.id}
                          onSelect={() => setModel(option)}
                        />
                      ))}
                    </ParameterSelector>
                  </MultimodalInputBar>
                }
              >
                <MessageBubble>
                  Can you update the employee CRM with the new hires?
                </MessageBubble>

                <p className="text-sm leading-relaxed">
                  Twelve people in Workday, under October onboarding. I&apos;ll read them
                  first and stop before the write if anything looks ambiguous.
                </p>

                <div className="flex flex-col">
                  <ReasoningTimeline
                    title="Use Application"
                    icon={AppWindow}
                    state="done"
                    timestamp="3 min ago"
                  />
                  <ReasoningTimeline
                    title="Writing the business cards"
                    icon={Frame}
                    state="ongoing"
                    timestamp="now"
                    showConnector={false}
                  />
                </div>

                <p className="text-sm leading-relaxed">
                  You now have 12 new employee contacts in the Employee CRM, each with its
                  own business card on Figma.
                </p>

                <div className="flex flex-wrap gap-2">
                  <SourceChip label="Figma" icon={Frame} href="#" />
                  <SourceChip label="Employee CRM" icon={Contact} href="#" />
                </div>

                <ArtifactCard
                  title="Employee cards.svg"
                  meta="1.2 MB"
                  generating={generating}
                  progress={progress}
                  onDownload={() => setProgress(35)}
                  downloadLabel={generating ? "Download" : "Download again"}
                />

                <div className="flex items-center gap-3">
                  <MessageActionRow timestamp="2 hours ago" />
                  <ConfidenceBadge level="high" style="dot" />
                </div>
              </ConversationWindow>
            </div>

            {sent && (
              <span className="text-center text-xs text-muted-foreground">
                Sent to {model.label} {model.hint}, {approvalMode.label.toLowerCase()}: “{sent}”
              </span>
            )}
          </div>
        </section>
      </Reveal>

      {/* ── Examples ────────────────────────────────────────────────────── */}
      <Reveal>
        <section id="examples" className="border-t">
          <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16 lg:py-24">
            <div className="flex max-w-2xl flex-col gap-4">
              <Eyebrow>See it assembled</Eyebrow>
              <h2 className="text-balance text-3xl font-semibold tracking-[-0.01em] lg:text-4xl">
                Three screens, built from these parts.
              </h2>
              <p className="text-base leading-relaxed text-muted-foreground">
                The same twenty components, in the products they were drawn for.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              {EXAMPLES.map((example) => (
                <ExampleCard key={example.href} {...example} />
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── Closing ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-t">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_100%_at_50%_120%,var(--color-primary)_0%,transparent_65%)] opacity-[0.12]"
        />
        <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 py-20 text-center lg:py-28">
          <h2 className="text-balance text-3xl font-semibold tracking-[-0.01em] lg:text-4xl">
            The Figma library stays in step.
          </h2>
          <p className="max-w-lg text-base leading-relaxed text-muted-foreground">
            Every component here is drawn in Figma with the same variants and the same
            tokens, so design and code do not drift apart.
          </p>
          <Button
            size="lg"
            nativeButton={false}
            render={<a href={FIGMA_URL} target="_blank" rel="noreferrer" />}
          >
            Open in Figma
            <ExternalLink data-icon="inline-end" strokeWidth={1.75} />
          </Button>
        </div>
      </section>
    </div>
  );
}
