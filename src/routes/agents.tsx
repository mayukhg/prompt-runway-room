import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Power } from "lucide-react";
import { toast } from "@/lib/relay/toast";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Guard, Card, PageHeader, Pill, ConnectorBadge } from "@/components/relay/kit";
import { LEVELS } from "@/lib/relay/data";
import { useRelay } from "@/lib/relay/store";
import { pageHead } from "@/lib/relay/head";

export const Route = createFileRoute("/agents")({
  head: pageHead("Agent inventory", "Every Relay agent with owner, team, connected apps and autonomy level. Metadata only."),
  component: () => <Guard><Agents /></Guard>,
});

function Agents() {
  const { agents, toggleAgent, tenantKilled, set } = useRelay();
  const [target, setTarget] = useState<string | "tenant" | null>(null);
  const agent = agents.find((a) => a.id === target);
  return (
    <>
      <PageHeader title="Agent inventory" sub={`${agents.length} agents · one per pilot employee · metadata only; never content.`}
        actions={<Button variant={tenantKilled ? "outline" : "destructive"} onClick={() => tenantKilled ? (set({ tenantKilled: false }), toast.success("All agents resumed")) : setTarget("tenant")}><Power className="mr-2 h-4 w-4" />{tenantKilled ? "Resume all agents" : "Tenant kill switch"}</Button>} />
      {tenantKilled && <div className="mb-4 rounded-lg border border-danger/40 bg-danger/10 px-4 py-2 text-sm text-danger">All agents are paused tenant-wide. Users see "Relay is paused by your security team".</div>}
      <Card className="p-0">
        <div className="max-h-[65vh] overflow-auto" aria-label="Scrollable list of all 42 pilot agents">
        <Table>
          <TableHeader className="sticky top-0 z-10 [&_th]:bg-card"><TableRow><TableHead>Agent</TableHead><TableHead>Owner</TableHead><TableHead>Team</TableHead><TableHead>Status</TableHead><TableHead>Apps</TableHead><TableHead>Autonomy</TableHead><TableHead>Last activity</TableHead><TableHead className="sr-only">Kill switch</TableHead></TableRow></TableHeader>
          <TableBody>
            {agents.map((a) => {
              const st = tenantKilled ? "Paused" : a.status;
              return (
                <TableRow key={a.id}>
                  <TableCell className="font-mono text-xs">{a.id}</TableCell><TableCell>{a.owner}</TableCell><TableCell>{a.team}</TableCell>
                  <TableCell><Pill tone={st === "Active" ? "success" : "danger"}>{st}</Pill></TableCell>
                  <TableCell><div className="flex gap-1">{a.apps.map((x) => <ConnectorBadge key={x} letter={x === "Salesforce" ? "SF" : x.charAt(0)} />)}</div></TableCell>
                  <TableCell className="text-xs">{LEVELS[a.level]?.split(" ")[0]} max</TableCell>
                  <TableCell className="tnum text-xs text-muted-foreground">{a.last}</TableCell>
                  <TableCell><Button size="sm" variant="ghost" disabled={tenantKilled} aria-label={`${a.status === "Active" ? "Pause" : "Resume"} ${a.id}`} onClick={() => a.status === "Active" ? setTarget(a.id) : (toggleAgent(a.id), toast.success(`${a.id} resumed`))}><Power className="h-4 w-4" /></Button></TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        </div>
      </Card>
      <AlertDialog open={!!target} onOpenChange={(o) => !o && setTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{target === "tenant" ? "Pause all 42 agents?" : `Pause ${agent?.id ?? "agent"}?`}</AlertDialogTitle>
            <AlertDialogDescription>{target === "tenant" ? "Every agent stops reading and acting immediately. Briefs, drafts and nudges stop for all 42 pilot users until you resume." : `${agent?.owner}'s agent stops reading and acting immediately. Their briefs and drafts stop until you resume.`}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => { if (target === "tenant") { set({ tenantKilled: true }); toast.error("All agents paused"); } else if (target) { toggleAgent(target); toast(`${target} paused`); } setTarget(null); }}>Pause now</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
