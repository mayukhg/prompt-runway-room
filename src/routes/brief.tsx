import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "@/lib/relay/toast";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Guard, Card, PageHeader, SourceChips, Pill } from "@/components/relay/kit";
import { MEETINGS, type Source } from "@/lib/relay/data";
import { useRelay } from "@/lib/relay/store";
import { pageHead } from "@/lib/relay/head";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/brief")({
  head: pageHead("Morning brief", "Priya's 07:30 brief: decisions, slipped commitments, meetings and overnight changes."),
  component: () => <Guard><Brief /></Guard>,
});

const DECISIONS: { t: string; s: Source[] }[] = [
  { t: "EU tier pricing: Option A or B, before the 11:00 QBR", s: ["Email", "Slack"] },
  { t: "Approve Kenji's rate-limit spec (2 tickets blocked)", s: ["Doc", "Jira"] },
  { t: "Contractor headcount for Hannah (expires Friday)", s: ["Slack"] },
];
const SLIPPED: { t: string; s: Source[] }[] = [
  { t: "Max's churn analysis is 7 days late", s: ["Meeting notes"] },
  { t: "You owe Dana Wells an SSO date (due yesterday)", s: ["Email"] },
];
const OVERNIGHT: { t: string; s: Source[] }[] = [
  { t: "Laura Kim shared pricing model v4: Option B now 6% margin-positive", s: ["Doc"] },
  { t: "Acme raised a P2 on export timeouts", s: ["Jira"] },
];

function Section({ title, items }: { title: string; items: { t: string; s: Source[] }[] }) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-medium text-muted-foreground">{title}</h3>
      <ul className="space-y-2">{items.map((i) => <li key={i.t} className="flex flex-wrap items-center justify-between gap-2 text-sm"><span>{i.t}</span><SourceChips sources={i.s} /></li>)}</ul>
    </div>
  );
}

function Brief() {
  const { briefFeedback, set } = useRelay();
  const [view, setView] = useState<"app" | "teams" | "slack">("app");
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  useEffect(() => { const t = setTimeout(() => setLoading(false), 450); return () => clearTimeout(t); }, []);
  const today = MEETINGS.filter((m) => m.day === "Today");

  return (
    <>
      <PageHeader title="Morning brief" sub="Generated at 07:30 · about 90 seconds to read"
        actions={<div className="flex rounded-lg border border-border p-0.5" role="tablist" aria-label="Brief preview">{(["app", "teams", "slack"] as const).map((v) => <button key={v} role="tab" aria-selected={view === v} onClick={() => setView(v)} className={cn("rounded-md px-3 py-1 text-xs", view === v ? "bg-secondary text-foreground" : "text-muted-foreground")}>{v === "app" ? "In Relay" : v === "teams" ? "Teams preview" : "Slack preview"}</button>)}</div>} />
      {loading ? (
        <div className="space-y-3"><Skeleton className="h-32 w-full" /><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /></div>
      ) : view === "app" ? (
        <div className="space-y-4">
          <Card><Section title="3 decisions that need you" items={DECISIONS} /></Card>
          <Card><Section title="2 slipped commitments" items={SLIPPED} /></Card>
          <Card title="Today's meetings">
            <ul className="space-y-2">{today.map((m) => <li key={m.id}><Link to="/meetings/$id" params={{ id: m.id }} className="flex gap-3 rounded-md p-1 text-sm hover:bg-accent"><span className="tnum w-11 text-muted-foreground">{m.time}</span><span className="font-medium">{m.title}</span><span className="hidden text-muted-foreground sm:inline">· {m.context}</span></Link></li>)}</ul>
          </Card>
          <Card><Section title="Changed overnight" items={OVERNIGHT} /></Card>
        </div>
      ) : (
        <div className="mx-auto max-w-lg rounded-xl border border-border bg-card p-4">
          <div className="flex gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-primary text-sm font-bold text-primary-foreground">R</span>
            <div className="text-sm">
              <p><span className="font-semibold">Relay</span> <span className="text-xs text-muted-foreground">{view === "teams" ? "App · 07:30" : "APP 7:30 AM"}</span></p>
              <p className="mt-1 font-medium">Good morning, Priya. 3 decisions, 2 slips, 5 meetings.</p>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-muted-foreground">{DECISIONS.map((d) => <li key={d.t}>{d.t}</li>)}<li>{SLIPPED[0]?.t}</li></ul>
              <div className="mt-3 flex gap-2"><Pill tone="info">Open in Relay</Pill><Pill>Snooze brief</Pill></div>
            </div>
          </div>
        </div>
      )}
      <Card className="mt-6" title="Was today's brief worth your time?">
        <div className="flex flex-wrap gap-2">
          {(["Yes", "Somewhat", "No"] as const).map((v) => <Button key={v} variant={briefFeedback === v ? "default" : "outline"} size="sm" onClick={() => { set({ briefFeedback: v }); toast("Thanks. This helps Relay tune tomorrow's brief."); }}>{v}</Button>)}
        </div>
        {briefFeedback && briefFeedback !== "Yes" && (
          <div className="mt-3 space-y-2"><Textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="What would have made it more useful? (optional)" aria-label="Feedback comment" /><Button size="sm" variant="secondary" onClick={() => { setComment(""); toast("Comment saved"); }}>Save comment</Button></div>
        )}
      </Card>
    </>
  );
}
