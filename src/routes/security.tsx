import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";
import { Guard, Card, PageHeader, Pill, Stat, Redacted, statusTone } from "@/components/relay/kit";
import { useRelay } from "@/lib/relay/store";
import { pageHead } from "@/lib/relay/head";

export const Route = createFileRoute("/security")({
  head: pageHead("Security overview", "Agent status, policy compliance, blocked actions and recent security events."),
  component: () => <Guard><Overview /></Guard>,
});

function Overview() {
  const { agents, threatsBlocked, secEvents, tenantKilled, trust } = useRelay();
  const active = tenantKilled ? 0 : agents.filter((a) => a.status === "Active").length;
  const reviews = trust.filter((t) => t.pending).length + 1;
  return (
    <>
      <PageHeader title="Security overview" sub="Leadership pilot · 42 agents · metadata and audit events only" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Agents active" value={active} hint="of 42 in pilot" tone={tenantKilled ? "danger" : "success"} />
        <Stat label="Policy compliance" value="99.6%" tone="success" />
        <Stat label="Actions blocked this week" value={threatsBlocked} tone="warning" />
        <Stat label="Open security reviews" value={reviews} tone="info" />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2" title="Recent security events" action={<Link to="/audit" className="text-xs text-primary">Open audit trail</Link>}>
          <ul className="space-y-3">
            {secEvents.map((e) => (
              <li key={e.id} className={e.detail ? "rounded-lg border border-danger/40 bg-danger/5 p-4" : "flex flex-wrap items-center gap-3"}>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="tnum w-20 text-xs text-muted-foreground">{e.time}</span>
                  <Pill tone={statusTone(e.kind)}>{e.kind}</Pill>
                  <span className="flex-1 text-sm">{e.text}</span>
                </div>
                {e.detail && (
                  <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
                    <div><dt className="text-xs text-muted-foreground">Source type</dt><dd>{e.detail.source}</dd></div>
                    <div><dt className="text-xs text-muted-foreground">Rule triggered</dt><dd className="flex items-center gap-1"><ShieldAlert className="h-3.5 w-3.5 text-danger" />{e.detail.rule}</dd></div>
                    <div><dt className="text-xs text-muted-foreground">Action prevented</dt><dd>{e.detail.prevented}</dd></div>
                    <div className="sm:col-span-3 text-xs text-muted-foreground">Email body: [content not visible to admins]</div>
                  </dl>
                )}
              </li>
            ))}
          </ul>
        </Card>
        <div className="space-y-6">
          <Card title="Risk posture">
            <ul className="space-y-2 text-sm">
              <li>All external sends require approval</li><li>0 autonomous actions on finance data</li><li>Readers isolated from actors</li><li>Delete actions disabled tenant-wide</li>
            </ul>
          </Card>
          <div><p className="mb-2 text-xs text-muted-foreground">What a user sees (illustration)</p><Redacted /></div>
        </div>
      </div>
    </>
  );
}
