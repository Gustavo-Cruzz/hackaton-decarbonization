import { Scores } from "@/lib/types";

const integerFormatter = new Intl.NumberFormat("pt-BR", {
  maximumFractionDigits: 0
});

export function formatInt(value: number) {
  return integerFormatter.format(Math.round(value));
}

export function averageScores(items: Array<{ scores: Scores }>): Scores {
  const total = items.length || 1;
  const averaged = items.reduce(
    (acc, item) => {
      acc.energiaLimpa += item.scores.energiaLimpa / total;
      acc.infraestrutura += item.scores.infraestrutura / total;
      acc.industria += item.scores.industria / total;
      acc.logistica += item.scores.logistica / total;
      acc.socioambiental += item.scores.socioambiental / total;
      return acc;
    },
    {
      energiaLimpa: 0,
      infraestrutura: 0,
      industria: 0,
      logistica: 0,
      socioambiental: 0
    }
  );

  return {
    energiaLimpa: Math.round(averaged.energiaLimpa),
    infraestrutura: Math.round(averaged.infraestrutura),
    industria: Math.round(averaged.industria),
    logistica: Math.round(averaged.logistica),
    socioambiental: Math.round(averaged.socioambiental)
  };
}
