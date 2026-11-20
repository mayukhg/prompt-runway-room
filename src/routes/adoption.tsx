import { createFileRoute } from "@tanstack/react-router";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Guard, Card, PageHeader, chartTheme } from "@/components/relay/kit";
import { AdoptionByTeam } from "@/components/relay/adoption";
import { FUNNEL, METRICS, WEEKS } from "@/lib/relay/data";
import { pageHead } from "@/lib/relay/head";

export const Route = createFileRoute("/adoption")({
  head: pageHead("Adoption", "Team-level adoption, activation funnel and shadow-AI displacement."),
  component: () => <Guard><Adoption /></Guard>,
});

function Adoption() {
  const shadow = WEEKS.map((w, i) => ({ w, v: METRICS.shadowAI[i] }));
  return (
    <>
      <PageHeader title="Adoption" sub="Team-level only. No individual leaderboards." />
      <div className="grid gap-6 lg:grid-cols-2">
        <AdoptionByTeam />
        <Card title="Activation funnel">
          <ul className="space-y-3">
            {FUNNEL.map((f) => (
              <li key={f.stage}><div className="flex justify-between text-sm"><span>{f.stage}</span><span className="tnum">{f.n}</span></div><div className="mt-1 h-2 rounded-full bg-secondary"><div className="h-2 rounded-full bg-primary" style={{ width: `${(f.n / 42) * 100}%` }} /></div></li>
            ))}
          </ul>
        </Card>
        <Card title="Shadow-AI displacement: unapproved AI tool sessions per 100 users" className="lg:col-span-2">
          <div className="h-52"><ResponsiveContainer><LineChart data={shadow}><CartesianGrid stroke={chartTheme.grid} vertical={false} /><XAxis dataKey="w" stroke={chartTheme.axis} fontSize={11} /><YAxis stroke={chartTheme.axis} fontSize={11} width={28} /><Tooltip contentStyle={chartTheme.tooltip} /><Line dataKey="v" stroke="var(--chart-3)" strokeWidth={2} /></LineChart></ResponsiveContainer></div>
        </Card>
      </div>
    </>
  );
}
