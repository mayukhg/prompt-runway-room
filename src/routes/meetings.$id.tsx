import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, FileText, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "@/lib/relay/toast";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Guard, Card, PageHeader, Pill, SourceChips, chartTheme } from "@/components/relay/kit";
import { MEETINGS, METRICS, WEEKS } from "@/lib/relay/data";
import { useRelay } from "@/lib/relay/store";

export const Route = createFileRoute("/meetings/$id")({
  loader: ({ params }) => {
    const m = MEETINGS.find((x) => x.id === params.id);
    if (!m) throw notFound();
    return { id: m.id, title: m.title };
  },
  head: ({ loaderData }) => {
    const t = loaderData ? `${loaderData.title} prep · Relay` : "Meeting prep · Relay";
    const d = "Meeting prep: the things not to miss, pre-read digest, context and suggested questions.";
    return { meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] };
  },
  notFoundComponent: () => <div className="p-8 text-center"><p className="font-medium">That meeting isn't in this demo.</p><Link to="/meetings" className="text-primary underline">Back to meetings</Link></div>,
  component: () => <Guard><Prep /></Guard>,
});

function Prep() {
  const { id } = Route.useParams();
  const m = MEETINGS.find((x) => x.id === id)!;
  const prepReady = useRelay((s) => s.prepReady);
  const accuracy = WEEKS.map((w, i) => ({ w, v: METRICS.briefAccuracy[i] }));
  return (
    <>
      <Link to="/meetings" className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" />Meetings</Link>
      <PageHeader title={m.title} sub={`${m.day} · ${m.time}–${m.end} · ${m.attendees.length} attendees`} actions={m.id === "m2" && prepReady ? <Pill tone="success">Prep refreshed 09:50</Pill> : undefined} />
      <section className="mb-6 rounded-xl border border-primary/40 bg-card p-5">
        <h2 className="mb-3 text-sm font-medium text-primary">Don't miss these {m.dontMiss.length} things</h2>
        <ul className="space-y-2">{m.dontMiss.map((d) => <li key={d.text} className="flex flex-wrap items-center justify-between gap-2"><span>{d.text}</span><SourceChips sources={[d.source]} /></li>)}</ul>
      </section>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {m.preRead && (
            <Card title="Pre-read digest">
              <div className="flex items-start gap-3"><FileText className="mt-0.5 h-5 w-5 text-info" /><div><p className="font-medium">{m.preRead.title}</p><p className="text-xs text-muted-foreground">{m.preRead.pages} pages · summarised for you</p></div></div>
              <p className="mt-3 text-sm">{m.preRead.summary}</p>
              <p className="mt-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">What matters to you</p>
              <ul className="mt-1 space-y-1 text-sm">{m.preRead.highlights.map((h) => <li key={h.text} className="flex justify-between gap-2"><span>{h.text}</span><span className="tnum text-xs text-muted-foreground">p. {h.page}</span></li>)}</ul>
              <Button variant="link" className="mt-2 h-auto p-0" onClick={() => toast("Opening full document", { description: m.preRead!.title })}>Read full document</Button>
            </Card>
          )}
          <Card title="Context">
            <div className="grid gap-4 sm:grid-cols-2">
              <div><p className="mb-1 text-xs text-muted-foreground">Attendees</p><ul className="space-y-1.5 text-sm">{m.attendees.map((a) => <li key={a.name}><span className="font-medium">{a.name}</span> <span className="text-muted-foreground">· {a.role}</span><br /><span className="text-xs text-muted-foreground">Last: {a.last}</span></li>)}</ul></div>
              <div className="space-y-3 text-sm">
                {m.threads.length > 0 && <div><p className="mb-1 text-xs text-muted-foreground">Related threads</p><ul className="space-y-0.5">{m.threads.map((t) => <li key={t}>{t}</li>)}</ul></div>}
                {m.openItems.length > 0 && <div><p className="mb-1 text-xs text-muted-foreground">Open items</p><ul>{m.openItems.map((t) => <li key={t}>{t}</li>)}</ul></div>}
                {m.decisions.length > 0 && <div><p className="mb-1 text-xs text-muted-foreground">Decisions pending</p><ul>{m.decisions.map((t) => <li key={t}>{t}</li>)}</ul></div>}
              </div>
            </div>
          </Card>
        </div>
        <div className="space-y-6">
          {m.questions.length > 0 && <Card title="Suggested questions"><ul className="list-disc space-y-1.5 pl-4 text-sm">{m.questions.map((q) => <li key={q}>{q}</li>)}</ul></Card>}
          {m.past && m.grade && (
            <Card title="How well did this brief predict the meeting?">
              <p className="tnum text-2xl font-semibold">{m.grade.hit} of {m.grade.total} <span className="text-sm font-normal text-muted-foreground">key points discussed</span></p>
              <p className="mt-1 text-xs text-muted-foreground">Compared with the action-items email, meeting notes and follow-up Slack.</p>
              <div className="mt-3 flex items-start gap-2 text-sm"><XCircle className="mt-0.5 h-4 w-4 shrink-0 text-warning" /><span><span className="text-muted-foreground">Missed:</span> {m.grade.missed}</span></div>
              <p className="mt-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">What I'll do differently next time</p>
              <ul className="mt-1 space-y-1 text-sm">{m.grade.nextTime.map((n) => <li key={n} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />{n}</li>)}</ul>
              <p className="mt-4 text-xs text-muted-foreground">Brief accuracy, last 6 weeks</p>
              <div className="h-28"><ResponsiveContainer><LineChart data={accuracy}><CartesianGrid stroke={chartTheme.grid} vertical={false} /><XAxis dataKey="w" stroke={chartTheme.axis} fontSize={11} /><YAxis domain={[0, 100]} stroke={chartTheme.axis} fontSize={11} width={28} /><Tooltip contentStyle={chartTheme.tooltip} formatter={(v) => `${v}%`} /><Line dataKey="v" stroke="var(--chart-1)" strokeWidth={2} dot={false} isAnimationActive={false} /></LineChart></ResponsiveContainer></div>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
