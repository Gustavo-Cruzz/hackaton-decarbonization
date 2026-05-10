import { objectivePresets } from "@/data/objectives";
import { calculateImte, classifyImte, resolveWeights, summarizeTerritory } from "@/lib/imte";
import { ComparisonEntry, ObjectiveId, ProfileId, RankedTerritory, TerritoryRecord, Weights } from "@/lib/types";

export function rankTerritories(
  territories: TerritoryRecord[],
  objective: ObjectiveId,
  profile: ProfileId,
  customWeights?: Weights
): RankedTerritory[] {
  const weights = resolveWeights(objective, profile, customWeights);
  const objectiveLabel = objectivePresets.find((preset) => preset.id === objective)?.label ?? "Objetivo";

  return [...territories]
    .map((territory) => {
      const imte = calculateImte(territory.scores, weights);
      return {
        ...territory,
        imte,
        classification: classifyImte(imte),
        rank: 0,
        explanation: summarizeTerritory(territory, weights, objectiveLabel)
      };
    })
    .sort((a, b) => b.imte - a.imte || b.scores.energiaLimpa - a.scores.energiaLimpa || a.state.localeCompare(b.state))
    .map((territory, index) => ({ ...territory, rank: index + 1 }));
}

export function compareTerritories(
  rankedTerritories: RankedTerritory[],
  ufs: string[]
): ComparisonEntry[] {
  return rankedTerritories
    .filter((territory) => ufs.includes(territory.uf))
    .map((territory) => ({
      uf: territory.uf,
      state: territory.state,
      imte: territory.imte,
      scores: territory.scores,
      strengths: territory.strengths,
      bottlenecks: territory.bottlenecks
    }));
}
