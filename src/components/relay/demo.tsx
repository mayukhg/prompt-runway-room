import { useNavigate } from "@tanstack/react-router";
import { Play, RotateCcw, X, Check, Compass, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useRelay, type SimEvent } from "@/lib/relay/store";
import { TOUR } from "@/lib/relay/nav";
import { PERSONAS } from "@/lib/relay/data";

const EVENTS: { id: SimEvent; time: string; label: string; desc: string }[] = [
  { id: "brief", time: "07:30", label: "Morning brief arrives", desc: "Teams-style notification" },
  { id: "prep", time: "09:50", label: "Meeting prep ready", desc: "Acme Corp renewal call" },
  { id: "drafts", time: "13:00", label: "Inbox triage", desc: "6 drafts, 2 external need approval" },
  { id: "escalation", time: "16:10", label: "Escalation", desc: "Key account crosses the interrupt threshold; one notification" },
  { id: "injection", time: "16:15", label: "Prompt-injection attempt", desc: "Email tries to forward the contract; Relay quarantines it" },
  { id: "wrapup", time: "18:30", label: "Wrap-up", desc: "Today's commitments logged with owners and dates" },
];

function useGoTour() {
  const navigate = useNavigate();
  const { setPersona, set } = useRelay();
  return (i: number | null) => {
    if (i === null || i >= TOUR.length || i < 0) { set({ tourStep: null }); return; }
    const step = TOUR[i];
    if (!step) return;
    if (useRelay.getState().persona !== step.persona) setPersona(step.persona);
    set({ tourStep: i, demoOpen: false });
    if (step.to === "/meetings/m2") navigate({ to: "/meetings/$id", params: { id: "m2" } });
    else navigate({ to: step.to });
  };
}

export function DemoPanel() {
  const { demoOpen, set, fire, fired, reset } = useRelay();
  const go = useGoTour();
  const navigate = useNavigate();
  return (
    <>
      <button onClick={() => set({ demoOpen: true })} className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium shadow-lg hover:bg-accent" aria-label="Open demo panel">
        <Play className="h-4 w-4 text-primary" /> Demo
      </button>
      <Sheet open={demoOpen} onOpenChange={(o) => set({ demoOpen: o })}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Demo simulator</SheetTitle>
            <SheetDescription>Trigger scripted events. Each one updates all three personas' views.</SheetDescription>
          </SheetHeader>
          <div className="mt-4 space-y-2 px-4">
            <Button className="w-full" onClick={() => go(0)}><Compass className="mr-2 h-4 w-4" />Start guided tour</Button>
            {EVENTS.map((e) => {
              const done = fired.includes(e.id);
              return (
                <button key={e.id} onClick={() => fire(e.id)} className="flex w-full items-start gap-3 rounded-lg border border-border p-3 text-left hover:bg-accent">
                  <span className="tnum mt-0.5 text-xs text-muted-foreground">{e.time}</span>
                  <span className="flex-1"><span className="block text-sm font-medium">{e.label}</span><span className="block text-xs text-muted-foreground">{e.desc}</span></span>
                  {done ? <Check className="h-4 w-4 text-success" aria-label="Triggered" /> : <Play className="h-4 w-4 text-muted-foreground" />}
                </button>
              );
            })}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Button variant="outline" onClick={() => { set({ demoOpen: false }); useRelay.getState().setPersona("priya"); navigate({ to: "/onboarding" }); }}><Rocket className="mr-2 h-4 w-4" />First-run setup</Button>
              <Button variant="outline" onClick={() => { reset(); navigate({ to: "/" }); }}><RotateCcw className="mr-2 h-4 w-4" />Reset demo</Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

export function TourCard() {
  const step = useRelay((s) => s.tourStep);
  const go = useGoTour();
  if (step === null) return null;
  const t = TOUR[step];
  if (!t) return null;
  return (
    <div role="dialog" aria-label="Guided tour" className="relay-fade fixed bottom-20 left-1/2 z-50 w-[min(92vw,560px)] -translate-x-1/2 rounded-xl border border-primary/50 bg-popover p-4 shadow-2xl">
      <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
        <span>Step {step + 1} of {TOUR.length} · As {PERSONAS[t.persona].name}</span>
        <button onClick={() => go(null)} aria-label="End tour"><X className="h-4 w-4" /></button>
      </div>
      <p className="text-sm">{t.caption}</p>
      <div className="mt-3 flex justify-end gap-2">
        <Button size="sm" variant="ghost" disabled={step === 0} onClick={() => go(step - 1)}>Back</Button>
        <Button size="sm" onClick={() => go(step + 1 < TOUR.length ? step + 1 : null)}>{step + 1 < TOUR.length ? "Next" : "Finish tour"}</Button>
      </div>
    </div>
  );
}
