import { ChatRequest, ObjectiveId, ProfileId, Weights } from "@/lib/types";

interface ErrorPayload {
  error: string;
}

export function isErrorPayload(value: unknown): value is ErrorPayload {
  return Boolean(value && typeof value === "object" && "error" in value);
}

function isObjectiveId(value: unknown): value is ObjectiveId {
  return (
    value === "hidrogenio-verde" ||
    value === "saf" ||
    value === "biometano" ||
    value === "industria-baixo-carbono" ||
    value === "politica-publica"
  );
}

function isProfileId(value: unknown): value is ProfileId {
  return value === "gestor-publico" || value === "investidor" || value === "engenheiro" || value === "pesquisador";
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isWeights(value: unknown): value is Weights {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<Weights>;
  return (
    isFiniteNumber(candidate.energiaLimpa) &&
    isFiniteNumber(candidate.infraestrutura) &&
    isFiniteNumber(candidate.industria) &&
    isFiniteNumber(candidate.logistica) &&
    isFiniteNumber(candidate.socioambiental)
  );
}

export async function readJsonBody(request: Request): Promise<unknown | ErrorPayload> {
  try {
    return await request.json();
  } catch {
    return { error: "Invalid JSON body" };
  }
}

export function validateChatRequest(value: unknown): ChatRequest | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as Partial<ChatRequest>;
  if (typeof candidate.message !== "string" || candidate.message.trim().length === 0) {
    return null;
  }
  if (!isObjectiveId(candidate.objective) || !isProfileId(candidate.profile)) {
    return null;
  }
  if (candidate.weights !== undefined && !isWeights(candidate.weights)) {
    return null;
  }

  return {
    ...candidate,
    message: candidate.message.trim(),
    objective: candidate.objective,
    profile: candidate.profile
  };
}

export function validateRankingPayload(value: unknown): { objective: ObjectiveId; profile: ProfileId; weights?: Weights } | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as Partial<{ objective: ObjectiveId; profile: ProfileId; weights?: Weights }>;
  if (!isObjectiveId(candidate.objective) || !isProfileId(candidate.profile)) {
    return null;
  }
  if (candidate.weights !== undefined && !isWeights(candidate.weights)) {
    return null;
  }

  return {
    objective: candidate.objective,
    profile: candidate.profile,
    weights: candidate.weights
  };
}

export function validateComparePayload(
  value: unknown
): { objective: ObjectiveId; profile: ProfileId; weights?: Weights; ufs: string[] } | null {
  const base = validateRankingPayload(value);
  if (!base || !value || typeof value !== "object") {
    return null;
  }

  const candidate = value as Partial<{ ufs: unknown }>;
  const ufs = Array.isArray(candidate.ufs) ? candidate.ufs.filter((item): item is string => typeof item === "string").slice(0, 3) : [];
  return {
    ...base,
    ufs
  };
}

export function normalizeUfParam(value: string | undefined) {
  if (!value) {
    return null;
  }
  const normalized = value.trim().toUpperCase();
  return /^[A-Z]{2}$/.test(normalized) ? normalized : null;
}
