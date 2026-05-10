"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { objectivePresets } from "@/data/objectives";
import { profiles } from "@/data/profiles";
import { territories } from "@/data/territories";
import { ChatbotPanel } from "@/components/ChatbotPanel";
import { ComparisonPanel } from "@/components/ComparisonPanel";
import { CustomIndexBuilder } from "@/components/CustomIndexBuilder";
import { DataDisclaimer } from "@/components/DataDisclaimer";
import { Header } from "@/components/Header";
import { MapView } from "@/components/MapView";
import { PowerBiPanel } from "@/components/PowerBiPanel";
import { ProfileInsights } from "@/components/ProfileInsights";
import { ProfileOnboarding } from "@/components/ProfileOnboarding";
import { RankingPanel } from "@/components/RankingPanel";
import { TerritoryPanel } from "@/components/TerritoryPanel";
import { ClientSectionBoundary } from "@/components/ClientSectionBoundary";
import { getEnabledLayerKeys, getLayerDefinition } from "@/lib/map-config";
import { averageScores } from "@/lib/display";
import {
  createDefaultDemoState,
  DEFAULT_CHAT_QUESTION,
  loadDemoState,
  nextWeightsForSlider,
  saveDemoState,
  toggleCompareUfs
} from "@/lib/demo-state";
import { resolveWeights } from "@/lib/imte";
import { buildOnboardingContextSummary, buildOnboardingProfileView, defaultObjectiveForPrimaryProfile, mapPrimaryProfileToEngineProfile } from "@/lib/onboarding";
import { compareTerritories, rankTerritories } from "@/lib/ranking";
import { applySearchParamsToState, buildTerritoryDownloadPayload, demoStateToSearchParams } from "@/lib/share-state";
import {
  ChatResponse,
  ChatUiState,
  LayerGroupKey,
  LayerKey,
  MapLevel,
  MunicipalityRecord,
  OnboardingAnswers,
  ObjectiveId,
  ProfileId,
  Weights
} from "@/lib/types";

const FLASH_MESSAGE_MS = 2400;

function isChatResponse(value: unknown): value is ChatResponse {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<ChatResponse>;
  return (
    typeof candidate.answer === "string" &&
    typeof candidate.criteriaUsed === "string" &&
    typeof candidate.recommendation === "string" &&
    Array.isArray(candidate.referencedTerritories)
  );
}

function isMunicipalityChunkResponse(value: unknown): value is {
  municipalities: MunicipalityRecord[];
  municipalityStatus: string;
} {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<{ municipalities: unknown; municipalityStatus: unknown }>;
  return Array.isArray(candidate.municipalities) && typeof candidate.municipalityStatus === "string";
}

function CollapsibleSection({
  title,
  description,
  isOpen,
  onToggle,
  children
}: {
  title: string;
  description: string;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <section className="glass rounded-[28px] p-5">
      <button
        type="button"
        className="flex w-full items-start justify-between gap-4 text-left"
        aria-expanded={isOpen}
        onClick={onToggle}
      >
        <div>
          <h2 className="text-xl font-semibold text-[var(--navy)]">{title}</h2>
          <p className="text-sm text-[var(--muted)]">{description}</p>
        </div>
        <span className="rounded-full border border-[var(--border)] bg-white/80 px-3 py-2 text-sm font-semibold text-[var(--navy)]">
          <span className={`inline-block transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"}`} aria-hidden="true">
            ⌄
          </span>
        </span>
      </button>
      {isOpen ? <div className="mt-4">{children}</div> : null}
    </section>
  );
}

