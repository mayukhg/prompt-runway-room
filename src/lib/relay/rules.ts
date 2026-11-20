import type { Persona, TrustClass } from "./data";

export const ACCESS: Record<string, Persona[]> = {
  "/": ["priya"], "/brief": ["priya"], "/meetings": ["priya"], "/inbox": ["priya"], "/commitments": ["priya"],
  "/approvals": ["priya"], "/memory": ["priya"], "/settings": ["priya"], "/activity": ["priya"], "/onboarding": ["priya"],
  "/value": ["daniel"], "/adoption": ["daniel"], "/roi": ["daniel"], "/pilot": ["daniel"], "/security-summary": ["daniel"],
  "/security": ["mei"], "/agents": ["mei"], "/connectors": ["mei"], "/policies": ["mei"], "/audit": ["mei"],
  "/evals": ["mei"], "/residency": ["mei"], "/adoption-summary": ["mei"],
};

export const LANDING: Record<Persona, "/" | "/value" | "/security"> = { priya: "/", daniel: "/value", mei: "/security" };

export function canAccess(persona: Persona, path: string): boolean {
  const base = path === "/" ? "/" : "/" + path.split("/")[1];
  return (ACCESS[base] ?? []).includes(persona);
}

export function whoCanSee(path: string): string {
  const base = path === "/" ? "/" : "/" + path.split("/")[1];
  const p = ACCESS[base]?.[0];
  return p === "priya" ? "Visible to the user only" : p === "daniel" ? "Visible to the CIO only" : "Visible to the CISO only";
}

/** Eligible to move up: eval pass >= 90%, 4-week acceptance >= 80%, and below the admin cap. */
export function isEligible(c: TrustClass): boolean {
  return c.evalPass >= 90 && c.accept >= 80 && c.level < c.max;
}

/** Users may always step down; never below L0. */
export function stepDown(c: TrustClass): TrustClass {
  return { ...c, level: Math.max(0, c.level - 1) };
}

/** Admin approval raises a level by one, never past the admin cap. */
export function approveUpgrade(c: TrustClass): TrustClass {
  return { ...c, level: Math.min(c.max, c.level + 1), pending: false };
}
