import { averageScores, formatInt } from "@/lib/display";
import { describe, expect, it } from "vitest";

describe("display helpers", () => {
  it("formats numbers as integers for presentation", () => {
    expect(formatInt(57.407407)).toBe("57");
    expect(formatInt(14870907)).toBe("14.870.907");
  });

  it("rounds averaged scores before exposing them", () => {
    const result = averageScores([
      {
        scores: {
          energiaLimpa: 57.407407,
          infraestrutura: 61.2,
          industria: 63.5,
          logistica: 42.8,
          socioambiental: 71.9
        }
      },
      {
        scores: {
          energiaLimpa: 58.592593,
          infraestrutura: 60.8,
          industria: 64.5,
          logistica: 43.2,
          socioambiental: 70.1
        }
      }
    ]);

    expect(result).toEqual({
      energiaLimpa: 58,
      infraestrutura: 61,
      industria: 64,
      logistica: 43,
      socioambiental: 71
    });
  });
});
