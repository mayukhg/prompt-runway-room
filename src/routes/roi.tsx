import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Bar, BarChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Guard, Card, PageHeader, Stat, chartTheme } from "@/components/relay/kit";
import { METRICS, WEEKS } from "@/lib/relay/data";
import { useRelay } from "@/lib/relay/store";
import { pageHead } from "@/lib/relay/head";

export const Route = createFileRoute("/roi")({
  head: pageHead("ROI & cost", "Estimated value returned versus licence and usage cost, with budget alerts."),
  component: () => <Guard><Roi /></Guard>,
});

function Roi() {
  const { budgetAlert, set } = useRelay();
  const [val, setVal] = useState(String(budgetAlert));
  const burn = WEEKS.map((w, i) => ({ w, v: METRICS.credits[i] }));
  return (
    <>
      <PageHeader title="ROI & cost" sub="Value is an estimate: 4.2 hours/week × 36 active users × $110 loaded hourly cost." />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Est. value returned / month" value="$71.9k" hint="Estimate" tone="success" />
        <Stat label="Licence + usage / month" value="$9.8k" />
        <Stat label="Cost per weekly active user" value="$272" />
        <Stat label="Return multiple" value="7.3×" tone="success" hint="Estimate" />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card title="Usage-credit burn (long-running tasks)" className="lg:col-span-2">
          <div className="h-56"><ResponsiveContainer><BarChart data={burn}><CartesianGrid stroke={chartTheme.grid} vertical={false} /><XAxis dataKey="w" stroke={chartTheme.axis} fontSize={11} /><YAxis stroke={chartTheme.axis} fontSize={11} width={40} /><Tooltip contentStyle={chartTheme.tooltip} /><ReferenceLine y={budgetAlert} stroke="var(--chart-5)" strokeDasharray="4 4" label={{ value: "Alert", fill: "var(--muted-foreground)", fontSize: 11 }} /><Bar dataKey="v" fill="var(--chart-1)" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div>
        </Card>
        <Card title="Budget alert">
          <form onSubmit={(e) => { e.preventDefault(); const n = Number(val); if (!n || n < 0) { toast.error("Enter a positive number of credits"); return; } set({ budgetAlert: n }); toast.success(`Alert set at ${n.toLocaleString("en-US")} credits/week`); }}>
            <Label htmlFor="ba">Alert me when weekly credits exceed</Label>
            <Input id="ba" className="tnum mt-2" inputMode="numeric" value={val} onChange={(e) => setVal(e.target.value)} />
            <Button type="submit" className="mt-3 w-full">Save alert</Button>
          </form>
          <p className="mt-3 text-xs text-muted-foreground">This week: 4,700 credits ({Math.round((4700 / budgetAlert) * 100)}% of alert).</p>
        </Card>
      </div>
    </>
  );
}
