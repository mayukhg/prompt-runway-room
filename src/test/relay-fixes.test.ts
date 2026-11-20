import { beforeEach, describe, expect, it } from "vitest";
import { AGENTS, AUDIT } from "@/lib/relay/data";
import { useRelay } from "@/lib/relay/store";

describe("Relay demo consistency", () => {
  beforeEach(() => {
    useRelay.getState().reset();
  });

  it("contains exactly 42 uniquely identified pilot agents", () => {
    expect(AGENTS).toHaveLength(42);
    expect(new Set(AGENTS.map((agent) => agent.id)).size).toBe(42);
  });

  it("uses only inventory agent IDs in the seeded audit trail", () => {
    const inventoryIds = new Set(AGENTS.map((agent) => agent.id));
    expect(AUDIT.length).toBeGreaterThan(0);
    for (const event of AUDIT) expect(inventoryIds.has(event.agent)).toBe(true);
  });

  it("moves the autonomy mix from L2 to L3 when an upgrade is approved", () => {
    const before = useRelay.getState().autonomyMix;
    expect(before.L2).toBe(46);
    expect(before.L3).toBe(28);

    useRelay.getState().requestUpgrade("t2");
    useRelay.getState().decideUpgrade("t2", true);

    const after = useRelay.getState();
    expect(after.trust.find((trustClass) => trustClass.id === "t2")?.level).toBe(3);
    expect(after.autonomyMix.L2).toBe(40);
    expect(after.autonomyMix.L3).toBe(34);
  });
});
