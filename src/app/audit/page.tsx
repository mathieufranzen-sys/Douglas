import { AppShell } from "@/components/douglas/app-shell";
import { ActivityLogRow } from "@/components/douglas/activity-log-row";
import { AgentErrorCard } from "@/components/douglas/agent-error-card";

export default function AuditPage() {
  return (
    <AppShell active="/audit">
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-10 px-6 py-10">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold">Audit & history</h1>
          <p className="text-sm text-muted-foreground">
            Every action taken by the agent or a teammate, in order — including what went wrong.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-sm font-medium text-muted-foreground">Needs attention</h2>
          <AgentErrorCard
            title="Inventory sync failed"
            description="The connection to the warehouse API timed out after 3 retries."
          />
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-medium text-muted-foreground">Activity</h2>
          <div className="rounded-xl border bg-card px-4">
            <ActivityLogRow actor="agent" action="Started inventory sync with warehouse API" timestamp="14:32" />
            <ActivityLogRow actor="agent" action="Sync failed after 3 retries: connection timeout" timestamp="14:33" isError />
            <ActivityLogRow actor="user" action="Approved export of 340 contacts to Salesforce" timestamp="13:58" />
            <ActivityLogRow actor="agent" action="Synced 340 contacts to Salesforce CRM" timestamp="13:59" />
            <ActivityLogRow actor="agent" action="Archived 128 completed support tickets" timestamp="11:20" />
            <ActivityLogRow actor="user" action="Changed autonomy level to Confirm before acting" timestamp="09:04" />
            <ActivityLogRow actor="agent" action="Sent daily inbox digest" timestamp="08:00" />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
