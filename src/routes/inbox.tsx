import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, ShieldAlert, Check, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Guard, Card, PageHeader, Pill, LockBadge, Empty } from "@/components/relay/kit";
import { DRAFT_DIFF } from "@/lib/relay/data";
import { useRelay } from "@/lib/relay/store";
import { pageHead } from "@/lib/relay/head";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/inbox")({
  head: pageHead("Inbox", "Triage, drafts in Priya's voice, and what Relay learned from her edits."),
  component: () => <Guard><InboxPage /></Guard>,
});

function InboxPage() {
  const { emails, sendDraft, rejectDraft, rules, setRule } = useRelay();
  const [sel, setSel] = useState(emails.find((e) => !e.quarantined)?.id ?? emails[0]?.id ?? "");
  const [confirm, setConfirm] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const e = emails.find((x) => x.id === sel) ?? emails[0]!;
  const waiting = emails.filter((x) => x.waitingDays >= 2 && x.draftStatus !== "sent");
  const pendingDrafts = emails.filter((x) => x.draft && x.draftStatus === "pending").length;

  const send = (id: string) => {
    const em = emails.find((x) => x.id === id)!;
    if (em.external) { setConfirm(id); return; }
    sendDraft(id); toast.success("Sent", { description: `Reply to ${em.from}` });
  };

  return (
    <>
      <PageHeader title="Inbox" sub={`${emails.length} important emails triaged · ${pendingDrafts} drafts waiting for you`} />
      {waiting.length > 0 && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-warning/40 bg-warning/10 px-4 py-2 text-sm"><AlertTriangle className="h-4 w-4 text-warning" />{waiting.length} important emails have waited more than 2 days: {waiting.map((w) => w.from).join(", ")}.</div>
      )}
      <Tabs defaultValue="triage">
        <TabsList><TabsTrigger value="triage">Triage & drafts</TabsTrigger><TabsTrigger value="learning">Draft-vs-sent learning</TabsTrigger></TabsList>
        <TabsContent value="triage" className="mt-4">
          <div className="grid gap-4 lg:grid-cols-5">
            <Card className="p-2 lg:col-span-2">
              <ul>
                {emails.map((x) => (
                  <li key={x.id}>
                    <button onClick={() => setSel(x.id)} className={cn("w-full rounded-lg px-3 py-2.5 text-left hover:bg-accent", sel === x.id && "bg-accent")}>
                      <div className="flex items-center justify-between gap-2"><span className="truncate text-sm font-medium">{x.from}</span><span className="tnum text-xs text-muted-foreground">{x.received}</span></div>
                      <p className="truncate text-sm">{x.subject}</p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        <Pill tone={x.quarantined ? "danger" : x.waitingDays >= 2 ? "warning" : "muted"}>{x.reason}</Pill>
                        {x.draft && x.draftStatus === "pending" && <Pill tone="info">Draft ready</Pill>}
                        {x.draftStatus === "sent" && <Pill tone="success">Sent</Pill>}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </Card>
            <Card className="lg:col-span-3">
              {e.quarantined ? (
                <div>
                  <div className="flex items-center gap-2 text-danger"><ShieldAlert className="h-5 w-5" /><p className="font-medium">Blocked by policy: untrusted content cannot trigger actions</p></div>
                  <p className="mt-2 text-sm text-muted-foreground">This email contained an instruction to forward a contract to an outside address. Relay quarantined it and took no action. No action needed from you.</p>
                  <p className="mt-3 rounded-md border border-border bg-secondary p-3 font-mono text-xs">{e.snippet}</p>
                </div>
              ) : (
                <>
                  <p className="text-xs text-muted-foreground">From {e.from} · {e.received}</p>
                  <h2 className="text-lg font-semibold">{e.subject}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{e.snippet}</p>
                  {e.draft ? (
                    <div className="mt-4 rounded-lg border border-border p-4">
                      <div className="mb-2 flex flex-wrap items-center justify-between gap-2"><span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Relay's draft, in your voice</span>{e.external ? <LockBadge /> : <Pill tone="success">Internal: send after review</Pill>}</div>
                      <p className="whitespace-pre-line text-sm">{e.draft}</p>
                      {e.draftStatus === "pending" ? (
                        <div className="mt-4 flex flex-wrap gap-2">
                          <Button onClick={() => send(e.id)}>{e.external ? "Review and approve send" : "Send after review"}</Button>
                          <Button variant="outline" onClick={() => toast("Draft opened for editing")}>Edit</Button>
                          <Button variant="ghost" onClick={() => { rejectDraft(e.id); toast("Draft discarded. Relay will note why."); }}>Discard</Button>
                        </div>
                      ) : <p className="mt-3 text-sm text-muted-foreground">{e.draftStatus === "sent" ? "Sent. Undo is available for 30 seconds in My activity." : "Draft discarded."}</p>}
                    </div>
                  ) : <div className="mt-4"><Empty title="No draft needed" body="Relay summarised this for you. It's informational." /></div>}
                </>
              )}
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="learning" className="mt-4 space-y-4">
          <Card title="Reply to Omar Reyes · Q4 tooling budget">
            <div className="grid gap-4 md:grid-cols-2">
              <div><p className="mb-2 text-xs text-muted-foreground">Relay's draft</p><div className="space-y-1 rounded-lg border border-border p-3 text-sm">{DRAFT_DIFF.draft.map((l) => <p key={l} className={cn(!DRAFT_DIFF.sent.some((s) => s.includes(l)) && "rounded bg-danger/15 px-1 text-danger line-through decoration-danger/60")}>{l}</p>)}</div></div>
              <div><p className="mb-2 text-xs text-muted-foreground">What you sent</p><div className="space-y-1 rounded-lg border border-border p-3 text-sm">{DRAFT_DIFF.sent.map((l) => <p key={l} className="rounded bg-success/15 px-1 text-success">{l}</p>)}</div></div>
            </div>
          </Card>
          <Card title="What I learned">
            <ul className="divide-y divide-border">
              {rules.map((r) => (
                <li key={r.id} className="flex flex-wrap items-center gap-2 py-2.5">
                  {editing === r.id ? (
                    <form className="flex flex-1 gap-2" onSubmit={(ev) => { ev.preventDefault(); setRule(r.id, editText, "kept"); setEditing(null); toast("Rule updated"); }}>
                      <Input value={editText} onChange={(ev) => setEditText(ev.target.value)} aria-label="Edit rule" /><Button type="submit" size="sm">Save</Button>
                    </form>
                  ) : (
                    <>
                      <span className="flex-1 text-sm">{r.text}</span>
                      {r.status === "kept" && <Pill tone="success">Kept</Pill>}
                      <Button size="sm" variant="ghost" onClick={() => { setRule(r.id, r.text, "kept"); toast("Rule kept"); }}><Check className="mr-1 h-3.5 w-3.5" />Keep</Button>
                      <Button size="sm" variant="ghost" onClick={() => { setEditing(r.id); setEditText(r.text); }}><Pencil className="mr-1 h-3.5 w-3.5" />Edit</Button>
                      <Button size="sm" variant="ghost" onClick={() => { setRule(r.id, null); toast("Rule removed. Relay won't apply it."); }}><Trash2 className="mr-1 h-3.5 w-3.5" />Remove</Button>
                    </>
                  )}
                </li>
              ))}
            </ul>
            {rules.length === 0 && <Empty title="No learned rules" body="Relay will suggest new ones as you edit drafts." />}
          </Card>
        </TabsContent>
      </Tabs>
      <AlertDialog open={!!confirm} onOpenChange={(o) => !o && setConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Send this external email?</AlertDialogTitle><AlertDialogDescription>This goes to someone outside Northwind Cloud and can't be unsent. Policy requires your approval for every external email.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Keep as draft</AlertDialogCancel><AlertDialogAction onClick={() => { if (confirm) { sendDraft(confirm); toast.success("Approved and sent"); } setConfirm(null); }}>Approve and send</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
