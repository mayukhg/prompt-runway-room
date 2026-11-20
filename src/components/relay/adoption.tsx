import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, chartTheme } from "./kit";
import { ADOPTION_BY_TEAM } from "@/lib/relay/data";

export function AdoptionByTeam() {
  return (
    <Card title="Weekly active by team (%)">
      <div className="h-60"><ResponsiveContainer><BarChart data={ADOPTION_BY_TEAM}><CartesianGrid stroke={chartTheme.grid} vertical={false} /><XAxis dataKey="team" stroke={chartTheme.axis} fontSize={11} /><YAxis domain={[0, 100]} stroke={chartTheme.axis} fontSize={11} width={30} /><Tooltip contentStyle={chartTheme.tooltip} /><Bar dataKey="active" fill="var(--chart-1)" radius={[4, 4, 0, 0]} isAnimationActive={false} /></BarChart></ResponsiveContainer></div>
      <p className="mt-2 text-xs text-muted-foreground">Team-level only. Relay never shows individual productivity scores.</p>
    </Card>
  );
}
