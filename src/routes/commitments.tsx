import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Info } from "lucide-react";
import { toast } from "@/lib/relay/toast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Guard, Card, PageHeader, Pill, SourceChips, statusTone } from "@/components/relay/kit";
import type { Commitment } from "@/lib/relay/data";
import { useRelay } from "@/lib/relay/store";
import { pageHead } from "@/lib/relay/head";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/commitments")({
  head: pageHead("Commitments", "What Priya is owed and what she owes, with polite approved nudges."),
  component: () => <Guard><Commitments /></Guard>,
});

type ToneKey = "Gentle" | "Neutral" | "Direct";
const nudgeText = (c: Commitment, t: ToneKey) => {
  const first = c.who.split(" ")[0];
  return t === "Gentle" ? `Hi ${first}, friendly reminder: you mentioned the ${c.what.toLowerCase()} would be ready ${c.promised}. Any update? No rush if it's close.\n\nThanks, P`
    : t === "Neutral" ? `Hi ${first}, checking on the ${c.what.toLowerCase()} (due ${c.promised}). When can I expect it?\n\nThanks, P`
    : `${first}, I need the ${c.what.toLowerCase()} for Friday's review. Can you send it by tomorrow noon?\n\nThanks, P`;
};

function Commitments() {
  const { commitments, nudge } = useRelay();
  const [open, setOpen] = useState<Commitment | null>(null);
  const [tone, setTone] = useState<ToneKey>("Gentle");
  const [text, setText] = useState("");
  const openNudge = (c: Commitment) => { setOpen(c); setTone("Gentle"); setText(nudgeText(c, "Gentle")); };

  const list = (dir: "owed" | "owe") => (
    <Card className="p-2">
      <ul className="divide-y divide-border">
        {commitments.filter((c) => c.direction === dir).map((c) => (
          <li key={c.id} className="flex flex-wrap items-center gap-3 px-3 py-3">
            <div className="min-w-0 flex-1"><p className="font-medium">{c.what}</p><p className="text-xs text-muted-foreground">{dir === "owed" ? "From" : "To"} {c.who} · promised {c.promised}</p></div>
            <SourceChips sources={[c.source]} />
            <Pill tone={statusTone(c.status)}>{c.status}</Pill>
            {dir === "owed" && c.status === "Overdue" && (c.nudged ? <Pill tone="success">Nudge sent</Pill> : <Button size="sm" variant="outline" onClick={() => openNudge(c)}>Draft a nudge</Button>)}
          </li>
        ))}
      </ul>
    </Card>
  );

  return (
    <>
      <PageHeader title="Commitments" sub="Promises made in meetings, email and Slack, tracked both ways." />
      <p className="mb-4 flex items-center gap-2 text-sm text-muted-foreground"><Info className="h-4 w-4" />Relay only tracks requests you made or received. Nudges are sent only after your approval.</p>
      <Tabs defaultValue="owed">
        <TabsList><TabsTrigger value="owed">Owed to me</TabsTrigger><TabsTrigger value="owe">I owe</TabsTrigger></TabsList>
        <TabsContent value="owed" className="mt-4">{list("owed")}</TabsContent>
        <TabsContent value="owe" className="mt-4">{list("owe")}</TabsContent>
      </Tabs>
      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Nudge {open?.who}</DialogTitle><DialogDescription>Relay never sends nudges automatically. Review and approve.</DialogDescription></DialogHeader>
          <div className="flex gap-1" role="radiogroup" aria-label="Tone">{(["Gentle", "Neutral", "Direct"] as const).map((t) => <button key={t} role="radio" aria-checked={tone === t} onClick={() => { setTone(t); if (open) setText(nudgeText(open, t)); }} className={cn("rounded-full px-3 py-1 text-xs", tone === t ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground")}>{t}</button>)}</div>
          <Textarea rows={6} value={text} onChange={(e) => setText(e.target.value)} aria-label="Nudge message" />
          <DialogFooter><Button variant="ghost" onClick={() => setOpen(null)}>Cancel</Button><Button onClick={() => { if (open) { nudge(open.id); toast.success(`Nudge sent to ${open.who} via Slack`); } setOpen(null); }}>Approve and send</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
