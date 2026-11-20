import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Guard, Card, PageHeader, Pill, Empty, chartTheme } from "@/components/relay/kit";
import { LEVELS, METRICS, WEEKS } from "@/lib/relay/data";
import { useRelay } from "@/lib/relay/store";
import { pageHead } from "@/lib/relay/head";

export const Route = createFileRoute("/evals")({
  head: pageHead("Evals & red-team", "Prompt-injection success rate, eval pass rates per action class, and autonomy unlock requests."),
  component: () => <Guard><Evals /></Guard>,
});

function Evals() {
  const { trust, decideUpgrade, upgradeDecisions } = useRelay();
  const inj = WEEKS.map((w, i) => ({ w, v: METRICS.injectionSuccess[i] }));
  const pass = trust.map((t) => ({ name: t.name.replace("Send ", "").replace("Accept internal meeting invites", "Accept invites"), v: t.evalPass }));
  const requests = trust.filter((t) => t.pending);
  return (
    <>
      <PageHeader title="Evals & red-team" sub="Last red-team run: Sun 15 Nov · 1,200 adversarial prompts · 2 successes (0.2%)" />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Prompt-injection attack success rate">
          <div className="h-52"><ResponsiveContainer><LineChart data={inj}><CartesianGrid stroke={chartTheme.grid} vertical={false} /><XAxis dataKey="w" stroke={chartTheme.axis} fontSize={11} /><YAxis stroke={chartTheme.axis} fontSize={11} width={30} unit="%" /><Tooltip contentStyle={chartTheme.tooltip} /><Line dataKey="v" stroke="var(--chart-3)" strokeWidth={2} /></LineChart></ResponsiveContainer></div>
        </Card>
        <Card title="Eval pass rate by action class (target 90%)">
          <div className="h-52"><ResponsiveContainer><BarChart data={pass} layout="vertical" margin={{ left: 40 }}><CartesianGrid stroke={chartTheme.grid} horizontal={false} /><XAxis type="number" domain={[0, 100]} stroke={chartTheme.axis} fontSize={11} /><YAxis type="category" dataKey="name" stroke={chartTheme.axis} fontSize={11} width={110} /><Tooltip contentStyle={chartTheme.tooltip} /><ReferenceLine x={90} stroke="var(--chart-1)" strokeDasharray="4 4" /><Bar dataKey="v" fill="var(--chart-2)" radius={4} /></BarChart></ResponsiveContainer></div>
        </Card>
        <Card title="Eligible to unlock L3/L4" className="lg:col-span-2">
          {requests.length === 0 && Object.keys(upgradeDecisions).length === 0 ? <Empty title="No pending requests" body="When a user requests more autonomy and eval thresholds are met, it appears here." /> : (
            <ul className="divide-y divide-border">
              {requests.map((t) => (
                <li key={t.id} className="flex flex-wrap items-center gap-3 py-3">
                  <div className="flex-1"><p className="font-medium">{t.name}</p><p className="text-xs text-muted-foreground">relay-pr-018 · {LEVELS[t.level]} → {LEVELS[t.level + 1]}</p></div>
                  <Pill tone="success">Eval {t.evalPass}%</Pill><Pill tone="success">Acceptance {t.accept}%</Pill>
                  <Button size="sm" onClick={() => { decideUpgrade(t.id, true); toast.success("Autonomy raised", { description: `${t.name} → ${LEVELS[t.level + 1]}` }); }}>Approve</Button>
                  <Button size="sm" variant="ghost" onClick={() => { decideUpgrade(t.id, false); toast("Deferred. The user is told it's under review."); }}>Defer</Button>
                </li>
              ))}
              {Object.entries(upgradeDecisions).map(([id, d]) => <li key={id} className="py-3 text-sm text-muted-foreground">{trust.find((t) => t.id === id)?.name}: {d}</li>)}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}
