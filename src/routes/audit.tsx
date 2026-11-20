import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Download, Lock } from "lucide-react";
import { toast } from "@/lib/relay/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Guard, Card, PageHeader, Pill, statusTone } from "@/components/relay/kit";
import { useRelay } from "@/lib/relay/store";
import { pageHead } from "@/lib/relay/head";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/audit")({
  head: pageHead("Audit trail", "Immutable, filterable log of every agent action across the tenant, with content redacted."),
  component: () => <Guard><Audit /></Guard>,
});

function Audit() {
  const audit = useRelay((s) => s.audit);
  const [q, setQ] = useState("");
  const [pol, setPol] = useState("All");
  const rows = audit.filter((a) => (pol === "All" || a.policy === pol) && `${a.agent} ${a.action} ${a.target}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <PageHeader title="Audit trail" sub={`${audit.length} events · append-only · content fields redacted`} actions={<Button variant="outline" onClick={() => toast.success("Export ready", { description: `audit-2026-11-17.csv · ${rows.length} rows (simulated)` })}><Download className="mr-2 h-4 w-4" />Export</Button>} />
      <div className="mb-3 flex flex-wrap gap-2">
        <Input className="max-w-xs" placeholder="Filter by agent, action or target" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Filter audit trail" />
        {["All", "Allowed", "Approval required", "Blocked"].map((p) => <button key={p} onClick={() => setPol(p)} aria-pressed={pol === p} className={cn("rounded-full px-3 py-1 text-xs", pol === p ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground")}>{p}</button>)}
      </div>
      <Card className="p-0">
        <Table>
          <TableHeader><TableRow><TableHead>Time</TableHead><TableHead>Actor</TableHead><TableHead>Agent</TableHead><TableHead>Action</TableHead><TableHead>Target type</TableHead><TableHead>Policy</TableHead><TableHead>Approval</TableHead><TableHead>Content</TableHead></TableRow></TableHeader>
          <TableBody>
            {rows.map((a) => (
              <TableRow key={a.id} className={a.policy === "Blocked" && a.time.includes("16:15") ? "bg-danger/5" : undefined}>
                <TableCell className="tnum text-xs">{a.time}</TableCell><TableCell className="text-xs">{a.actor}</TableCell><TableCell className="font-mono text-xs">{a.agent}</TableCell>
                <TableCell className="text-sm">{a.action}</TableCell><TableCell className="text-xs">{a.target}</TableCell>
                <TableCell><Pill tone={statusTone(a.policy)}>{a.policy}</Pill></TableCell><TableCell className="text-xs">{a.approval}</TableCell>
                <TableCell className="text-xs text-muted-foreground"><span className="inline-flex items-center gap-1"><Lock className="h-3 w-3" />[content not visible to admins]</span></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {rows.length === 0 && <p className="p-6 text-center text-sm text-muted-foreground">No events match. Clear the filter to see all.</p>}
      </Card>
    </>
  );
}
