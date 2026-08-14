"use client";

import * as React from "react";
import {
  Search,
  FolderTree,
  Clock,
  Share2,
  PanelLeft,
  Plus,
  Paperclip,
  ArrowUp,
  ChevronDown,
  FolderPlus,
  FileText,
  Frame,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { ScreenNav, ScreenNavGroup, ScreenNavItem } from "@/components/douglas/screen-nav";
import { VoiceStatusPill, type VoiceState } from "@/components/douglas/voice-status-pill";
import {
  ParameterSelector,
  ParameterSelectorItem,
} from "@/components/douglas/parameter-selector";
import { Button } from "@/components/ui/button";

const DEFAULT_PROMPT = `Create a landing page for a B2B SaaS named Fraise, which makes plant pot covers for everyone.
Expected structure:
Header: logo, nav (Features, Pricing, About), CTA "Free Trial"
Hero: benefit-oriented title (not feature), clarifying subtitle in one sentence, main CTA + secondary CTA ("view demo"), product visual (screenshot or illustration)
Client logos banner / social proof
3 key benefit blocks (icon + title + max 2 lines), not a list of technical features
"How it works" section in 3 steps
Detailed features section with product captures
Customer testimonials (2-3, with name/position/photo)
Pricing table (2-3 plans, one highlighted)
FAQ (5-6 common objection questions)
Final CTA + complete footer`;

const MODELS = [
  { id: "fable-5", label: "Fable 5", description: "For difficult challenges" },
  { id: "fable-5-fast", label: "Fable 5 Rapide", description: "For everyday work" },
  { id: "fable-5-pro", label: "Fable 5 Profond", description: "For long research runs" },
];

const COMMUNITY = [
  { title: "FlowStateFinance", meta: "Dashboard · Preview" },
  { title: "Douglas Inbox", meta: "Inbox · Summary" },
  { title: "FeatureBase", meta: "Landing · Pricing" },
];

/** A context attachment offered under the composer. */
function ContextChip({
  icon: Icon,
  label,
  detail,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  detail?: string;
}) {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-2 rounded-md border bg-card px-2.5 py-1.5 text-xs transition-colors hover:bg-muted"
    >
      <Icon className="size-3.5 shrink-0 text-muted-foreground" strokeWidth={1.75} />
      <span>{label}</span>
      {detail && (
        <>
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground">{detail}</span>
          <span className="text-muted-foreground">›</span>
        </>
      )}
    </button>
  );
}

export default function PromptInputScreen() {
  const [prompt, setPrompt] = React.useState(DEFAULT_PROMPT);
  const [model, setModel] = React.useState(MODELS[0]);
  const [voiceState, setVoiceState] = React.useState<VoiceState>("listening");
  const [releaseVisible, setReleaseVisible] = React.useState(true);
  const [submitted, setSubmitted] = React.useState<string | null>(null);

  return (
    <div className="flex flex-1">
      <ScreenNav
        title="Douglas"
        badge={
          <>
            <span className="h-4 w-7 rounded-full bg-muted" aria-hidden />
            <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" strokeWidth={1.75} />
          </>
        }
        footer={
          releaseVisible ? (
            <div className="flex flex-col gap-1.5 rounded-lg border bg-card p-3">
              <div className="flex items-start justify-between gap-2">
                <span className="text-sm font-medium">Release 2.9.1</span>
                <button
                  type="button"
                  onClick={() => setReleaseVisible(false)}
                  aria-label="Dismiss release note"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  <X className="size-3.5" strokeWidth={1.75} />
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                You can add components to your app
              </p>
            </div>
          ) : null
        }
      >
        <ScreenNavGroup>
          <ScreenNavItem icon={Search} label="Search" />
          <ScreenNavItem icon={FolderTree} label="Projects" active />
          <ScreenNavItem icon={Clock} label="Recents" />
          <ScreenNavItem icon={Share2} label="Community" />
        </ScreenNavGroup>
        <ScreenNavGroup label="Space">
          <ScreenNavItem label="Favorite Projects" trailingChevron />
          <ScreenNavItem label="Favorite Chats" trailingChevron />
          <ScreenNavItem label="Recents" trailingChevron />
        </ScreenNavGroup>
      </ScreenNav>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-12 items-center gap-3 border-b px-4 text-sm">
          <PanelLeft className="size-4 shrink-0 text-muted-foreground" strokeWidth={1.75} />
          <span className="h-4 w-px bg-border" aria-hidden />
          <span className="text-muted-foreground">Projects</span>
          <span className="text-muted-foreground">›</span>
          <span>New</span>
        </div>

        <div className="flex flex-1 flex-col items-center gap-8 overflow-y-auto px-6 py-12">
          <h1 className="text-center text-4xl font-semibold tracking-tight">
            What can I help you build?
          </h1>

          <div className="flex w-full max-w-2xl flex-col gap-3">
            <div className="flex flex-col gap-3 rounded-xl border bg-card p-4 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={14}
                aria-label="Describe what to build"
                className="w-full resize-none bg-transparent text-sm leading-relaxed outline-none placeholder:text-muted-foreground"
              />
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon-lg" aria-label="Add context">
                    <Plus strokeWidth={1.75} />
                  </Button>
                  <Button variant="ghost" size="icon-lg" aria-label="Attach a file">
                    <Paperclip strokeWidth={1.75} />
                  </Button>
                  <VoiceStatusPill
                    state={voiceState}
                    onClick={() =>
                      setVoiceState((s) => (s === "listening" ? "idle" : "listening"))
                    }
                  />
                </div>
                <div className="flex items-center gap-1">
                  <ParameterSelector label="Model">
                    {MODELS.map((option) => (
                      <ParameterSelectorItem
                        key={option.id}
                        label={option.label}
                        description={option.description}
                        active={option.id === model.id}
                        onSelect={() => setModel(option)}
                      />
                    ))}
                  </ParameterSelector>
                  <Button
                    size="icon-lg"
                    className="rounded-full"
                    aria-label="Send"
                    disabled={!prompt.trim()}
                    onClick={() => setSubmitted(prompt.trim().split("\n")[0])}
                  >
                    <ArrowUp strokeWidth={1.75} />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <ContextChip icon={Frame} label="Import from Figma" detail="UI kit" />
              <ContextChip icon={FileText} label="Guidelines.pdf" detail="" />
              <Button variant="outline" size="sm" aria-label="Add a folder">
                <FolderPlus strokeWidth={1.75} />
                <Plus strokeWidth={1.75} />
              </Button>
            </div>

            {submitted && (
              <span className="text-xs text-muted-foreground">
                Sent to {model.label}: “{submitted}…”
              </span>
            )}
          </div>

          <div className="flex w-full max-w-5xl flex-col gap-3">
            <div className="flex items-end justify-between gap-4">
              <div className="flex flex-col">
                <span className="text-sm font-semibold">From the community</span>
                <span className="text-xs text-muted-foreground">
                  Explore what the community is building
                </span>
              </div>
              <button
                type="button"
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                Browse All ↓
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {COMMUNITY.map((item) => (
                <div
                  key={item.title}
                  className={cn(
                    "flex flex-col gap-2 overflow-hidden rounded-xl border bg-card p-2 transition-colors hover:bg-muted/40"
                  )}
                >
                  <div className="h-24 rounded-lg bg-sidebar" aria-hidden />
                  <div className="flex flex-col px-1 pb-1">
                    <span className="truncate text-xs font-medium">{item.title}</span>
                    <span className="truncate text-xs text-muted-foreground">{item.meta}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
