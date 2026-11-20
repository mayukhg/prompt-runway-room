import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Undo2 } from "lucide-react";
import { toast } from "@/lib/relay/toast";
import { Button } from "@/components/ui/button";
import { Guard, Card, PageHeader, Pill, Why, statusTone } from "@/components/relay/kit";
import { useRelay } from "@/lib/relay/store";
import { pageHead } from "@/lib/relay/head";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/activity")({
  head: pageHead("My activity", "Everything Relay read, drafted, proposed and did for Priya, with reasons and undo."),
  component: () => <Guard><ActivityPage /></Guard>,
});

const KINDS = ["All", "Read", "Drafted", "Proposed", "Did", "Blocked"] as const;

function ActivityPage() {
  const { activity, undoActivity } = useRelay();
  const [k, setK] = useState<(typeof KINDS)[number]>("All");
  const rows = activity.filter((a) => k === "All" || a.kind === k);
  return (
    <>
      <PageHeader title="My activity" sub={`${activity.length} entries · only you can see this`} />
      <div className="mb-3 flex flex-wrap gap-1">{KINDS.map((x) => <button key={x} onClick={() => setK(x)} aria-pressed={k === x} className={cn("rounded-full px-3 py-1 text-xs", k === x ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground")}>{x}</button>)}</div>
      <Card className="p-2">
        <ul className="divide-y divide-border">
          {rows.map((a) => (
            <li key={a.id} className={cn("flex flex-wrap items-center gap-3 px-3 py-2.5", a.undone && "opacity-50")}>
              <span className="tnum w-24 text-xs text-muted-foreground">{a.time}</span>
              <Pill tone={a.kind === "Blocked" ? "danger" : "muted"}>{a.kind}</Pill>
              <div className="min-w-0 flex-1"><p className={cn("text-sm", a.undone && "line-through")}>{a.action}</p><p className="truncate text-xs text-muted-foreground">{a.target}</p></div>
              <Pill tone={statusTone(a.policy)}>Policy: {a.policy}</Pill>
              <Pill tone={a.approval === "Not required" ? "muted" : statusTone(a.approval)}>{a.approval}</Pill>
              <Why text={a.why} label="Why did Relay do this?" />
              {a.undoable && !a.undone && <Button size="sm" variant="ghost" onClick={() => { undoActivity(a.id); toast("Undone", { description: a.action }); }}><Undo2 className="mr-1 h-3.5 w-3.5" />Undo</Button>}
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}
