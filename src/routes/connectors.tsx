import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Eye, Zap } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Guard, Card, PageHeader, ConnectorBadge, Pill } from "@/components/relay/kit";
import { CONNECTORS } from "@/lib/relay/data";
import { pageHead } from "@/lib/relay/head";

export const Route = createFileRoute("/connectors")({
  head: pageHead("Connectors & scopes", "Allow-listed read and write scopes per connector, with readers separated from actors."),
  component: () => <Guard><Connectors /></Guard>,
});

function Connectors() {
  const [req, setReq] = useState<(typeof CONNECTORS)[number] | null>(null);
  const [requested, setRequested] = useState<string[]>([]);
  return (
    <>
      <PageHeader title="Connectors & scopes" sub="Readers touch untrusted content and can never trigger actions. Actors are gated by policy and approval." />
      <div className="grid gap-4 md:grid-cols-2">
        {CONNECTORS.map((c) => (
          <Card key={c.id}>
            <div className="flex items-center justify-between"><ConnectorBadge letter={c.letter} name={c.name} />{requested.includes(c.id) ? <Pill tone="warning">Change requested</Pill> : <Button size="sm" variant="outline" onClick={() => setReq(c)}>Request change</Button>}</div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-info/30 p-3"><p className="mb-2 flex items-center gap-1 text-xs font-medium text-info"><Eye className="h-3.5 w-3.5" />Readers (untrusted input)</p><ul className="space-y-1 font-mono text-xs">{c.read.map((s) => <li key={s}>{s}</li>)}</ul></div>
              <div className="rounded-lg border border-warning/30 p-3"><p className="mb-2 flex items-center gap-1 text-xs font-medium text-warning"><Zap className="h-3.5 w-3.5" />Actors (gated)</p><ul className="space-y-1 font-mono text-xs">{c.write.map((s) => <li key={s}>{s}</li>)}</ul></div>
            </div>
          </Card>
        ))}
      </div>
      <Dialog open={!!req} onOpenChange={(o) => !o && setReq(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Request scope change · {req?.name}</DialogTitle><DialogDescription>Changes go through security review and are logged in the audit trail.</DialogDescription></DialogHeader>
          <div className="space-y-1 rounded-lg border border-border p-3 font-mono text-xs">
            {req?.read.map((s) => <p key={s} className="text-muted-foreground">  {s}</p>)}
            <p className="rounded bg-success/15 px-1 text-success">+ {req?.id === "Slack" ? "channels:read (pilot channels only)" : "Tasks.Read"}</p>
            <p className="rounded bg-danger/15 px-1 text-danger line-through">- {req?.write[0]}</p>
          </div>
          <DialogFooter><Button variant="ghost" onClick={() => setReq(null)}>Cancel</Button><Button onClick={() => { if (req) { setRequested([...requested, req.id]); toast.success("Change request submitted for review"); } setReq(null); }}>Submit for review</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
