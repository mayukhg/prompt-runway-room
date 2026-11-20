import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { toast } from "@/lib/relay/toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Guard, Card, PageHeader, Pill } from "@/components/relay/kit";
import { LEVELS, POLICY_PACKS, TRUST } from "@/lib/relay/data";
import { useRelay } from "@/lib/relay/store";
import { pageHead } from "@/lib/relay/head";

export const Route = createFileRoute("/policies")({
  head: pageHead("Policy packs", "Role-based policy packs and the maximum autonomy users can opt into per action class."),
  component: () => <Guard><Policies /></Guard>,
});

function Policies() {
  const { trust, set } = useRelay();
  const [caps, setCaps] = useState(POLICY_PACKS.map((p) => ({ ...p.caps })));
  return (
    <>
      <PageHeader title="Policy packs" sub="Caps here limit what any user can opt into on the trust ladder." />
      <div className="grid gap-4 lg:grid-cols-2">
        {POLICY_PACKS.map((p, pi) => (
          <Card key={p.id}>
            <div className="flex items-center justify-between"><p className="font-medium">{p.name}</p><Pill tone={p.members ? "success" : "muted"}>{p.members ? `${p.members} users` : "Not assigned"}</Pill></div>
            <ul className="mt-3 space-y-1.5 text-sm">{p.rules.map((r) => <li key={r} className="flex gap-2"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-success" />{r}</li>)}</ul>
            <p className="mt-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">Maximum autonomy per action class</p>
            <ul className="mt-2 space-y-2">
              {TRUST.map((t) => (
                <li key={t.id} className="flex items-center justify-between gap-2 text-sm">
                  <span>{t.name}</span>
                  <Select value={String(caps[pi]?.[t.id] ?? 0)} onValueChange={(v) => {
                    const n = Number(v); const next = caps.map((c, i) => (i === pi ? { ...c, [t.id]: n } : c)); setCaps(next);
                    if (pi === 0) set({ trust: trust.map((x) => (x.id === t.id ? { ...x, max: n, level: Math.min(x.level, n) } : x)) });
                    toast(`${p.name}: ${t.name} capped at ${LEVELS[n]}`);
                  }}>
                    <SelectTrigger className="h-8 w-48" aria-label={`Max for ${t.name}`}><SelectValue /></SelectTrigger>
                    <SelectContent>{LEVELS.map((l, i) => <SelectItem key={l} value={String(i)}>{l}</SelectItem>)}</SelectContent>
                  </Select>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </>
  );
}
