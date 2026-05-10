import { territories } from "@/data/territories";
import { compareTerritories, rankTerritories } from "@/lib/ranking";
import { describe, expect, it } from "vitest";

describe("ranking and comparison", () => {
  it("ranks Bahia first for hydrogen", () => {
    const ranking = rankTerritories(territories, "hidrogenio-verde", "investidor");
    expect(ranking[0].uf).toBe("BA");
    expect(["MG", "CE", "SP"]).toContain(ranking[1].uf);
  });

  it("changes ordering when socioambiental dominates", () => {
    const ranking = rankTerritories(territories, "politica-publica", "gestor-publico", {
      energiaLimpa: 0.05,
      infraestrutura: 0.05,
      industria: 0.03,
      logistica: 0.02,
      socioambiental: 0.85
    });

    expect(["RS", "PA", "BA", "PI"]).toContain(ranking[0].uf);
  });

  it("builds a comparison set", () => {
    const ranking = rankTerritories(territories, "hidrogenio-verde", "investidor");
    const comparison = compareTerritories(ranking, ["BA", "CE", "ES"]);

    expect(comparison).toHaveLength(3);
    expect(comparison[0].state).toBe("Bahia");
  });
});
