import { createFileRoute } from "@tanstack/react-router";
import { Guard, PageHeader, Stat, Pill, Card } from "@/components/relay/kit";
import { useRelay } from "@/lib/relay/store";
import { pageHead } from "@/lib/relay/head";

export const Route = createFileRoute("/security-summary")({
  head: pageHead("Security summary", "Read-only security summary for the CIO: compliance, threats blocked and CISO sign-off."),
  component: () => <Guard><Summary /></Guard>,
});

function Summary() {
  const threats = useRelay((s) => s.threatsBlocked);
  return (
    <>
      <PageHeader title="Security summary" sub="Read-only · details are visible to the CISO only" actions={<Pill>Read-only</Pill>} />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Stat label="Policy compliance" value="99.6%" tone="success" />
        <Stat label="Threats blocked this week" value={threats} tone="warning" />
        <Stat label="CISO sign-off" value="In review" tone="info" hint="Mei Lin · Thu 19 Nov" />
      </div>
      <Card className="mt-6" title="What this means"><p className="text-sm">Every external send needs approval, no agent can act on finance data, and every action is in an audit trail your security team owns.</p></Card>
    </>
  );
}
