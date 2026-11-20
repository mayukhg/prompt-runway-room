import { createFileRoute } from "@tanstack/react-router";
import { Guard, PageHeader, Stat, Pill } from "@/components/relay/kit";
import { AdoptionByTeam } from "@/components/relay/adoption";
import { pageHead } from "@/lib/relay/head";

export const Route = createFileRoute("/adoption-summary")({
  head: pageHead("Adoption summary", "Read-only team-level adoption for the security team."),
  component: () => <Guard><Summary /></Guard>,
});

function Summary() {
  return (
    <>
      <PageHeader title="Adoption summary" sub="Read-only" actions={<Pill>Read-only</Pill>} />
      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-3"><Stat label="Active users" value="36 / 42" /><Stat label="Teams in pilot" value="6" /><Stat label="Unapproved AI tool traffic" value="-53%" tone="success" hint="vs. week 1" /></div>
      <AdoptionByTeam />
    </>
  );
}
