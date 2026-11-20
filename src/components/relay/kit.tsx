import type { ReactNode } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { HelpCircle, Lock, ShieldOff, FileText, Mail, MessageSquare, Calendar, NotebookPen, Database, Ticket, MessagesSquare } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { Persona, Source } from "@/lib/relay/data";
import { canAccess, whoCanSee, LANDING } from "@/lib/relay/rules";
import { useRelay } from "@/lib/relay/store";

const SRC_ICON: Record<Source, typeof Mail> = { Email: Mail, Slack: MessageSquare, Teams: MessagesSquare, Doc: FileText, "Meeting notes": NotebookPen, Calendar, CRM: Database, Jira: Ticket };

export function SourceChips({ sources, className }: { sources: Source[]; className?: string }) {
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {sources.map((s) => {
        const I = SRC_ICON[s];
        return (
          <button key={s} type="button" onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-1 rounded-md border border-border bg-secondary px-1.5 py-0.5 text-xs text-muted-foreground hover:text-foreground" aria-label={`Open source: ${s}`}>
            <I className="h-3 w-3" aria-hidden /> {s}
          </button>
        );
      })}
    </div>
  );
}

export function Why({ text, label = "Why am I seeing this?" }: { text: string; label?: string }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button type="button" onClick={(e) => e.stopPropagation()} aria-label={label} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
          <HelpCircle className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Why?</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-72 text-sm">
        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        {text}
      </PopoverContent>
    </Popover>
  );
}

export function PageHeader({ title, sub, actions }: { title: string; sub?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {sub && <p className="mt-1 text-sm text-muted-foreground">{sub}</p>}
      </div>
      {actions}
    </div>
  );
}

export function Card({ children, className, title, action }: { children: ReactNode; className?: string; title?: ReactNode; action?: ReactNode }) {
  return (
    <section className={cn("rounded-xl border border-border bg-card p-5 text-card-foreground", className)}>
      {(title || action) && (
        <div className="mb-3 flex items-center justify-between gap-2">
          {title && <h2 className="text-sm font-medium text-muted-foreground">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function Stat({ label, value, hint, tone }: { label: string; value: ReactNode; hint?: string; tone?: "success" | "warning" | "danger" | "info" }) {
  const t = tone ? { success: "text-success", warning: "text-warning", danger: "text-danger", info: "text-info" }[tone] : "";
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={cn("tnum mt-1 text-2xl font-semibold", t)}>{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

const TONES = {
  success: "border-success/40 text-success bg-success/10",
  warning: "border-warning/40 text-warning bg-warning/10",
  danger: "border-danger/40 text-danger bg-danger/10",
  info: "border-info/40 text-info bg-info/10",
  muted: "border-border text-muted-foreground bg-secondary",
};
export type Tone = keyof typeof TONES;
export function Pill({ tone = "muted", children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  return <span className={cn("inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 text-xs font-medium", TONES[tone], className)}>{children}</span>;
}
export const statusTone = (s: string): Tone =>
  /overdue|blocked|fail|high|paused|incident|kill/i.test(s) ? "danger" : /soon|risk|attention|medium|pending|approval|scope/i.test(s) ? "warning" : /track|pass|allowed|approved|active|ready|low|done|sent/i.test(s) ? "success" : "info";

export function LockBadge({ text = "External: needs your approval" }: { text?: string }) {
  return <Pill tone="warning"><Lock className="h-3 w-3" aria-hidden />{text}</Pill>;
}

export function ConnectorBadge({ letter, name }: { letter: string; name?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs">
      <span className="grid h-6 w-6 place-items-center rounded-md border border-border bg-secondary text-[10px] font-semibold">{letter}</span>
      {name && <span>{name}</span>}
    </span>
  );
}

export function Empty({ title, body, action }: { title: string; body?: string; action?: ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-border p-8 text-center">
      <p className="font-medium">{title}</p>
      {body && <p className="mt-1 text-sm text-muted-foreground">{body}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function Redacted({ label = "How it works for users" }: { label?: string }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-card p-5" aria-label={`${label}: illustration with no readable content`}>
      <div className="pointer-events-none select-none space-y-2 blur-sm" aria-hidden>
        <div className="h-4 w-2/3 rounded bg-muted-foreground/30" />
        <div className="h-3 w-full rounded bg-muted-foreground/20" />
        <div className="h-3 w-5/6 rounded bg-muted-foreground/20" />
        <div className="flex gap-2 pt-2"><div className="h-6 w-20 rounded bg-primary/40" /><div className="h-6 w-16 rounded bg-muted-foreground/20" /></div>
      </div>
      <div className="absolute inset-0 grid place-items-center">
        <div className="flex flex-col items-center gap-1 px-3 text-center"><Pill tone="info"><ShieldOff className="h-3 w-3" /> {label}</Pill><span className="text-xs text-muted-foreground">[content not visible to admins]</span></div>
      </div>
    </div>
  );
}

export function Guard({ children }: { children: ReactNode }) {
  const persona = useRelay((s) => s.persona);
  const { pathname } = useLocation();
  if (!canAccess(persona, pathname)) return <NotAvailable persona={persona} path={pathname} />;
  return <div className="relay-fade">{children}</div>;
}

function NotAvailable({ persona, path }: { persona: Persona; path: string }) {
  return (
    <div className="mx-auto mt-16 max-w-md text-center">
      <ShieldOff className="mx-auto h-8 w-8 text-muted-foreground" />
      <h1 className="mt-4 text-xl font-semibold">Not available in this role</h1>
      <p className="mt-2 text-sm text-muted-foreground">{whoCanSee(path)}. Relay keeps each role to the least access it needs.</p>
      <Link to={LANDING[persona]} className="mt-6 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Back to your home</Link>
    </div>
  );
}

export const chartTheme = {
  grid: "var(--border)",
  axis: "var(--muted-foreground)",
  tooltip: { background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--popover-foreground)", fontSize: 12 },
};
