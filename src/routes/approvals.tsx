import { createFileRoute } from "@tanstack/react-router";
import { Lock, ArrowDown, ArrowUp, Clock } from "lucide-react";
import { toast } from "@/lib/relay/toast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Guard, Card, PageHeader, Pill, Empty, Why, statusTone } from "@/components/relay/kit";
import { LEVELS } from "@/lib/relay/data";
import { isEligible } from "@/lib/relay/rules";
import { useRelay } from "@/lib/relay/store";
import { pageHead } from "@/lib/relay/head";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/approvals")({
  head: pageHead("Approvals", "Pending approvals and the trust ladder for each action class."),
  component: () => <Guard><Approvals /></Guard>,
});

function Approvals() {
  const { approvals, decideApproval, trust, stepDownClass, requestUpgrade } = useRelay();
  const pending = approvals.filter((a) => a.status === "pending");
  return (
    <>
      <PageHeader title="Approvals" sub="Relay never acts on anything external or irreversible without you." />
      <Tabs defaultValue="queue">
        <TabsList><TabsTrigger value="queue">Pending ({pending.length})</TabsTrigger><TabsTrigger value="ladder">Trust ladder</TabsTrigger></TabsList>
        <TabsContent value="queue" className="mt-4 space-y-3">
          {pending.length === 0 && <Empty title="Nothing waiting for you" body="New requests appear here and in your brief." />}
          {pending.map((a) => (
            <Card key={a.id}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div><p className="flex items-center gap-2 font-medium"><Lock className="h-4 w-4 text-warning" />{a.action}</p><p className="text-sm text-muted-foreground">{a.target}</p></div>
                <div className="flex items-center gap-2"><Pill tone={statusTone(a.risk)}>{a.risk} risk</Pill><Why text={a.why} label="Why does Relay want to do this?" /></div>
              </div>
              <p className="mt-3 rounded-md border border-border bg-secondary p-3 text-sm">{a.preview}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button onClick={() => { decideApproval(a.id, true); toast.success("Approved", { description: a.target }); }}>Approve</Button>
                <Button variant="outline" onClick={() => toast("Opened for editing")}>Edit</Button>
                <Button variant="ghost" onClick={() => { decideApproval(a.id, false); toast("Rejected. Relay won't do this."); }}>Reject</Button>
              </div>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="ladder" className="mt-4 space-y-4">
          <Card>
            <div className="flex items-end gap-2" aria-label="Trust ladder levels">
              {LEVELS.map((l, i) => (
                <div key={l} className="flex-1"><div className="rounded-t-md border border-border bg-secondary" style={{ height: 20 + i * 18 }} /><p className="mt-1 text-[11px] text-muted-foreground">{l}</p></div>
              ))}
            </div>
            <p className="mt-4 text-sm text-muted-foreground">You can step any action down at any time. Stepping up needs both your opt-in and company policy; your security team sets the maximum.</p>
          </Card>
          {trust.map((t) => (
            <Card key={t.id}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-medium">{t.name}</p>
                <div className="flex flex-wrap gap-2">
                  {t.pending ? <Pill tone="warning"><Clock className="h-3 w-3" />Pending admin approval</Pill> : isEligible(t) && <Pill tone="success">Eligible to move up</Pill>}
                  {t.level >= t.max && <Pill>At company maximum</Pill>}
                </div>
              </div>
              <div className="mt-3 flex gap-1" aria-label={`Current level ${LEVELS[t.level]}, maximum ${LEVELS[t.max]}`}>
                {LEVELS.map((l, i) => <div key={l} title={l} className={cn("h-2 flex-1 rounded-full", i <= t.level ? "bg-primary" : i <= t.max ? "bg-secondary" : "bg-secondary/40 opacity-40")} />)}
              </div>
              <div className="tnum mt-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
                <div><p className="text-xs text-muted-foreground">Current</p>{LEVELS[t.level]}</div>
                <div><p className="text-xs text-muted-foreground">Company max</p>{LEVELS[t.max]}</div>
                <div><p className="text-xs text-muted-foreground">Eval pass rate</p>{t.evalPass}%</div>
                <div><p className="text-xs text-muted-foreground">4-week acceptance</p>{t.accept}%</div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button size="sm" variant="outline" disabled={t.level === 0} onClick={() => { stepDownClass(t.id); toast(`Stepped down to ${LEVELS[Math.max(0, t.level - 1)]}`); }}><ArrowDown className="mr-1 h-3.5 w-3.5" />Step down</Button>
                {isEligible(t) && !t.pending && <Button size="sm" onClick={() => { requestUpgrade(t.id); toast("Upgrade requested", { description: "Your security team will review the eval evidence." }); }}><ArrowUp className="mr-1 h-3.5 w-3.5" />Eligible: request upgrade</Button>}
              </div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </>
  );
}
