import { objectivePresets } from "@/data/objectives";
import { profiles } from "@/data/profiles";
import { readableDimension } from "@/lib/imte";
import { rankTerritories } from "@/lib/ranking";
import { ChatRequest, ChatResponse, RankedTerritory, TerritoryRecord } from "@/lib/types";

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function messageMatchesTerritory(message: string, territory: TerritoryRecord) {
  const normalizedMessage = normalizeText(message);
  const statePattern = new RegExp(`\\b${escapeRegExp(normalizeText(territory.state))}\\b`);
  const ufPattern = new RegExp(`\\b${escapeRegExp(normalizeText(territory.uf))}\\b`);
  return statePattern.test(normalizedMessage) || ufPattern.test(normalizedMessage);
}

function territoryByMessage(message: string, territories: TerritoryRecord[]) {
  return territories.find((territory) => messageMatchesTerritory(message, territory));
}

function topTwoSummary(ranked: RankedTerritory[]) {
  const [first, second] = ranked;
  return `${first.state} e ${second.state} aparecem como os territorios mais promissores neste recorte.`;
}

function summarizeMethodology(territory: RankedTerritory) {
  if (!territory.scoreSources) {
    return "Usei os scores territoriais atuais do MVP.";
  }

  const prioritizedDimensions = Object.entries(territory.scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([key]) => {
      const source = territory.scoreSources?.[key as keyof typeof territory.scoreSources];
      return `${readableDimension(key as keyof typeof territory.scores)} (${source?.mode ?? "derivado"})`;
    });

  return `Usei principalmente ${prioritizedDimensions.join(" e ")} na leitura atual.`;
}

function buildTerritorialContext(request: ChatRequest, territory?: RankedTerritory) {
  const scope =
    request.mapLevel === "municipal" && request.selectedMunicipalityName
      ? `${request.selectedMunicipalityName} (${request.selectedUf}) em nivel municipal demonstrativo`
      : territory
        ? `${territory.state} (${territory.uf}) em nivel ${request.mapLevel ?? "state"}`
        : `nivel ${request.mapLevel ?? "national"}`;
  const activeLayers = request.activeLayers?.length ? request.activeLayers.join(", ") : "camadas padrao";
  return `${scope}; camadas ativas: ${activeLayers}; drill-down ${request.drillDownEnabled ? "ativo" : "inativo"}.`;
}

