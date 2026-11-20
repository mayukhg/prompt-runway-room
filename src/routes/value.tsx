import { createFileRoute } from "@tanstack/react-router";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Guard, Card, PageHeader, Stat, Pill, Redacted, chartTheme } from "@/components/relay/kit";
import { METRICS, WEEKS } from "@/lib/relay/data";
import { useRelay } from "@/lib/relay/store";
import { pageHead } from "@/lib/relay/head";

export const Route = createFileRoute("/value")({
  head: pageHead("Value dashboard", "Accepted delegations per weekly active user and supporting pilot value metrics."),
  component: () => <Guard><Value /></Guard>,
});

function Value() {
  const { draftVolume, autonomyMix, briefFeedback } = useRelay();
  const ns = WEEKS.map((w, i) => ({ w, v: METRICS.northStar[i] }));
  const mix = Object.entries(autonomyMix).map(([k, v]) => ({ k, v }));
  const worth = briefFeedback === "Yes" ? 79 : 78;
  return (
    <>
      <PageHeader title="Value dashboard" sub="Leadership pilot · 42 leaders · week 6 of 6" actions={<Pill tone="info">Mock data · fictional pilot</Pill>} />
      <Card title="North star: accepted delegations per weekly active user" className="mb-6">
        <p className="tnum text-4xl font-semibold">5.3 <span className="text-sm font-normal text-success">+15% vs last week</span></p>
        <div className="mt-2 h-48"><ResponsiveContainer><AreaChart data={ns}><CartesianGrid stroke={chartTheme.grid} vertical={false} /><XAxis dataKey="w" stroke={chartTheme.axis} fontSize={11} /><YAxis stroke={chartTheme.axis} fontSize={11} width={28} /><Tooltip contentStyle={chartTheme.tooltip} /><Area dataKey="v" stroke="var(--chart-1)" fill="var(--chart-1)" fillOpacity={0.15} strokeWidth={2} isAnimationActive={false} /></AreaChart></ResponsiveContainer></div>
      </Card>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <Stat label="Weekly active users" value="36" hint="86% of pilot" />
        <Stat label="Briefs used unedited" value="74%" />
        <Stat label="Draft acceptance" value="81%" hint={`${draftVolume.toLocaleString("en-US")} drafts total`} />
        <Stat label="'Brief worth it'" value={`${worth}%`} />
        <Stat label="Hours returned / user / wk" value="4.2h" hint="Estimate" />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card title="Autonomy mix (share of actions)">
          <div className="h-44"><ResponsiveContainer><BarChart data={mix}><CartesianGrid stroke={chartTheme.grid} vertical={false} /><XAxis dataKey="k" stroke={chartTheme.axis} fontSize={11} /><YAxis stroke={chartTheme.axis} fontSize={11} width={28} unit="%" /><Tooltip contentStyle={chartTheme.tooltip} /><Bar dataKey="v" fill="var(--chart-1)" radius={[4, 4, 0, 0]} isAnimationActive={false} /></BarChart></ResponsiveContainer></div>
        </Card>
        <div><p className="mb-2 text-xs text-muted-foreground">How it works for users (no content visible to you)</p><Redacted /></div>
      </div>
    </>
  );
}
