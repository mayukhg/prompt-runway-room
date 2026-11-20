import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { ChevronDown, ChevronsLeft, ChevronsRight, Menu, Moon, Search, Sun, X, CircleCheck, Lock } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { DEMO_DATE, PERSONAS, type Persona } from "@/lib/relay/data";
import { NAV } from "@/lib/relay/nav";
import { LANDING } from "@/lib/relay/rules";
import { useRelay } from "@/lib/relay/store";
import { DemoPanel, TourCard } from "./demo";

const BADGE: Record<Persona, string> = {
  priya: "border-role-user/50 bg-role-user/15 text-role-user",
  daniel: "border-role-buyer/50 bg-role-buyer/15 text-role-buyer",
  mei: "border-role-security/50 bg-role-security/15 text-role-security",
};
export function RoleBadge({ p }: { p: Persona }) {
  return <span className={cn("rounded-full border px-2 py-0.5 text-[11px] font-medium", BADGE[p])}>{PERSONAS[p].badge}</span>;
}

export function useSwitchPersona() {
  const setPersona = useRelay((s) => s.setPersona);
  const navigate = useNavigate();
  return (p: Persona) => {
    setPersona(p);
    navigate({ to: LANDING[p] });
  };
}

function SideNav({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) {
  const persona = useRelay((s) => s.persona);
  const { pathname } = useLocation();
  return (
    <nav aria-label="Main" className="flex flex-col gap-0.5 p-2">
      {NAV[persona].map((n) => {
        const active = n.to === "/" ? pathname === "/" : pathname.startsWith(n.to);
        return (
          <Link key={n.to} to={n.to} onClick={onNavigate} title={collapsed ? n.label : undefined}
            className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground", active && "bg-sidebar-accent font-medium text-sidebar-foreground")}>
            <n.icon className={cn("h-4 w-4 shrink-0", active && "text-primary")} aria-hidden />
            {!collapsed && <span className="flex-1 truncate">{n.label}</span>}
            {!collapsed && n.readOnly && <Lock className="h-3 w-3 text-muted-foreground" aria-label="Read-only" />}
          </Link>
        );
      })}
    </nav>
  );
}

function Logo({ collapsed }: { collapsed?: boolean }) {
  return (
    <div className="flex items-center gap-2 px-4 py-4">
      <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">R</span>
      {!collapsed && <div className="leading-tight"><p className="font-semibold">Relay</p><p className="text-[11px] text-muted-foreground">Northwind Cloud</p></div>}
    </div>
  );
}

function PersonaSwitcher() {
  const persona = useRelay((s) => s.persona);
  const sw = useSwitchPersona();
  const p = PERSONAS[persona];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-lg border border-border px-2 py-1.5 hover:bg-accent" aria-label="Switch persona">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-secondary text-xs font-semibold">{p.initials}</span>
          <span className="hidden text-left leading-tight md:block"><span className="block text-sm font-medium">{p.name}</span><span className="block text-[11px] text-muted-foreground">{p.title}</span></span>
          <RoleBadge p={persona} />
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel>View Relay as</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {(Object.keys(PERSONAS) as Persona[]).map((k) => (
          <DropdownMenuItem key={k} onSelect={() => sw(k)} className="flex items-center gap-2 py-2">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-secondary text-xs font-semibold">{PERSONAS[k].initials}</span>
            <span className="flex-1 leading-tight"><span className="block text-sm">{PERSONAS[k].name}</span><span className="block text-[11px] text-muted-foreground">{PERSONAS[k].title}</span></span>
            <RoleBadge p={k} />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function Palette() {
  const { persona, paletteOpen, set, reset, theme } = useRelay();
  const navigate = useNavigate();
  const sw = useSwitchPersona();
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); set({ paletteOpen: !useRelay.getState().paletteOpen }); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [set]);
  const close = () => set({ paletteOpen: false });
  return (
    <CommandDialog open={paletteOpen} onOpenChange={(o) => set({ paletteOpen: o })}>
      <CommandInput placeholder={`Search ${PERSONAS[persona].name.split(" ")[0]}'s pages and actions…`} />
      <CommandList>
        <CommandEmpty>Nothing in this role matches.</CommandEmpty>
        <CommandGroup heading="Go to">
          {NAV[persona].map((n) => (
            <CommandItem key={n.to} onSelect={() => { close(); navigate({ to: n.to }); }}><n.icon className="mr-2 h-4 w-4" />{n.label}</CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Actions">
          {persona === "priya" && <CommandItem onSelect={() => { close(); navigate({ to: "/meetings/$id", params: { id: "m2" } }); }}>Open Acme Corp renewal prep</CommandItem>}
          {persona === "mei" && <CommandItem onSelect={() => { close(); navigate({ to: "/audit" }); }}>Export audit trail</CommandItem>}
          {persona === "daniel" && <CommandItem onSelect={() => { close(); navigate({ to: "/roi" }); }}>Set a budget alert</CommandItem>}
          <CommandItem onSelect={() => { close(); set({ theme: theme === "dark" ? "light" : "dark" }); }}>Switch to {theme === "dark" ? "light" : "dark"} theme</CommandItem>
          <CommandItem onSelect={() => { close(); set({ demoOpen: true }); }}>Open demo panel</CommandItem>
          <CommandItem onSelect={() => { close(); reset(); }}>Reset demo</CommandItem>
        </CommandGroup>
        <CommandGroup heading="Switch persona">
          {(Object.keys(PERSONAS) as Persona[]).filter((k) => k !== persona).map((k) => (
            <CommandItem key={k} onSelect={() => sw(k)}>View as {PERSONAS[k].name} · {PERSONAS[k].badge}</CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { persona, bannerOpen, theme, set } = useRelay();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => { document.documentElement.classList.toggle("dark", theme === "dark"); }, [theme]);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className={cn("sticky top-0 hidden h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex", collapsed ? "w-16" : "w-60")}>
        <Logo collapsed={collapsed} />
        <div className="flex-1 overflow-y-auto"><SideNav collapsed={collapsed} /></div>
        <button onClick={() => setCollapsed(!collapsed)} className="m-2 flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-muted-foreground hover:bg-sidebar-accent" aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
          {collapsed ? <ChevronsRight className="h-4 w-4" /> : <><ChevronsLeft className="h-4 w-4" /> Collapse</>}
        </button>
      </aside>
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 bg-sidebar p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <Logo /><SideNav collapsed={false} onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-2 border-b border-border bg-background/95 px-3 py-2 md:px-6">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><Menu className="h-5 w-5" /></Button>
          <span className="tnum hidden rounded-full border border-border px-3 py-1 text-xs sm:inline">Today · {DEMO_DATE}</span>
          <button onClick={() => set({ paletteOpen: true })} className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground md:max-w-sm" aria-label="Open command palette">
            <Search className="h-4 w-4" /><span className="truncate">Search or jump to…</span><kbd className="ml-auto hidden rounded border border-border px-1.5 text-[10px] sm:inline">⌘K</kbd>
          </button>
          <span className="hidden items-center gap-1.5 text-xs text-muted-foreground lg:flex"><CircleCheck className="h-3.5 w-3.5 text-success" />Relay is up to date · last sync 07:30</span>
          <div className="ml-auto flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={() => set({ theme: theme === "dark" ? "light" : "dark" })} aria-label="Toggle theme">{theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}</Button>
            <PersonaSwitcher />
          </div>
        </header>
        {bannerOpen && (
          <div key={`banner-${persona}`} className="relay-fade flex items-center gap-3 border-b border-border bg-card px-4 py-2 text-sm md:px-6">
            <RoleBadge p={persona} />
            <p className="flex-1 text-muted-foreground">{PERSONAS[persona].banner}</p>
            <button onClick={() => set({ bannerOpen: false })} aria-label="Dismiss banner" className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
          </div>
        )}
        <main key={persona} className="relay-fade mx-auto w-full max-w-6xl flex-1 px-4 py-6 pb-28 md:px-8">{children}</main>
      </div>
      <Toaster theme={theme} position="bottom-left" duration={3500} />
      <Palette />
      <DemoPanel />
      <TourCard />
    </div>
  );
}
