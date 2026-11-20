import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Clock, Forward, Reply, Eye, Unlock, BellRing, Loader2, PartyPopper } from "lucide-react";
import { toast } from "@/lib/relay/toast";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Guard, Card, PageHeader, Pill, SourceChips, Why, statusTone } from "@/components/relay/kit";
import { useRelay } from "@/lib/relay/store";
import { MEETINGS, type QueueType } from "@/lib/relay/data";
import { pageHead } from "@/lib/relay/head";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: pageHead("Desk", "Priya's command center: the one most important thing, a quiet queue and today's meetings."),
  component: () => <Guard><Desk /></Guard>,
});

const ICON: Record<QueueType, typeof Reply> = { reply: Reply, review: Eye, unblock: Unlock, nudge: BellRing };
const FILTERS: ("all" | QueueType)[] = ["all", "reply", "review", "unblock", "nudge"];
const WEEK = [{ d: "Mon", m: 6, f: 1 }, { d: "Tue", m: 5.5, f: 1.5 }, { d: "Wed", m: 6.5, f: 0.5 }, { d: "Thu", m: 2.5, f: 4.5 }, { d: "Fri", m: 5, f: 2 }];

function Desk() {
  const { queue, setQueueStatus, prepReady } = useRelay();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");
  const [sel, setSel] = useState(0);
  const open = queue.filter((q) => q.status === "open");
  const hero = open[0];
  const rest = useMemo(() => open.slice(1).filter((q) => filter === "all" || q.type === filter), [open, filter]);

  const act = (id: string, kind: "done" | "snooze" | "delegate", label = "1 hour") => {
    if (kind === "done") { setQueueStatus(id, "done"); toast.success("Marked done", { action: { label: "Undo", onClick: () => setQueueStatus(id, "open") } }); }
    if (kind === "snooze") { setQueueStatus(id, "snoozed", label); toast(`Snoozed until ${label}`, { action: { label: "Undo", onClick: () => setQueueStatus(id, "open") } }); }
    if (kind === "delegate") { setQueueStatus(id, "delegated"); toast("Delegated to Sofia Marin", { description: "Relay drafted a handoff note for your review." }); }
  };

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("input,textarea,[role=dialog]") || e.metaKey || e.ctrlKey) return;
      const item = rest[sel];
      if (e.key === "j") setSel((i) => Math.min(i + 1, rest.length - 1));
      else if (e.key === "k") setSel((i) => Math.max(i - 1, 0));
      else if (e.key === "e" && item) act(item.id, "done");
      else if (e.key === "s" && item) act(item.id, "snooze");
      else if (e.key === "Enter" && item) toast(`Opening ${item.title}`, { description: `Source: ${item.where}` });
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  });

  const today = MEETINGS.filter((m) => m.day === "Today");

  return (
    <>
      <PageHeader title="Good morning, Priya" sub={`${open.length} things in your queue · ${today.length} meetings today · 1h 30m of focus protected`} />
      {hero ? (
        <section aria-label="Your most important thing right now" className="mb-6 rounded-xl border border-primary/40 bg-card p-6">
          <p className="text-xs font-medium uppercase tracking-wide text-primary">Your most important thing right now</p>
          <h2 className="mt-2 text-xl font-semibold">{hero.title}</h2>
          <p className="mt-1 text-muted-foreground">{hero.reason ?? hero.why}</p>
          <div className="mt-3 flex flex-wrap items-center gap-3"><SourceChips sources={hero.sources} /><Why text={hero.why} /></div>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button onClick={() => toast("Opened in context", { description: "Pricing model v4 and Rachel's email side by side." })}>Do now</Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild><Button variant="outline"><Clock className="mr-2 h-4 w-4" />Snooze</Button></DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onSelect={() => act(hero.id, "snooze", "in 1 hour")}>Snooze 1 hour</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => act(hero.id, "snooze", "tomorrow 9:00")}>Snooze until tomorrow 9:00</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => act(hero.id, "snooze", "Thursday 9:00")}>Snooze until Thursday 9:00</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" onClick={() => act(hero.id, "delegate")}><Forward className="mr-2 h-4 w-4" />Delegate</Button>
            <Button variant="ghost" onClick={() => act(hero.id, "done")}><Check className="mr-2 h-4 w-4" />Done</Button>
          </div>
        </section>
      ) : (
        <section className="mb-6 rounded-xl border border-success/40 bg-card p-8 text-center">
          <PartyPopper className="mx-auto h-6 w-6 text-success" />
          <h2 className="mt-2 text-xl font-semibold">You're clear.</h2>
          <p className="text-muted-foreground">Next meeting in 40 min. Enjoy the quiet.</p>
        </section>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2" title="Queue" action={<span className="hidden text-[11px] text-muted-foreground sm:block"><kbd>J</kbd>/<kbd>K</kbd> move · <kbd>E</kbd> done · <kbd>S</kbd> snooze · <kbd>Enter</kbd> open</span>}>
          <div className="mb-3 flex flex-wrap gap-1" role="tablist" aria-label="Filter queue">
            {FILTERS.map((f) => (
              <button key={f} role="tab" aria-selected={filter === f} onClick={() => { setFilter(f); setSel(0); }} className={cn("rounded-full px-3 py-1 text-xs capitalize", filter === f ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground")}>{f}</button>
            ))}
          </div>
          {rest.length === 0 ? <p className="py-6 text-center text-sm text-muted-foreground">Nothing here. Nice.</p> : (
            <ul className="divide-y divide-border">
              {rest.map((q, i) => {
                const I = ICON[q.type];
                return (
                  <li key={q.id} onClick={() => setSel(i)} className={cn("flex items-center gap-3 rounded-lg px-2 py-2.5", sel === i && "bg-accent")} aria-selected={sel === i}>
                    <I className="h-4 w-4 shrink-0 text-muted-foreground" aria-label={q.type} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm">{q.title}</p>
                      <p className="truncate text-xs text-muted-foreground">{q.from} · {q.where} · {q.age}</p>
                    </div>
                    <Why text={q.why} />
                    <Button size="icon" variant="ghost" className="h-7 w-7" aria-label="Snooze 1 hour" onClick={(e) => { e.stopPropagation(); act(q.id, "snooze", "in 1 hour"); }}><Clock className="h-3.5 w-3.5" /></Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7" aria-label="Mark done" onClick={(e) => { e.stopPropagation(); act(q.id, "done"); }}><Check className="h-3.5 w-3.5" /></Button>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        <div className="space-y-6">
          <Card title="Today's meetings">
            <ul className="space-y-2">
              {today.map((m) => {
                const status = m.id === "m2" && prepReady ? "Brief ready" : m.status;
                return (
                  <li key={m.id}>
                    <Link to="/meetings/$id" params={{ id: m.id }} className="flex items-center gap-3 rounded-lg p-2 hover:bg-accent">
                      <span className="tnum w-11 text-sm text-muted-foreground">{m.time}</span>
                      <span className="min-w-0 flex-1 truncate text-sm">{m.title}</span>
                      <Pill tone={status === "No materials yet" ? "muted" : statusTone(status === "Brief ready" ? "ready" : "info")}>{status}</Pill>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Card>
          <Card title="Week load">
            <div className="flex h-28 items-end gap-3" aria-label="Meeting hours versus focus time per day">
              {WEEK.map((d) => (
                <div key={d.d} className="flex flex-1 flex-col items-center gap-1">
                  <div className="flex w-full flex-col-reverse overflow-hidden rounded-md" style={{ height: 96 }}>
                    <div className="bg-info/60" style={{ height: `${(d.m / 8) * 100}%` }} title={`${d.m}h meetings`} />
                    <div className="bg-success/50" style={{ height: `${(d.f / 8) * 100}%` }} title={`${d.f}h focus`} />
                  </div>
                  <span className={cn("text-xs", d.d === "Tue" ? "font-semibold text-foreground" : "text-muted-foreground")}>{d.d}</span>
                </div>
              ))}
            </div>
            <div className="mt-2 flex gap-3 text-[11px] text-muted-foreground"><span className="flex items-center gap-1"><i className="h-2 w-2 rounded-sm bg-info/60" />Meetings</span><span className="flex items-center gap-1"><i className="h-2 w-2 rounded-sm bg-success/50" />Focus</span></div>
            <p className="mt-2 text-sm">Thursday is light: good for the roadmap draft.</p>
          </Card>
          <Card title="Relay is working on">
            <ul className="space-y-3 text-sm">
              {[{ t: "Researching 6 accounts for Friday's Sales review", d: 4, n: 6 }, { t: "Summarising Acme Corp account review (24 pages)", d: 1, n: 1 }].map((w) => (
                <li key={w.t}>
                  <div className="flex items-center gap-2">{w.d < w.n ? <Loader2 className="h-3.5 w-3.5 animate-spin text-info" /> : <Check className="h-3.5 w-3.5 text-success" />}<span className="flex-1">{w.t}</span><span className="tnum text-xs text-muted-foreground">{w.d}/{w.n}</span></div>
                  <div className="mt-1.5 h-1 rounded-full bg-secondary"><div className="h-1 rounded-full bg-info" style={{ width: `${(w.d / w.n) * 100}%` }} /></div>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </>
  );
}
