import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Pencil, Trash2, Plus, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Guard, Card, PageHeader, Pill, SourceChips } from "@/components/relay/kit";
import { useRelay } from "@/lib/relay/store";
import { pageHead } from "@/lib/relay/head";

export const Route = createFileRoute("/memory")({
  head: pageHead("Memory", "What Relay knows about Priya's work, with sources, editable and deletable."),
  component: () => <Guard><Memory /></Guard>,
});

const GROUPS = ["Preferences", "People", "Projects", "Writing style", "Standing instructions"];

function Memory() {
  const { memory, upsertFact, deleteFact } = useRelay();
  const [editing, setEditing] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [instr, setInstr] = useState("");
  return (
    <>
      <PageHeader title="What Relay knows about your work" sub="Every fact shows where it came from. Change or delete anything." />
      <div className="mb-6 flex items-center gap-2 rounded-lg border border-info/40 bg-info/10 px-4 py-2 text-sm"><ShieldCheck className="h-4 w-4 text-info" />Your memory is yours. Your company controls what Relay can access.</div>
      <div className="grid gap-4 md:grid-cols-2">
        {GROUPS.map((g) => (
          <Card key={g} title={g} className={g === "Standing instructions" ? "md:col-span-2" : ""}>
            <ul className="space-y-3">
              {memory.filter((m) => m.group === g).map((m) => (
                <li key={m.id} className="rounded-lg border border-border p-3">
                  {editing === m.id ? (
                    <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); upsertFact({ ...m, text, origin: "Stated" }); setEditing(null); toast("Memory updated"); }}>
                      <Input value={text} onChange={(e) => setText(e.target.value)} aria-label="Edit fact" autoFocus /><Button size="sm" type="submit">Save</Button>
                    </form>
                  ) : <p className="text-sm">{m.text}</p>}
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <Pill tone={m.origin === "Stated" ? "success" : "info"}>{m.origin === "Stated" ? "You stated" : "Relay inferred"}</Pill>
                    <SourceChips sources={[m.source]} /><span>Learned {m.learned}</span>
                    <span className="ml-auto flex gap-1">
                      <Button size="icon" variant="ghost" className="h-7 w-7" aria-label="Edit" onClick={() => { setEditing(m.id); setText(m.text); }}><Pencil className="h-3.5 w-3.5" /></Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7" aria-label="Delete" onClick={() => { deleteFact(m.id); toast("Forgotten", { action: { label: "Undo", onClick: () => upsertFact(m) } }); }}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </span>
                  </div>
                </li>
              ))}
            </ul>
            {g === "Standing instructions" && (
              <form className="mt-3 flex gap-2" onSubmit={(e) => { e.preventDefault(); if (!instr.trim()) return; upsertFact({ id: `f-${Date.now()}`, group: g, text: instr.trim(), source: "Teams", learned: "Today", origin: "Stated" }); setInstr(""); toast.success("Instruction added"); }}>
                <Input value={instr} onChange={(e) => setInstr(e.target.value)} placeholder="e.g. Always loop in Sofia on roadmap emails" aria-label="New standing instruction" />
                <Button type="submit"><Plus className="mr-1 h-4 w-4" />Add</Button>
              </form>
            )}
          </Card>
        ))}
      </div>
    </>
  );
}
