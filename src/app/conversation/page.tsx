import { AppShell } from "@/components/agent-ux/app-shell";
import { MessageBubble } from "@/components/agent-ux/message-bubble";
import { MessageActionRow } from "@/components/agent-ux/message-action-row";
import { ThinkingStep } from "@/components/agent-ux/thinking-step";
import { ArtifactCard } from "@/components/agent-ux/artifact-card";
import { ErrorRetryChip } from "@/components/agent-ux/error-retry-chip";
import { QuestionCard } from "@/components/agent-ux/question-card";
import { ComposeBar } from "@/components/agent-ux/compose-bar";
import { ChevronDown } from "lucide-react";

export default function ConversationPage() {
  return (
    <AppShell active="/conversation">
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-6 py-10">
        {/* Turn 1 */}
        <div className="flex flex-col gap-3">
          <MessageBubble>Give me 3 reasons to use AI, from a design angle.</MessageBubble>
          <div className="flex flex-col gap-3 text-sm leading-relaxed">
            <p>Three reasons, from a design angle:</p>
            <p>
              <strong>Speed on low-value tasks.</strong> Synthesizing interview verbatims,
              drafting personas from raw notes, generating realistic filler content for your
              mockups, documenting design system components. Everything that eats hours without
              engaging your judgment.
            </p>
            <p>
              <strong>Wider exploration space.</strong> On a flow or a UI, you produce ten
              variants in minutes instead of two. You don&apos;t keep the raw version, but you see
              options you wouldn&apos;t have considered, and you show up to a workshop with
              material rather than a blank page.
            </p>
            <p>
              <strong>Less friction with devs.</strong> You prototype in code rather than draw
              states, you speak the same technical language, the design-to-dev handoff hinges
              less on interpretation.
            </p>
            <MessageActionRow timestamp="2 hours ago" />
          </div>
        </div>

        {/* Turn 2 */}
        <div className="flex flex-col gap-3">
          <MessageBubble>
            Present the history of AI to me in chronological order, in a playful way, from
            beginning to end.
          </MessageBubble>
          <div className="flex flex-col gap-3">
            <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
              Thinking process for 21s
              <ChevronDown className="size-3.5" strokeWidth={1.75} />
            </button>
            <ArtifactCard title="AI history.svg" size="1.2 MB" />
            <MessageActionRow timestamp="2 hours ago" />
          </div>
        </div>

        {/* Turn 3 */}
        <div className="flex flex-col gap-3">
          <MessageBubble>Can you update the employee CRM with the new hires?</MessageBubble>
          <div className="flex flex-col gap-1">
            <ThinkingStep title="Use Application" timestamp="2 min ago" />
            <ThinkingStep title="Use Application" timestamp="2 min ago" />
            <div className="pb-4 pl-7">
              <ErrorRetryChip label="Failed using Application" />
            </div>
            <ThinkingStep title="Use Application" timestamp="1 min ago" showConnector={false} />
          </div>
          <div className="flex flex-col gap-3 text-sm">
            <p>
              You now have 12 new employee contacts in the Employee CRM. Each has its own
              personalised business card on Figma.
            </p>
            <MessageActionRow timestamp="1 min ago" />
          </div>
        </div>

        {/* Pending question, right above the compose bar */}
        <QuestionCard
          question="Which tone should the reply use?"
          step="3/3"
          options={["Formal", "Friendly", "Direct", "Other…"]}
        />

        <div className="sticky bottom-6">
          <ComposeBar />
        </div>
      </div>
    </AppShell>
  );
}
