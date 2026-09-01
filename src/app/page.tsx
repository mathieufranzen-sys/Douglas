"use client";

import * as React from "react";
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
  { actor: "agent", action: "Wrote 12 contacts to Employee CRM", timestamp: "11:04" },
  { actor: "agent", action: "Couldn't reach the Figma API", timestamp: "11:05", isError: true },
  { actor: "agent", action: "Generated 12 business cards", timestamp: "11:06" },
];

const STATUSES = ["idle", "thinking", "acting", "waiting", "blocked"] as const;

/** Countdown that stops at zero and can be rearmed. */
function useCountdown(initial: number) {
  const [seconds, setSeconds] = React.useState(initial);
  const [running, setRunning] = React.useState(true);

  React.useEffect(() => {
    if (!running || seconds <= 0) return;
    const id = window.setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => window.clearTimeout(id);
  }, [running, seconds]);

  return {
    seconds,
    running,
    stop: () => setRunning(false),
    restart: () => {
      setSeconds(initial);
      setRunning(true);
    },
  };
}

/**
 * A numbered chapter of the agent lifecycle. The showcase is ordered by the moment a
 * component is reached for — before acting, during, after — rather than by component
 * name, so the set reads as one argument instead of a parts bin.
 */
function Section({
  index,
  title,
  intent,
  children,
}: {
  index: string;
  title: string;
  intent: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-col gap-1 border-b pb-3">
        <div className="flex items-baseline gap-2.5">
          <span className="font-mono text-xs font-semibold text-primary">{index}</span>
          <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        </div>
        <p className="max-w-2xl text-xs text-muted-foreground">{intent}</p>
      </div>
      {children}
    </section>
  );
}

/**
 * The recessed plate a component is pinned to. This is what the --sidebar family is for:
 * background → sidebar → card gives three real surfaces, so a card reads as raised
 * instead of dissolving into the page.
 */
function Specimen({
  children,
  className,
  note,
}: {
  children: React.ReactNode;
  className?: string;
  note?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-col gap-3 rounded-xl border border-dashed bg-sidebar p-5",
        className
      )}
    >
      <div className="flex min-w-0 flex-col items-start gap-3">{children}</div>
      {note && <span className="mt-auto text-[0.6875rem] text-muted-foreground">{note}</span>}
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col rounded-lg border bg-card px-3 py-2">
      <span className="text-lg font-semibold text-primary">{value}</span>
      <span className="text-[0.6875rem] text-muted-foreground">{label}</span>
    </div>
  );
}

/**
 * A conversation surface. Sits on --sidebar rather than --card so the threads read as
 * a distinct surface, and opens already scrolled a little with the top edge faded, so
 * it is legible that earlier turns exist above the fold.
 */
function ChatPreview({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const scroller = React.useRef<HTMLDivElement>(null);

  // Open pinned to the latest turn, the way a live thread would, which is what puts
  // earlier messages behind the faded top edge.
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
    <div className={cn("relative overflow-hidden rounded-xl border bg-sidebar", className)}>
      {/* Fixed height, not max-height: the thread has to genuinely overflow for the
          faded top edge to be hiding something. */}
      <div ref={scroller} className="flex h-[26rem] flex-col gap-4 overflow-y-auto p-4">
        {children}
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-sidebar via-sidebar/85 to-transparent"
      />
    </div>
  );
}

