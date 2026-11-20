import { describe, expect, it } from "vitest";
import { approveUpgrade, canAccess, isEligible, stepDown } from "@/lib/relay/rules";

const cls = { id: "x", name: "Send internal replies", level: 2, max: 3, evalPass: 94, accept: 88 };

describe("Relay role separation", () => {
  it("CIO cannot open the user's inbox", () => expect(canAccess("daniel", "/inbox")).toBe(false));
  it("CISO cannot open the user's memory", () => expect(canAccess("mei", "/memory")).toBe(false));
  it("user cannot open the audit trail", () => expect(canAccess("priya", "/audit")).toBe(false));
  it("user can open meeting prep detail", () => expect(canAccess("priya", "/meetings/m2")).toBe(true));
});

describe("Trust ladder", () => {
  it("is eligible when eval and acceptance meet thresholds below the cap", () => expect(isEligible(cls)).toBe(true));
  it("is not eligible at the admin cap", () => expect(isEligible({ ...cls, level: 3 })).toBe(false));
  it("is not eligible with acceptance under 80%", () => expect(isEligible({ ...cls, accept: 71 })).toBe(false));
  it("approval never exceeds the admin cap", () => expect(approveUpgrade({ ...cls, level: 3 }).level).toBe(3));
  it("step down never goes below L0", () => expect(stepDown({ ...cls, level: 0 }).level).toBe(0));
});
