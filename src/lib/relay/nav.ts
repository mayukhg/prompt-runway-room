import { LayoutDashboard, Sunrise, CalendarDays, Inbox, ListChecks, ShieldCheck, Brain, SlidersHorizontal, History, TrendingUp, Users, Coins, Flag, Shield, Server, Plug, ScrollText, FileSearch, FlaskConical, Globe, BarChart3, type LucideIcon } from "lucide-react";
import type { Persona } from "./data";

export type AppPath = "/" | "/brief" | "/meetings" | "/inbox" | "/commitments" | "/approvals" | "/memory" | "/settings" | "/activity"
  | "/value" | "/adoption" | "/roi" | "/pilot" | "/security-summary"
  | "/security" | "/agents" | "/connectors" | "/policies" | "/audit" | "/evals" | "/residency" | "/adoption-summary";

export interface NavItem { to: AppPath; label: string; icon: LucideIcon; readOnly?: boolean }

export const NAV: Record<Persona, NavItem[]> = {
  priya: [
    { to: "/", label: "Desk", icon: LayoutDashboard },
    { to: "/brief", label: "Brief", icon: Sunrise },
    { to: "/meetings", label: "Meetings", icon: CalendarDays },
    { to: "/inbox", label: "Inbox", icon: Inbox },
    { to: "/commitments", label: "Commitments", icon: ListChecks },
    { to: "/approvals", label: "Approvals", icon: ShieldCheck },
    { to: "/memory", label: "Memory", icon: Brain },
    { to: "/settings", label: "Settings", icon: SlidersHorizontal },
    { to: "/activity", label: "My activity", icon: History },
  ],
  daniel: [
    { to: "/value", label: "Value dashboard", icon: TrendingUp },
    { to: "/adoption", label: "Adoption", icon: Users },
    { to: "/roi", label: "ROI & cost", icon: Coins },
    { to: "/pilot", label: "Pilot readiness", icon: Flag },
    { to: "/security-summary", label: "Security summary", icon: Shield, readOnly: true },
  ],
  mei: [
    { to: "/security", label: "Security overview", icon: Shield },
    { to: "/agents", label: "Agent inventory", icon: Server },
    { to: "/connectors", label: "Connectors & scopes", icon: Plug },
    { to: "/policies", label: "Policy packs", icon: ScrollText },
    { to: "/audit", label: "Audit trail", icon: FileSearch },
    { to: "/evals", label: "Evals & red-team", icon: FlaskConical },
    { to: "/residency", label: "Data residency", icon: Globe },
    { to: "/adoption-summary", label: "Adoption summary", icon: BarChart3, readOnly: true },
  ],
};

export const TOUR: { persona: Persona; to: AppPath | "/meetings/m2"; caption: string }[] = [
  { persona: "priya", to: "/", caption: "Priya opens Relay to one most-important thing, with its reason and sources. The rest waits quietly in the queue." },
  { persona: "priya", to: "/meetings/m2", caption: "Meeting prep leads with the 3–4 things not to miss. After the meeting, Relay grades its own brief and learns." },
  { persona: "priya", to: "/inbox", caption: "Drafts in Priya's voice. External drafts are locked until she approves. The learning view shows what Relay picked up from her edits." },
  { persona: "priya", to: "/commitments", caption: "Two-way commitments. Nudges are drafted politely and sent only after approval." },
  { persona: "priya", to: "/approvals", caption: "The trust ladder: each action class earns autonomy step by step, capped by company policy." },
  { persona: "mei", to: "/security", caption: "Mei, the CISO, sees every agent, what it can reach, and what was blocked. Never employee content." },
  { persona: "mei", to: "/audit", caption: "Every action is in an immutable audit trail, including the blocked prompt-injection email. Content is redacted." },
  { persona: "mei", to: "/policies", caption: "Policy packs cap the maximum autonomy a user can opt into, per action class." },
  { persona: "daniel", to: "/value", caption: "Daniel, the CIO, sees value in aggregate: accepted delegations per weekly active user is the north star." },
  { persona: "daniel", to: "/pilot", caption: "Pilot exit gates make the expansion decision clear." },
];
