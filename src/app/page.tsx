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
} from "lucide-react";

import { cn } from "@/lib/utils";
import { ThemeGeneratorSidebar } from "@/components/theme/theme-generator-panel";
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
import {
  ReasoningTimeline,
  ReasoningTimelineSummary,
} from "@/components/douglas/reasoning-timeline";
import { ArtifactCard } from "@/components/douglas/artifact-card";
import { SourceChip } from "@/components/douglas/source-chip";
import { MessageBubble } from "@/components/douglas/message-bubble";
import { MessageActionRow } from "@/components/douglas/message-action-row";
import { ConfidenceBadge } from "@/components/douglas/confidence-badge";
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

const SCREENS = [
  { href: "/conversation", label: "Conversation" },
  { href: "/delegation", label: "Delegation" },
  { href: "/audit", label: "Audit" },
];

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
      <div ref={scroller} className="flex h-[28rem] flex-col gap-4 overflow-y-auto p-4">
        {children}
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-sidebar via-sidebar/85 to-transparent"
      />
    </div>
  );
}

export default function Home() {
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
    <div className="flex min-h-screen flex-col bg-background lg:flex-row">
      <ThemeGeneratorSidebar className="lg:sticky lg:top-0 lg:h-screen lg:w-[280px] lg:shrink-0 lg:overflow-y-auto" />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex flex-wrap items-end justify-between gap-4 px-6 pt-8 pb-2">
          <div className="flex max-w-xl flex-col gap-1.5">
            <h1 className="text-2xl font-semibold tracking-tight">Douglas</h1>
            <p className="text-sm text-muted-foreground">
              The design system for agent interfaces: showing intent before acting, making
              reasoning legible, and keeping every automated move reversible.
            </p>
          </div>
          <nav className="flex items-center gap-1">
            {SCREENS.map((screen) => (
              <Link
                key={screen.href}
                href={screen.href}
                className="rounded-md px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {screen.label}
              </Link>
            ))}
          </nav>
        </header>

        <main className="grid flex-1 grid-cols-1 items-start gap-6 p-6 xl:grid-cols-[minmax(0,466px)_minmax(0,1fr)]">
          {/* ── Left column ─────────────────────────────────────────────── */}
          <div className="flex min-w-0 flex-col gap-6">
            <ApprovalModal
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

            <AutonomyLevelSelector />

            <ChatPreview>
              <MessageBubble>Where did the new starter list end up?</MessageBubble>
              <p className="text-sm">
                In Workday, under October onboarding. Twelve people, all with a start date
                this month.
              </p>

              <MessageBubble>
                Can you update the employee CRM with the new hires?
              </MessageBubble>

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

            <ScheduledTaskCard
              title="Weekly competitor price check"
              description="Tracks 3 competitor sites and flags price changes."
              frequency="Every Monday at 7:00 AM"
              status={taskEnabled ? "Next run in 3 days" : "Paused"}
              enabled={taskEnabled}
              onEnabledChange={setTaskEnabled}
            />

            {errorCleared ? (
              <div className="rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
                Meeting moved on the second attempt.
              </div>
            ) : (
              <AgentErrorCard
                style="banner"
                title="Coundn't move the meeting"
                retryLabel={retrying ? "Retrying…" : "Retry"}
                onRetry={() => setRetrying(true)}
              />
            )}
          </div>

          {/* ── Right column ────────────────────────────────────────────── */}
          <div className="flex min-w-0 flex-col gap-6">
            <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[minmax(0,248px)_minmax(0,1fr)]">
              <div className="flex min-w-0 flex-col gap-6">
                <ScopePermissionGroup>
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

                {undone ? (
                  <div className="rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
                    Reverted. The meeting is back at 11 AM.
                  </div>
                ) : undo.seconds > 0 ? (
                  <UndoRevokeBar
                    seconds={undo.seconds}
                    className="w-full"
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

              {allAnswered ? (
                <div className="flex flex-col gap-2 rounded-md border bg-card p-4 shadow-md">
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
                  question={currentQuestion.question}
                  options={currentQuestion.options}
                  step={`${questionIndex + 1}/${QUESTIONS.length}`}
                  onAnswer={(answer) => {
                    setAnswers((a) => [...a, answer]);
                    setQuestionIndex((i) => i + 1);
                  }}
                />
              )}
            </div>

            <div className="flex flex-col gap-2">
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

            <div className="flex flex-col gap-2">
              <DelegationCard onSubmit={(draft) => setDelegated(draft.task)} />
              {delegated && (
                <ScheduledTaskCard style="list" title={delegated} frequency="Delegated just now" />
              )}
            </div>

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
          </div>
        </main>
      </div>
    </div>
  );
}