export function answerChat(request: ChatRequest, territories: TerritoryRecord[]): ChatResponse {
  const ranked = rankTerritories(territories, request.objective, request.profile, request.weights);
  const selected = request.selectedUf
    ? ranked.find((territory) => territory.uf === request.selectedUf)
    : territoryByMessage(request.message, territories)
      ? ranked.find((territory) => territory.uf === territoryByMessage(request.message, territories)?.uf)
      : ranked[0];
  const profile = profiles.find((item) => item.id === request.profile);
  const objective = objectivePresets.find((item) => item.id === request.objective);
  const normalized = normalizeText(request.message);

  if (normalized.includes("camada") || normalized.includes("camadas")) {
    const objectiveId = normalized.includes("biometano") ? "biometano" : request.objective;
    const answerByObjective = {
      "hidrogenio-verde": "Para hidrogenio verde, ligue IMTE, energia solar, energia eolica, portos, industrias e hubs de descarbonizacao.",
      saf: "Para SAF, ligue IMTE, biomassa, industrias, portos e hubs de descarbonizacao.",
      biometano: "Para biometano, ligue IMTE, biomassa, industrias e logistica associada a portos quando quiser comparar escoamento.",
      "industria-baixo-carbono":
        "Para industria de baixo carbono, ligue IMTE, industrias, energia solar, energia eolica e hubs de descarbonizacao.",
      "politica-publica": "Para politica publica, ligue IMTE, biomassa, industrias, portos e hubs para leitura territorial mais ampla."
    } as const;

    return {
      answer: answerByObjective[objectiveId],
      criteriaUsed: `Usei o objetivo ${objectivePresets.find((item) => item.id === objectiveId)?.label.toLowerCase()} e as camadas disponiveis neste MVP.`,
      recommendation: "Comece por IMTE e adicione camadas produtivas e logisticas para explicar o territorio sem poluir a demonstracao.",
      referencedTerritories: selected ? [selected.uf] : [],
      territorialContext: buildTerritorialContext(request, selected)
    };
  }

  if (normalized.includes("gargalo")) {
    const target = selected ?? ranked[0];
    return {
      answer: `Os principais gargalos de ${target.state} neste MVP sao: ${target.bottlenecks.join(" e ")}.`,
      criteriaUsed: `Usei o territorio em foco, o objetivo ${objective?.label.toLowerCase()} e a leitura hibrida de gargalos derivada do dataset local. ${summarizeMethodology(target)}`,
      recommendation: `Use ${target.state} quando quiser mostrar maturidade com restricoes concretas e nao apenas potencial bruto.`,
      referencedTerritories: [target.uf],
      territorialContext: buildTerritorialContext(request, target)
    };
  }

  if (normalized.includes("por que")) {
    const target = selected ?? ranked[0];
    return {
      answer: `${target.state} aparece bem posicionado porque combina ${target.strengths.slice(0, 2).join(" e ")}.`,
      criteriaUsed: `Usei os scores de IMTE, as forcas do territorio, os criterios de ${objective?.label.toLowerCase()} e a composicao metodologica atual. ${summarizeMethodology(target)}`,
      recommendation: `Ao apresentar ${target.state}, conecte a leitura de score com infraestrutura, recursos renovaveis e setores promissores.`,
      referencedTerritories: [target.uf],
      territorialContext: buildTerritorialContext(request, target)
    };
  }

  if (normalized.includes("compare") || normalized.includes("compar")) {
    const mentions = ranked.filter(
      (territory) => messageMatchesTerritory(request.message, territory)
    );
    const comparison = mentions.slice(0, 2);
    if (comparison.length === 2) {
      const [left, right] = comparison;
      return {
        answer: `${left.state} supera ${right.state} no recorte atual por combinar IMTE ${left.imte} com melhor aderencia aos criterios de ${objective?.label.toLowerCase()}.`,
        criteriaUsed: `Criterei ${objective?.criteriaSummary.toLowerCase()} com linguagem orientada a ${profile?.label.toLowerCase()}. ${summarizeMethodology(left)}`,
        recommendation: `Priorize ${left.state} se a tese exigir velocidade e mantenha ${right.state} como alternativa complementar.`,
        referencedTerritories: [left.uf, right.uf],
        territorialContext: buildTerritorialContext(request, left)
      };
    }
  }

  if (normalized.includes("saf")) {
    const safRanking = rankTerritories(territories, "saf", request.profile, request.weights);
    const [first, second] = safRanking;
    return {
      answer: `${first.state} lidera para SAF, seguido por ${second.state}, porque o recorte valoriza biomassa, integracao industrial e logistica.`,
      criteriaUsed: `Usei ${objectivePresets.find((item) => item.id === "saf")?.criteriaSummary.toLowerCase()} com base hibrida ANEEL + IBGE e sinais curados temporarios.`,
      recommendation: `Vale explorar ${first.state} para escala industrial e ${second.state} como polo complementar.`,
      referencedTerritories: [first.uf, second.uf],
      territorialContext: buildTerritorialContext(request, first)
    };
  }

  if (selected) {
    const topTwo = topTwoSummary(ranked);
    const territoryName = request.mapLevel === "municipal" && request.selectedMunicipalityName ? request.selectedMunicipalityName : selected.state;
    return {
      answer:
        request.mapLevel === "municipal" && request.selectedMunicipalityName
          ? `${territoryName} esta em leitura municipal demonstrativa dentro de ${selected.state}. ${topTwo}`
          : `${selected.state} tem IMTE ${selected.imte} e classificacao ${selected.classification.toLowerCase()}. ${topTwo}`,
      criteriaUsed: `Usei ${objective?.criteriaSummary.toLowerCase()} com o perfil ${profile?.label.toLowerCase()} e os scores territoriais do MVP. ${summarizeMethodology(selected)}`,
      recommendation:
        request.mapLevel === "municipal" && request.selectedMunicipalityName
          ? `Use o municipio como gatilho exploratorio e confirme a oportunidade com dados locais antes de decidir.`
          : `${selected.recommendations[0]}. Para este perfil, o principal sinal e ${selected.promisingSectors[0].toLowerCase()}.`,
      referencedTerritories: [selected.uf, ranked[0].uf, ranked[1].uf],
      territorialContext: buildTerritorialContext(request, selected)
    };
  }

  const [first, second] = ranked;
  return {
    answer: `${first.state} lidera o ranking atual, com ${second.state} logo atras.`,
    criteriaUsed: `Usei ${objective?.criteriaSummary.toLowerCase()} e o perfil ${profile?.label.toLowerCase()}.`,
    recommendation: `Comece a demonstracao por ${first.state} e use ${second.state} para contraste de decisao.`,
    referencedTerritories: [first.uf, second.uf],
    territorialContext: buildTerritorialContext(request, first)
  };
}
