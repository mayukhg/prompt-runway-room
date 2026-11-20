import { createFileRoute } from "@tanstack/react-router";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { toast } from "sonner";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Guard, Card, PageHeader } from "@/components/relay/kit";
import { SHADOW_LOG } from "@/lib/relay/data";
import { useRelay } from "@/lib/relay/store";
import { pageHead } from "@/lib/relay/head";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings")({
  head: pageHead("Settings", "Interrupt budget, priority thresholds, shadow mode log and delivery channels."),
  component: () => <Guard><Settings /></Guard>,
});

const TH: [string, string][] = [["vp", "VP and above"], ["key", "Key accounts"], ["blocked", "Blocked team members"], ["deadline", "Deadlines within 24h"]];

function Settings() {
  const { settings, set, shadowFeedback, interruptsUsed } = useRelay();
  const upd = (p: Partial<typeof settings>) => set({ settings: { ...settings, ...p } });
  return (
    <>
      <PageHeader title="Interrupt controls" sub="Relay defaults to pull, not push. You decide what's worth an interruption." />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Interrupt budget">
          <div className="flex items-baseline justify-between"><Label htmlFor="budget">Maximum interruptions per day</Label><span className="tnum text-2xl font-semibold">{settings.budget}</span></div>
          <Slider id="budget" className="mt-3" min={0} max={10} step={1} value={[settings.budget]} onValueChange={([v]) => upd({ budget: v ?? 0 })} aria-label="Interrupt budget" />
          <p className="mt-2 text-xs text-muted-foreground">{interruptsUsed} of {settings.budget} used today</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div><Label htmlFor="qf">Quiet from</Label><Input id="qf" type="time" value={settings.quietFrom} onChange={(e) => upd({ quietFrom: e.target.value })} /></div>
            <div><Label htmlFor="qt">Quiet until</Label><Input id="qt" type="time" value={settings.quietTo} onChange={(e) => upd({ quietTo: e.target.value })} /></div>
          </div>
          <p className="mt-3 text-sm">Focus blocks: Tue/Thu 09:00–11:00 (no interrupts)</p>
        </Card>
        <Card title="Interrupt me only for">
          <ul className="space-y-3">
            {TH.map(([k, l]) => <li key={k} className="flex items-center justify-between"><Label htmlFor={k}>{l}</Label><Switch id={k} checked={settings.thresholds[k] ?? false} onCheckedChange={(v) => upd({ thresholds: { ...settings.thresholds, [k]: v } })} /></li>)}
          </ul>
        </Card>
        <Card title="Shadow mode: what I would have pinged you about this week" className="lg:col-span-2">
          <ul className="divide-y divide-border">
            {SHADOW_LOG.map((s) => (
              <li key={s.id} className="flex items-center gap-3 py-2.5">
                <span className="tnum w-24 text-xs text-muted-foreground">{s.day}</span><span className="flex-1 text-sm">{s.text}</span>
                <span className="text-xs text-muted-foreground">Should I have?</span>
                {(["up", "down"] as const).map((d) => {
                  const I = d === "up" ? ThumbsUp : ThumbsDown;
                  return <Button key={d} size="icon" variant="ghost" aria-label={d === "up" ? "Yes, should have" : "No, shouldn't have"} className={cn("h-8 w-8", shadowFeedback[s.id] === d && "bg-accent text-primary")} onClick={() => { set({ shadowFeedback: { ...shadowFeedback, [s.id]: d } }); toast("Calibrated", { description: d === "up" ? "Relay will treat this as interrupt-worthy." : "Relay will hold these for your brief." }); }}><I className="h-4 w-4" /></Button>;
                })}
              </li>
            ))}
          </ul>
        </Card>
        <Card title="Channels" className="lg:col-span-2">
          <div className="grid gap-3 sm:grid-cols-3">
            {(["brief", "interrupts", "nudges"] as const).map((k) => (
              <div key={k}><Label className="capitalize">{k === "brief" ? "Morning brief" : k === "interrupts" ? "Interrupts" : "Nudge approvals"}</Label>
                <Select value={settings.channels[k] ?? "In-app"} onValueChange={(v) => { upd({ channels: { ...settings.channels, [k]: v } }); toast(`Delivered via ${v}`); }}>
                  <SelectTrigger aria-label={`${k} channel`}><SelectValue /></SelectTrigger>
                  <SelectContent>{["Teams", "Slack", "In-app"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
