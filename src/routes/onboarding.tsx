import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { toast } from "@/lib/relay/toast";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Guard, Card, ConnectorBadge, PageHeader } from "@/components/relay/kit";
import { CONNECTORS } from "@/lib/relay/data";
import { useRelay } from "@/lib/relay/store";
import { pageHead } from "@/lib/relay/head";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboarding")({
  head: pageHead("Get started", "Connect apps, review scopes, set an interrupt budget and see the first brief."),
  component: () => <Guard><Onboarding /></Guard>,
});

const STEPS = ["Connect apps", "Review scopes", "Interrupt budget", "First brief"];

function Onboarding() {
  const [step, setStep] = useState(0);
  const [connected, setConnected] = useState<string[]>([]);
  const { settings, set } = useRelay();
  const navigate = useNavigate();
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Set up Relay" sub="Four steps, about two minutes." />
      <ol className="mb-6 flex gap-2">{STEPS.map((s, i) => <li key={s} className={cn("flex-1 border-t-2 pt-2 text-xs", i <= step ? "border-primary text-foreground" : "border-border text-muted-foreground")}>{s}</li>)}</ol>
      <Card>
        {step === 0 && <ul className="space-y-2">{CONNECTORS.map((c) => <li key={c.id} className="flex items-center justify-between rounded-lg border border-border p-3"><ConnectorBadge letter={c.letter} name={c.name} />{connected.includes(c.id) ? <span className="flex items-center gap-1 text-sm text-success"><Check className="h-4 w-4" />Connected</span> : <Button size="sm" variant="outline" onClick={() => { setConnected([...connected, c.id]); toast.success(`${c.name} connected`); }}>Connect</Button>}</li>)}</ul>}
        {step === 1 && <div className="space-y-3 text-sm"><p>Relay can <b>read</b> mail, calendar, files and messages to brief you. It can only <b>act</b> where your company allows, and external or irreversible actions always ask you first.</p>{CONNECTORS.filter((c) => connected.includes(c.id) || connected.length === 0).map((c) => <div key={c.id}><p className="font-medium">{c.name}</p><p className="text-muted-foreground">Read: {c.read.join(", ")}</p><p className="text-muted-foreground">Write: {c.write.join(", ")}</p></div>)}</div>}
        {step === 2 && <div><p className="text-sm">How many times a day may Relay interrupt you?</p><p className="tnum mt-2 text-3xl font-semibold">{settings.budget}</p><Slider className="mt-3" min={0} max={10} step={1} value={[settings.budget]} onValueChange={([v]) => set({ settings: { ...settings, budget: v ?? 0 } })} aria-label="Interrupt budget" /></div>}
        {step === 3 && <div className="text-sm"><p className="font-medium">Your first brief is ready.</p><p className="mt-1 text-muted-foreground">3 decisions, 2 slipped commitments and 5 meetings for today.</p></div>}
        <div className="mt-6 flex justify-between"><Button variant="ghost" disabled={step === 0} onClick={() => setStep(step - 1)}>Back</Button>{step < 3 ? <Button onClick={() => setStep(step + 1)}>Continue</Button> : <Button onClick={() => navigate({ to: "/brief" })}>See my first brief</Button>}</div>
      </Card>
    </div>
  );
}
