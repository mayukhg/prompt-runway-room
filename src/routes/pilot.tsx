import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { toast } from "@/lib/relay/toast";
import { Button } from "@/components/ui/button";
import { Guard, Card, PageHeader, Pill } from "@/components/relay/kit";
import { useRelay } from "@/lib/relay/store";
import { pageHead } from "@/lib/relay/head";

export const Route = createFileRoute("/pilot")({
  head: pageHead("Pilot readiness", "Pilot exit gates: adoption, brief quality, CISO sign-off and data incidents."),
  component: () => <Guard><Pilot /></Guard>,
});

const NEXT = ["Customer Success", "Legal"];

function Pilot() {
  const { pilotTeams, seats, set } = useRelay();
  const gates = [
    { t: "≥60% weekly active", v: "86%", s: "pass" },
    { t: "≥70% briefs used unedited", v: "74%", s: "pass" },
    { t: "CISO sign-off", v: "Review scheduled Thu", s: "risk" },
    { t: "0 data incidents", v: "0 incidents · 12 threats blocked", s: "pass" },
  ];
  const next = NEXT.find((n) => !pilotTeams.includes(n));
  return (
    <>
      <PageHeader title="Pilot readiness" sub={`${pilotTeams.length} teams · ${seats} seats`} />
      <Card>
        <ul className="divide-y divide-border">
          {gates.map((g) => {
            const I = g.s === "pass" ? CheckCircle2 : g.s === "risk" ? AlertCircle : XCircle;
            return (
              <li key={g.t} className="flex items-center gap-3 py-3">
                <I className={g.s === "pass" ? "h-5 w-5 text-success" : g.s === "risk" ? "h-5 w-5 text-warning" : "h-5 w-5 text-danger"} />
                <span className="flex-1 font-medium">{g.t}</span><span className="tnum text-sm text-muted-foreground">{g.v}</span>
                <Pill tone={g.s === "pass" ? "success" : g.s === "risk" ? "warning" : "danger"}>{g.s === "pass" ? "Pass" : g.s === "risk" ? "At risk" : "Fail"}</Pill>
              </li>
            );
          })}
        </ul>
      </Card>
      <Card className="mt-6" title="Expand the pilot">
        <p className="text-sm text-muted-foreground">Teams in pilot: {pilotTeams.join(", ")}</p>
        {next ? <Button className="mt-3" onClick={() => { set({ pilotTeams: [...pilotTeams, next], seats: seats + 14 }); toast.success(`${next} added to the pilot`, { description: "14 invites queued. Mei's policy pack applies automatically." }); }}>Expand to next team: {next}</Button> : <p className="mt-3 text-sm">All planned teams are in the pilot.</p>}
      </Card>
    </>
  );
}