export default function HomePageClient() {
  const [demoState, setDemoState] = useState(createDefaultDemoState);
  const [chatResponse, setChatResponse] = useState<ChatResponse | null>(null);
  const [chatStatus, setChatStatus] = useState<ChatUiState>("idle");
  const [chatErrorMessage, setChatErrorMessage] = useState<string | null>(null);
  const [flashMessage, setFlashMessage] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [municipalityCache, setMunicipalityCache] = useState<Record<string, MunicipalityRecord[]>>({});
  const [municipalityStatus, setMunicipalityStatus] = useState<"idle" | "loading" | "available" | "unavailable">("idle");
  const [comparisonOpen, setComparisonOpen] = useState(false);
  const [rankingOpen, setRankingOpen] = useState(false);
  const [indexOpen, setIndexOpen] = useState(false);

  useEffect(() => {
    const persisted = loadDemoState(window.localStorage);
    try {
      const merged = applySearchParamsToState(persisted, new URLSearchParams(window.location.search));
      setDemoState(merged);
    } catch (error) {
      console.error("State hydration failure", error);
      setDemoState(persisted);
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }
    saveDemoState(window.localStorage, demoState);
    const url = `${window.location.pathname}?${demoStateToSearchParams(demoState).toString()}`;
    window.history.replaceState({}, "", url);
  }, [demoState, isHydrated]);

  useEffect(() => {
    if (!isHydrated || !demoState.hasChosenProfile || demoState.selectedExperience !== "map") {
      return;
    }
    void submitChat(demoState.chatQuestion || DEFAULT_CHAT_QUESTION);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHydrated, demoState.hasChosenProfile, demoState.selectedExperience]);

  useEffect(() => {
    if (!flashMessage) {
      return;
    }
    const timeout = window.setTimeout(() => setFlashMessage(null), FLASH_MESSAGE_MS);
    return () => window.clearTimeout(timeout);
  }, [flashMessage]);

  const ranked = useMemo(
    () => rankTerritories(territories, demoState.objective, demoState.profile, demoState.weights),
    [demoState.objective, demoState.profile, demoState.weights]
  );
  const selectedState = ranked.find((territory) => territory.uf === demoState.selectedUf) ?? ranked[0];
  const municipalities = municipalityCache[demoState.selectedUf] ?? [];
  const selectedMunicipality = municipalities.find((territory) => territory.id === demoState.selectedMunicipalityId) ?? null;
  const comparison = compareTerritories(ranked, demoState.compareUfs);
  const currentEngineProfile = profiles.find((item) => item.id === demoState.profile) ?? profiles[1];
  const currentObjective = objectivePresets.find((item) => item.id === demoState.objective) ?? objectivePresets[0];
  const currentProfileView = demoState.onboardingAnswers
    ? buildOnboardingProfileView(demoState.onboardingAnswers)
    : {
        label: demoState.activeProfileLabel,
        tone: currentEngineProfile.tone,
        insightCards: currentEngineProfile.insightCards,
        suggestedQuestions: currentEngineProfile.suggestedQuestions
      };
  const comparisonAverage = averageScores(ranked.map((territory) => ({ scores: territory.scores })));
  const territorialContextLabel =
    demoState.mapLevel === "municipal" && selectedMunicipality
      ? `${selectedMunicipality.name} (${selectedMunicipality.uf}) • nivel municipal • ${getEnabledLayerKeys(demoState.enabledLayers)
          .map((key) => getLayerDefinition(key)?.label ?? key)
          .join(", ")}`
      : `${selectedState.state} (${selectedState.uf}) • nivel ${demoState.mapLevel} • ${getEnabledLayerKeys(demoState.enabledLayers)
          .map((key) => getLayerDefinition(key)?.label ?? key)
          .join(", ")}`;

  useEffect(() => {
    if (demoState.selectedExperience !== "map") {
      return;
    }

    if (demoState.mapLevel !== "municipal") {
      setMunicipalityStatus(municipalityCache[demoState.selectedUf] ? "available" : "idle");
      return;
    }

    const cached = municipalityCache[demoState.selectedUf];
    if (cached) {
      setMunicipalityStatus("available");
      if (!demoState.selectedMunicipalityId && cached[0]) {
        setDemoState((current) => ({ ...current, selectedMunicipalityId: cached[0].id }));
      }
      return;
    }

    const controller = new AbortController();
    setMunicipalityStatus("loading");

    void fetch(`/api/territories/${demoState.selectedUf}?level=municipal`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`municipality-fetch-${response.status}`);
        }
        const body = (await response.json()) as unknown;
        if (!isMunicipalityChunkResponse(body)) {
          throw new Error("invalid-municipality-response");
        }
        const nextMunicipalities = (body.municipalities ?? []) as MunicipalityRecord[];
        if (body.municipalityStatus !== "available" || nextMunicipalities.length === 0) {
          setMunicipalityStatus("unavailable");
          setDemoState((current) => ({
            ...current,
            mapLevel: "state",
            selectedMunicipalityId: undefined
          }));
          return;
        }

        setMunicipalityCache((current) => ({
          ...current,
          [demoState.selectedUf]: nextMunicipalities
        }));
        setMunicipalityStatus("available");
        setDemoState((current) => ({
          ...current,
          selectedMunicipalityId: current.selectedMunicipalityId ?? nextMunicipalities[0]?.id
        }));
      })
      .catch((error) => {
        console.error("Municipality fetch failure", error);
        setMunicipalityStatus("unavailable");
        setDemoState((current) => ({
          ...current,
          mapLevel: "state",
          selectedMunicipalityId: undefined
        }));
      });

    return () => controller.abort();
  }, [demoState.mapLevel, demoState.selectedExperience, demoState.selectedMunicipalityId, demoState.selectedUf, municipalityCache]);

  function updateDemoState(next: Partial<typeof demoState>) {
    setDemoState((current) => ({ ...current, ...next }));
  }

  function completeOnboarding(answers: OnboardingAnswers) {
    const profile = mapPrimaryProfileToEngineProfile(answers.primaryProfile);
    const objective = defaultObjectiveForPrimaryProfile(answers.primaryProfile);
    const profileView = buildOnboardingProfileView(answers);
    updateDemoState({
      hasChosenProfile: true,
      activeProfileLabel: profileView.label,
      profile,
      objective,
      weights: resolveWeights(objective, profile),
      selectedExperience: "map",
      onboardingAnswers: answers,
      chatQuestion: DEFAULT_CHAT_QUESTION
    });
  }

  function applyObjective(objective: ObjectiveId) {
    updateDemoState({
      objective,
      weights: resolveWeights(objective, demoState.profile)
    });
  }

  function applyPitchFlow() {
    const profile: ProfileId = "investidor";
    const objective: ObjectiveId = "hidrogenio-verde";
    const weights = resolveWeights(objective, profile);
    setDemoState({
      ...demoState,
      hasChosenProfile: true,
      profile,
      activeProfileLabel: "Empresarial",
      objective,
      weights,
      selectedExperience: "map",
      onboardingAnswers: demoState.onboardingAnswers,
      selectedUf: "BA",
      mapLevel: "state",
      selectedMunicipalityId: undefined,
      compareUfs: ["BA", "CE", "ES"],
      chatOpen: true,
      chatQuestion: DEFAULT_CHAT_QUESTION
    });
    void submitChat(DEFAULT_CHAT_QUESTION, {
      profile,
      objective,
      selectedUf: "BA",
      weights,
      mapLevel: "state",
      selectedMunicipalityId: undefined
    });
  }

  async function submitChat(
    question: string,
    overrides?: Partial<{
      profile: ProfileId;
      objective: ObjectiveId;
      selectedUf: string;
      weights: Weights;
      mapLevel: MapLevel;
      selectedMunicipalityId?: string;
      selectedMunicipalityName?: string;
    }>
  ) {
    setChatStatus("loading");
    setChatErrorMessage(null);
    updateDemoState({ chatQuestion: question });

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: question,
          selectedUf: overrides?.selectedUf ?? demoState.selectedUf,
          objective: overrides?.objective ?? demoState.objective,
          profile: overrides?.profile ?? demoState.profile,
          weights: overrides?.weights ?? demoState.weights,
          mapLevel: overrides?.mapLevel ?? demoState.mapLevel,
          selectedMunicipalityId: overrides?.selectedMunicipalityId ?? demoState.selectedMunicipalityId,
          selectedMunicipalityName: overrides?.selectedMunicipalityName ?? selectedMunicipality?.name,
          activeLayers: getEnabledLayerKeys(demoState.enabledLayers),
          activeTheme: demoState.activeTheme,
          drillDownEnabled: demoState.mapLevel === "municipal",
          onboardingContext: demoState.onboardingAnswers ? buildOnboardingContextSummary(demoState.onboardingAnswers) : undefined
        })
      });

      if (!response.ok) {
        console.error("Chat response status failure", response.status);
        throw new Error("chat-failed");
      }

      const data = (await response.json()) as unknown;
      if (!isChatResponse(data)) {
        console.error("Invalid chat payload", data);
        throw new Error("invalid-chat-response");
      }
      setChatResponse(data);
      setChatStatus("success");
    } catch (error) {
      console.error("Chat client failure", error);
      setChatStatus("error");
      setChatErrorMessage("Nao consegui consultar o chatbot agora. Tente novamente para continuar a demo.");
    }
  }

  function updateWeight(key: keyof Weights, value: number) {
    updateDemoState({
      weights: nextWeightsForSlider(demoState.weights, key, value)
    });
  }

  function resetWeights() {
    updateDemoState({
      weights: resolveWeights(demoState.objective, demoState.profile)
    });
    setFlashMessage("Pesos do objetivo restaurados.");
  }

  function toggleCompare(uf: string) {
    updateDemoState({
      compareUfs: toggleCompareUfs(demoState.compareUfs, uf)
    });
  }

  function toggleLayer(layer: LayerKey) {
    updateDemoState({
      enabledLayers: {
        ...demoState.enabledLayers,
        [layer]: !demoState.enabledLayers[layer]
      }
    });
  }

  function setMapLevel(level: MapLevel) {
    updateDemoState({
      mapLevel: level,
      selectedMunicipalityId: level === "municipal" ? demoState.selectedMunicipalityId : undefined
    });
  }

  async function shareView() {
    const shareUrl = `${window.location.origin}${window.location.pathname}?${demoStateToSearchParams(demoState).toString()}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setFlashMessage("URL da visao copiada.");
    } catch {
      setFlashMessage("Nao foi possivel copiar a URL.");
    }
  }

  function downloadTerritory() {
    const payload = buildTerritoryDownloadPayload(selectedState, demoState, selectedMunicipality);
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${demoState.mapLevel === "municipal" && selectedMunicipality ? selectedMunicipality.id : selectedState.uf}-territory.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setFlashMessage("JSON territorial baixado.");
  }

  function handleAskTerritoryChat() {
    const question =
      demoState.mapLevel === "municipal" && selectedMunicipality
        ? `Quais sinais e gargalos do municipio ${selectedMunicipality.name} em ${selectedMunicipality.uf}?`
        : `Quais sinais e gargalos do estado ${selectedState.state}?`;
    void submitChat(question, {
      mapLevel: demoState.mapLevel,
      selectedMunicipalityId: selectedMunicipality?.id,
      selectedMunicipalityName: selectedMunicipality?.name
    });
  }

  function handleSelectUf(selectedUf: string) {
    updateDemoState({
      selectedUf,
      mapLevel: "state",
      selectedMunicipalityId: undefined
    });
  }

  function handleSetTheme(theme: LayerGroupKey) {
    updateDemoState({ activeTheme: theme });
  }

  if (!demoState.hasChosenProfile) {
    return (
      <main className="mx-auto flex min-h-screen max-w-[1600px] flex-col gap-6 px-4 py-6 text-[15px] lg:px-6">
        <ProfileOnboarding initialAnswers={demoState.onboardingAnswers} onComplete={completeOnboarding} />
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-[1600px] flex-col gap-6 px-4 py-6 text-[15px] lg:px-6">
      <Header
        activeProfileLabel={demoState.activeProfileLabel}
        objective={demoState.objective}
        chatOpen={demoState.chatOpen}
        selectedExperience={demoState.selectedExperience}
        onObjectiveChange={applyObjective}
        onToggleChat={() => updateDemoState({ chatOpen: !demoState.chatOpen })}
        onApplyPitchFlow={applyPitchFlow}
        onSelectExperience={(selectedExperience) => updateDemoState({ selectedExperience })}
      />

      {demoState.selectedExperience === "powerbi" ? (
        <ClientSectionBoundary label="o painel Power BI">
          <PowerBiPanel />
        </ClientSectionBoundary>
      ) : (
        <>
          <ClientSectionBoundary label="a experiencia do mapa">
            <section className="grid gap-6 xl:grid-cols-[minmax(0,1.75fr)_390px]">
              <MapView
                ranked={ranked}
                municipalities={municipalities}
                municipalityStatus={municipalityStatus}
                selectedUf={selectedState.uf}
                selectedMunicipalityId={demoState.selectedMunicipalityId}
                mapLevel={demoState.mapLevel}
                activeTheme={demoState.activeTheme}
                enabledLayers={demoState.enabledLayers}
                layerOpacity={demoState.layerOpacity}
                useBasemap={demoState.useBasemap}
                onSelectUf={handleSelectUf}
                onSelectMunicipality={(selectedMunicipalityId) => updateDemoState({ selectedMunicipalityId, mapLevel: "municipal" })}
                onToggleLayer={toggleLayer}
                onSetActiveTheme={handleSetTheme}
                onSetMapLevel={setMapLevel}
                onSetLayerOpacity={(layerOpacity) => updateDemoState({ layerOpacity })}
                onToggleBasemap={() => updateDemoState({ useBasemap: !demoState.useBasemap })}
                onResetView={() => updateDemoState({ mapLevel: "national", selectedMunicipalityId: undefined })}
                onShareView={() => void shareView()}
                onDownloadTerritory={downloadTerritory}
              />
              <div className="space-y-6">
                <TerritoryPanel
                  selectedState={selectedState}
                  selectedMunicipality={selectedMunicipality}
                  comparisonAverage={comparisonAverage}
                  profile={currentEngineProfile}
                  isCompared={demoState.compareUfs.includes(selectedState.uf)}
                  onCompare={() => toggleCompare(selectedState.uf)}
                  onAskChat={handleAskTerritoryChat}
                />
                <ChatbotPanel
                  isOpen={demoState.chatOpen}
                  question={demoState.chatQuestion}
                  status={chatStatus}
                  response={chatResponse}
                  errorMessage={chatErrorMessage}
                  territorialContextLabel={territorialContextLabel}
                  onQuestionChange={(chatQuestion) => updateDemoState({ chatQuestion })}
                  onSubmit={() => void submitChat(demoState.chatQuestion)}
                />
                <ProfileInsights profile={currentProfileView} onAskSuggestedQuestion={(question) => void submitChat(question)} />
                <DataDisclaimer />
              </div>
            </section>
          </ClientSectionBoundary>

          <ClientSectionBoundary label="os paineis analiticos">
            <section className="grid gap-6 xl:grid-cols-3">
              <CollapsibleSection
                title="Comparacao guiada"
                description="Abra quando quiser comparar ate 3 estados lado a lado."
                isOpen={comparisonOpen}
                onToggle={() => setComparisonOpen((current) => !current)}
              >
                <ComparisonPanel
                  ranked={ranked}
                  comparison={comparison}
                  compareUfs={demoState.compareUfs}
                  onToggleCompare={toggleCompare}
                  compact
                />
              </CollapsibleSection>
              <CollapsibleSection
                title="Ranking territorial"
                description="Clique para abrir a fila de territórios e comparar IMTE com menos ruído."
                isOpen={rankingOpen}
                onToggle={() => setRankingOpen((current) => !current)}
              >
                <RankingPanel
                  ranked={ranked}
                  selectedUf={selectedState.uf}
                  objective={demoState.objective}
                  profile={demoState.profile}
                  onSelectUf={handleSelectUf}
                  compact
                />
              </CollapsibleSection>
              <CollapsibleSection
                title="Indice personalizavel"
                description="Abra so se quiser ajustar pesos e recalcular a leitura."
                isOpen={indexOpen}
                onToggle={() => setIndexOpen((current) => !current)}
              >
                <CustomIndexBuilder
                  objective={currentObjective}
                  weights={demoState.weights}
                  resetMessage={flashMessage}
                  onUpdateWeight={updateWeight}
                  onResetWeights={resetWeights}
                  compact
                />
              </CollapsibleSection>
            </section>
          </ClientSectionBoundary>
        </>
      )}
    </main>
  );
}
