import { GoogleGenAI } from "@google/genai";
import { objectivePresets } from "@/data/objectives";
import { profiles } from "@/data/profiles";
import { readableDimension } from "@/lib/imte";
import { rankTerritories } from "@/lib/ranking";
import { ChatRequest, ChatResponse, RankedTerritory, TerritoryRecord } from "@/lib/types";

const DEFAULT_MODEL = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";

interface GeminiChatDraft {
  answer?: string;
  criteriaUsed?: string;
  recommendation?: string;
  mvpDisclaimer?: string;
  territorialContext?: string;
}

function buildReferencedTerritories(selected: RankedTerritory | undefined, ranked: RankedTerritory[]) {
  const referenced = [selected?.uf, ranked[0]?.uf, ranked[1]?.uf].filter(Boolean) as string[];
  return Array.from(new Set(referenced));
}

function summarizeTopDimensions(territory: RankedTerritory) {
  return Object.entries(territory.scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([key, value]) => `${readableDimension(key as keyof typeof territory.scores)}: ${value}`)
    .join(", ");
}

function buildChatContext(request: ChatRequest, territories: TerritoryRecord[]) {
  const ranked = rankTerritories(territories, request.objective, request.profile, request.weights);
  const selected = request.selectedUf
    ? ranked.find((territory) => territory.uf === request.selectedUf)
    : ranked[0];
  const objective = objectivePresets.find((item) => item.id === request.objective);
  const profile = profiles.find((item) => item.id === request.profile);
  const topThree = ranked.slice(0, 3).map((territory) => ({
    uf: territory.uf,
    state: territory.state,
    imte: territory.imte,
    classification: territory.classification,
    explanation: territory.explanation,
    topDimensions: summarizeTopDimensions(territory),
    strengths: territory.strengths,
    bottlenecks: territory.bottlenecks
  }));

  return {
    ranked,
    selected,
    objective,
    profile,
    topThree,
    referencedTerritories: buildReferencedTerritories(selected, ranked)
  };
}

function buildPrompt(request: ChatRequest, territories: TerritoryRecord[]) {
  const context = buildChatContext(request, territories);
  const selected = context.selected;

  return {
    context,
    prompt: `
Voce responde como o copiloto territorial do PID MVP.
Use somente o contexto abaixo. Nao invente dados externos, nao mencione fontes nao fornecidas e nao contradiga o dataset.

Pergunta do usuario:
${request.message}

Contexto de perfil:
- Perfil: ${context.profile?.label ?? request.profile}
- Objetivo: ${context.objective?.label ?? request.objective}
- Criterio do objetivo: ${context.objective?.criteriaSummary ?? ""}

Territorio em foco:
${selected ? JSON.stringify({
      uf: selected.uf,
      state: selected.state,
      region: selected.region,
      imte: selected.imte,
      classification: selected.classification,
      explanation: selected.explanation,
      strengths: selected.strengths,
      bottlenecks: selected.bottlenecks,
      recommendations: selected.recommendations,
      promisingSectors: selected.promisingSectors,
      scores: selected.scores,
      scoreSources: selected.scoreSources,
      metrics: selected.metrics,
      sourceMeta: selected.sourceMeta
    }, null, 2) : "Nenhum territorio selecionado"}

Contexto do mapa:
${JSON.stringify({
      mapLevel: request.mapLevel ?? "state",
      selectedMunicipalityId: request.selectedMunicipalityId ?? null,
      selectedMunicipalityName: request.selectedMunicipalityName ?? null,
      activeLayers: request.activeLayers ?? [],
      activeTheme: request.activeTheme ?? null,
      drillDownEnabled: request.drillDownEnabled ?? false
    }, null, 2)}

Top ranking atual:
${JSON.stringify(context.topThree, null, 2)}

Regras de resposta:
- Responda em portugues do Brasil.
- Seja objetivo, executivo e claro.
- Sempre devolva JSON valido, sem markdown, sem crases e sem texto fora do JSON.
- O JSON deve ter exatamente as chaves: answer, criteriaUsed, recommendation, mvpDisclaimer, territorialContext.
- mvpDisclaimer deve lembrar que a leitura usa base hibrida do MVP com ANEEL SIGA, IBGE e sinais curados temporarios.
`.trim()
  };
}

function normalizeGeminiJson(text: string): GeminiChatDraft | null {
  const trimmed = text.trim();
  const withoutFence = trimmed.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/, "");
  try {
    return JSON.parse(withoutFence) as GeminiChatDraft;
  } catch {
    return null;
  }
}

function toChatResponse(draft: GeminiChatDraft | null, referencedTerritories: string[]): ChatResponse | null {
  if (!draft?.answer || !draft.criteriaUsed || !draft.recommendation || !draft.mvpDisclaimer) {
    return null;
  }

  return {
    answer: draft.answer,
    criteriaUsed: draft.criteriaUsed,
    recommendation: draft.recommendation,
    mvpDisclaimer: draft.mvpDisclaimer,
    referencedTerritories,
    territorialContext: draft.territorialContext
  };
}

export function isGeminiConfigured() {
  return Boolean(process.env.GEMINI_API_KEY);
}

export async function generateChatWithGemini(
  request: ChatRequest,
  territories: TerritoryRecord[]
): Promise<ChatResponse | null> {
  if (!isGeminiConfigured()) {
    return null;
  }

  const { prompt, context } = buildPrompt(request, territories);
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const response = await ai.models.generateContent({
    model: DEFAULT_MODEL,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      temperature: 0.3
    }
  });

  return toChatResponse(normalizeGeminiJson(response.text ?? ""), context.referencedTerritories);
}

export const geminiInternal = {
  buildChatContext,
  buildPrompt,
  normalizeGeminiJson,
  toChatResponse
};
