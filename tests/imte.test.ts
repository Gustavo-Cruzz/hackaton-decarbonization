import { describe, expect, it } from "vitest";
import { calculateImte, classifyImte, normalizeWeights, resolveWeights } from "@/lib/imte";

describe("IMTE helpers", () => {
  it("normalizes custom weights", () => {
    const weights = normalizeWeights({
      energiaLimpa: 35,
      infraestrutura: 25,
      industria: 20,
      logistica: 15,
      socioambiental: 5
    });

    expect(weights.energiaLimpa).toBeCloseTo(0.35, 2);
    expect(weights.socioambiental).toBeCloseTo(0.05, 2);
  });

  it("calculates weighted IMTE", () => {
    const imte = calculateImte(
      {
        energiaLimpa: 88,
        infraestrutura: 76,
        industria: 71,
        logistica: 84,
        socioambiental: 73
      },
      resolveWeights("hidrogenio-verde", "investidor")
    );

    expect(imte).toBe(81);
  });

  it("classifies score ranges", () => {
    expect(classifyImte(82)).toBe("Muito alta");
    expect(classifyImte(72)).toBe("Alta");
    expect(classifyImte(60)).toBe("Media");
    expect(classifyImte(42)).toBe("Baixa");
  });
});
