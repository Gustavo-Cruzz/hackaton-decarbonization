import { territories } from "@/data/territories";
import { describe, expect, it } from "vitest";

describe("official hybrid dataset", () => {
  it("loads the processed official territory dataset", () => {
    expect(territories).toHaveLength(27);
  });

  it("includes source metadata and official geometry for Bahia", () => {
    const bahia = territories.find((territory) => territory.uf === "BA");

    expect(bahia?.sourceMeta?.aneelSnapshotDate).toBe("2026-05-01");
    expect(bahia?.sourceMeta?.ibgePopulationYear).toBe("2025");
    expect(bahia?.sourceMeta?.curatedSignalsSnapshotDate).toBe("2026-05-10");
    expect(bahia?.sourceMeta?.methodVersion).toBe("imte-hibrido-v2.1");
    expect(bahia?.geometry?.polygons.length).toBeGreaterThan(0);
    expect(bahia?.metrics?.renewableCapacityMw).toBeGreaterThan(1000);
    expect(bahia?.scoreSources?.energiaLimpa.mode).toBe("official");
    expect(bahia?.scoreSources?.infraestrutura.mode).toBe("hybrid");
    expect(bahia?.scoreSources?.logistica.mode).toBe("curated");
  });
});