export default function ComponentsScreen() {
  // Approval modal
  const [approvalState, setApprovalState] = React.useState<"idle" | "running" | "done">("idle");

  // Undo window after the agent moved the meeting on its own
  const undo = useCountdown(UNDO_WINDOW_SECONDS);
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
      {/* Title band, on the recessed surface so the page opens on a plate rather than
          straight into content. */}
      <header className="border-b bg-sidebar px-6 py-9">
        <div className="mx-auto flex max-w-6xl flex-col gap-3">
          <span className="text-xs font-semibold tracking-wide text-primary uppercase">
            Design system
          </span>
          <h1 className="max-w-3xl text-3xl font-semibold tracking-tight">
            The components an agent needs to be trusted
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Every block below is live: the countdowns run, the approvals resolve, the
            questions advance. Ordered by the moment you reach for it, from asking
            permission to recovering from a failure.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <Stat value="20" label="Components" />
            <Stat value="5" label="Themes" />
            <Stat value="6" label="Moments" />
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-10">
        <Section
          index="01"
          title="Asking before acting"
          intent="The agent states what it is about to do and stops. Nothing here runs on its own."
        >
          <div className="grid gap-4 lg:grid-cols-3">
            <Specimen className="lg:col-span-2" note="Confirm to watch it resolve">
              <ApprovalModal
                className="w-full"
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
            </Specimen>

            <Specimen note="Answer to advance the sequence">
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
            </Specimen>

            <Specimen note="The glyph lights up with the switch">
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
            </Specimen>

            <Specimen>
              <AutonomyLevelSelector className="w-full" />
            </Specimen>

            <Specimen note="Warning-toned: nothing failed yet">
              {resolved ? (
                <div className="flex w-full flex-col gap-2 rounded-lg border bg-card p-4 shadow-sm">
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
                  className="w-full"
                  title="Two records match “Ada Lovelace”"
                  description="Pick the one to treat as the source of truth before the write."
                  options={DUPLICATE_CONTACTS}
                  onSelect={setResolved}
                />
              )}
            </Specimen>
          </div>
        </Section>

        <Section
          index="02"
          title="Showing the work"
          intent="While the agent runs, its state and its reasoning stay legible. Each status carries its own colour."
        >
          <div className="grid gap-4 lg:grid-cols-3">
            <Specimen className="lg:col-span-3" note="Five states, five colours">
              <div className="flex flex-wrap items-center gap-2">
                {STATUSES.map((status) => (
                  <AgentStatusIndicator key={status} status={status} variant="outline" />
                ))}
              </div>
            </Specimen>

            <Specimen className="lg:col-span-2" note="Done reads resolved, running reads informational">
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
            </Specimen>

            <Specimen note="Collapsed trace, plus a single tool call">
              <ReasoningTimelineSummary label="Thinking process for 21s" />
              <ReasoningTimeline
                title="vizualize"
                icon={Wrench}
                style="tool"
                detailed={false}
                state="done"
              />
            </Specimen>

            <Specimen className="lg:col-span-2" note="Download to restart the run">
              <ArtifactCard
                className="w-full"
                title="AI history.svg"
                meta="1.2 MB"
                generating={generating}
                progress={progress}
                onDownload={() => setProgress(35)}
                downloadLabel={generating ? "Download" : "Download again"}
              />
            </Specimen>

            <Specimen note="Compact, for inside a thread">
              <ArtifactCard
                className="w-full"
                title="Finance Dashboard"
                meta="18.2 MB"
                style="compact"
              />
              <ArtifactCard title="brief.pdf" style="inline" />
            </Specimen>
          </div>
        </Section>

        <Section
          index="03"
          title="Staying reversible"
          intent="After the fact: what happened, how sure the agent was, and the window to take it back."
        >
          <div className="grid gap-4 lg:grid-cols-3">
            <Specimen note="Counts down, then closes">
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
              <UndoRevokeBar seconds={124} style="banner" message="Meeting moved to 11:10 AM" />
            </Specimen>

            <Specimen className="lg:col-span-2" note="Approve to swap the row for a revoke">
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
            </Specimen>

            <Specimen className="lg:col-span-2" note="Tinted by actor; errors outrank both">
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
            </Specimen>

            <Specimen note="Three levels, three colours">
              <div className="flex flex-wrap items-center gap-2">
                <ConfidenceBadge level="high" />
                <ConfidenceBadge level="medium" />
                <ConfidenceBadge level="low" />
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <ConfidenceBadge level="high" style="dot" />
                <ConfidenceBadge level="medium" style="percentage" />
              </div>
              <MessageActionRow timestamp="2 hours ago" />
              <div className="flex flex-wrap gap-2">
                <SourceChip label="Figma" icon={Frame} href="#" />
                <SourceChip label="Employee CRM" icon={Contact} href="#" />
                <SourceChip label="Wrote /Transaction" icon={Database} />
              </div>
            </Specimen>
          </div>
        </Section>

        <Section
          index="04"
          title="Handing over the recurring work"
          intent="A task the agent keeps doing after you have stopped watching, and the scopes it needs to keep."
        >
          <div className="grid gap-4 lg:grid-cols-3">
            <Specimen className="lg:col-span-2" note="Delegate to see it queued below">
              <DelegationCard className="w-full" onSubmit={(draft) => setDelegated(draft.task)} />
              {delegated && (
                <ScheduledTaskCard
                  className="w-full"
                  style="list"
                  title={delegated}
                  frequency="Delegated just now"
                />
              )}
            </Specimen>

            <Specimen note="Toggle to arm the schedule">
              <ScheduledTaskCard
                className="w-full"
                title="Weekly competitor price check"
                description="Tracks 3 competitor sites and flags price changes."
                frequency="Every Monday at 7:00 AM"
                status={taskEnabled ? "Next run in 3 days" : "Paused"}
                enabled={taskEnabled}
                onEnabledChange={setTaskEnabled}
              />
            </Specimen>
          </div>
        </Section>

        <Section
          index="05"
          title="When it breaks"
          intent="Failure is a state the interface has to hold, not an exception it drops on the floor."
        >
          <div className="grid gap-4 lg:grid-cols-3">
            <Specimen className="lg:col-span-2" note="Retry to clear it">
              {errorCleared ? (
                <span className="rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
                  Meeting moved on the second attempt.
                </span>
              ) : (
                <AgentErrorCard
                  className="w-full"
                  style="banner"
                  title="Coundn't move the meeting"
                  retryLabel={retrying ? "Retrying…" : "Retry"}
                  onRetry={() => setRetrying(true)}
                />
              )}
              <AgentErrorCard
                className="w-full"
                title="The calendar refused the write"
                description="Workday returned 403. The agent stopped rather than retrying blindly."
              />
            </Specimen>

            <Specimen note="Chip-sized, for inside a thread">
              {chipRetried ? (
                <AgentStatusIndicator status="acting" label="Retrying the card export…" />
              ) : (
                <ErrorRetryChip
                  label="Business card export failed"
                  onRetry={() => setChipRetried(true)}
                />
              )}
            </Specimen>
          </div>
        </Section>

        <Section
          index="06"
          title="In conversation"
          intent="The same parts assembled into a thread, where the surface steps back so the messages carry the page."
        >
          <div className="grid gap-4 lg:grid-cols-2">
            <ChatPreview>
              <MessageBubble>Where did the new starter list end up?</MessageBubble>
              <p className="text-sm">
                In Workday, under October onboarding. Twelve people, all with a start date
                this month.
              </p>

              <MessageBubble>Can you update the employee CRM with the new hires?</MessageBubble>

              <div className="flex flex-col">
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
                  title="Done"
                  state="done"
                  timestamp="1 min ago"
                  showConnector={false}
                />
              </div>

              <p className="text-sm">
                You now have 12 new employee contacts in the Employee CRM. Each has its own
                personalised business card on Figma.
              </p>

              <div className="flex flex-col gap-2">
                <span className="text-xs text-muted-foreground">Task updated</span>
                <div className="flex flex-wrap gap-2">
                  <SourceChip label="Figma" icon={Frame} href="#" />
                  <SourceChip label="Employee CRM" icon={Contact} href="#" />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MessageActionRow timestamp="2 hours ago" />
                <ConfidenceBadge level="high" style="dot" />
              </div>
            </ChatPreview>

            <ChatPreview>
              <MessageBubble>Should this be a deck or a single page?</MessageBubble>
              <p className="text-sm">
                A single page reads better for a timeline — no slide breaks cutting the
                sequence in half. I&apos;ll lay it out left to right.
              </p>
              <MessageBubble>Good. Keep it light, not a lecture.</MessageBubble>

              <MessageBubble>
                Present the history of AI to me in chronological order, in a playful way, from
                beginning to end.
              </MessageBubble>

              <ReasoningTimelineSummary label="Thinking process for 21s" />
              <ReasoningTimeline
                title="vizualize"
                icon={Wrench}
                style="tool"
                detailed={false}
                state="done"
              />

              <p className="text-sm">The hype curve, two winters included.</p>

              <ArtifactCard
                title="AI history.svg"
                meta="1.2 MB"
                generating={generating}
                progress={progress}
                onDownload={() => setProgress(35)}
                downloadLabel={generating ? "Download" : "Download again"}
              />

              <MessageActionRow timestamp="2 hours ago" />
            </ChatPreview>

            <div className="flex flex-col gap-2 lg:col-span-2">
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
              {sent && (
                <span className="text-xs text-muted-foreground">
                  Sent to {model.label} {model.hint}, {approvalMode.label.toLowerCase()}: “{sent}”
                </span>
              )}
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}
