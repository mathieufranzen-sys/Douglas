import { AppShell } from "@/components/agent-ux/app-shell";
import { AutonomySelector } from "@/components/agent-ux/autonomy-selector";
import { ScheduledTaskCard } from "@/components/agent-ux/scheduled-task-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function DelegationPage() {
  return (
    <AppShell active="/delegation">
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-10 px-6 py-10">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold">Delegate a task</h1>
          <p className="text-sm text-muted-foreground">
            Set the autonomy level, then hand off a bounded task to the agent.
          </p>
        </div>

        <div className="flex flex-col gap-5 rounded-xl border bg-card p-5">
          <div className="flex flex-col gap-2">
            <Label>Autonomy level</Label>
            <AutonomySelector />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="task">Task</Label>
            <Input id="task" placeholder="e.g. Triage and respond to support tickets" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="duration">Duration</Label>
            <Input id="duration" placeholder="e.g. 7 days" />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline">Cancel</Button>
            <Button>Delegate</Button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold">Scheduled tasks</h2>
            <p className="text-sm text-muted-foreground">
              Recurring work the agent runs on its own, on a schedule.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <ScheduledTaskCard
              title="Daily inbox digest"
              description="Summarizes unread messages and flags anything urgent."
              frequency="Every day at 8:00 AM"
              nextRun="tomorrow"
            />
            <ScheduledTaskCard
              title="Weekly competitor price check"
              description="Compares pricing pages against last week's snapshot."
              frequency="Every Monday"
              nextRun="in 3 days"
              defaultActive={false}
            />
            <ScheduledTaskCard
              title="Backup project files"
              description="Archives the design system file and its dependencies."
              frequency="Every day at midnight"
              nextRun="in 11 hours"
            />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
