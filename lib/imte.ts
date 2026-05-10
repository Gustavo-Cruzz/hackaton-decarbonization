import { defaultWeights, objectivePresets } from "@/data/objectives";
import { profiles } from "@/data/profiles";
import { DimensionKey, ObjectiveId, ProfileId, TerritoryRecord, Weights } from "@/lib/types";

const dimensions: DimensionKey[] = [
  "energiaLimpa",
  "infraestrutura",
  "industria",
  "logistica",
  "socioambiental"
];

export function normalizeWeights(weights: Partial<Weights>): Weights {
  const safeWeights = dimensions.reduce(
    (acc, key) => {
      acc[key] = Math.max(0, weights[key] ?? 0);
      return acc;
    },
    {} as Weights
  );
  const total = dimensions.reduce((sum, key) => sum + safeWeights[key], 0);
  if (total === 0) {
    return { ...defaultWeights };
  }

  return dimensions.reduce(
    (acc, key) => {
      acc[key] = Number((safeWeights[key] / total).toFixed(4));
      return acc;
    },
    {} as Weights
  );
}

export function getObjectiveWeights(objective: ObjectiveId): Weights {
  return objectivePresets.find((preset) => preset.id === objective)?.weights ?? { ...defaultWeights };
}

export function getProfileDefaults(profileId: ProfileId): Partial<Weights> {
  return profiles.find((profile) => profile.id === profileId)?.defaultWeights ?? {};
}

export function resolveWeights(objective: ObjectiveId, profile: ProfileId, custom?: Partial<Weights>): Weights {
  const objectiveWeights = getObjectiveWeights(objective);
  const profileWeights = getProfileDefaults(profile);

  return normalizeWeights({
    ...objectiveWeights,
    ...profileWeights,
    ...custom
  });
}

export function calculateImte(scores: TerritoryRecord["scores"], weights: Weights): number {
  const value = dimensions.reduce((sum, key) => sum + scores[key] * weights[key], 0);
  return Math.round(value);
}

export function classifyImte(imte: number): string {
  if (imte >= 80) return "Muito alta";
  if (imte >= 70) return "Alta";
  if (imte >= 55) return "Media";
  return "Baixa";
}

export function summarizeTerritory(
  territory: TerritoryRecord,
  weights: Weights,
  objectiveLabel: string
): string {
  const sortedDimensions = Object.entries(territory.scores)
    .sort((a, b) => weights[b[0] as DimensionKey] * b[1] - weights[a[0] as DimensionKey] * a[1])
    .slice(0, 2)
    .map(([key]) => readableDimension(key as DimensionKey));

  return `${territory.state} ganha tracao em ${objectiveLabel.toLowerCase()} por ${sortedDimensions.join(" e ")}.`;
}

export function readableDimension(dimension: DimensionKey): string {
  const labels: Record<DimensionKey, string> = {
    energiaLimpa: "energia limpa",
    infraestrutura: "infraestrutura",
    industria: "base industrial",
    logistica: "logistica",
    socioambiental: "socioambiental"
  };

  return labels[dimension];
}
