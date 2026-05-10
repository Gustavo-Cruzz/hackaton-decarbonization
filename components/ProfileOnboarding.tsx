"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  brazilStates,
  businessAnalysisOptions,
  businessInterestOptions,
  businessSectorOptions,
  decarbonizationGoalOptions,
  defaultObjectiveForPrimaryProfile,
  governmentIndicatorOptions,
  governmentObjectiveOptions,
  governmentSphereOptions,
  governmentTrackingOptions,
  knowledgeLevelOptions,
  personalizedInsightOptions,
  preferredFormatOptions,
  primaryProfileOptions,
  researchAreaOptions,
  researchNeedOptions,
  technicalLevelOptions,
  trackingThemeOptions,
  userTypeOptions
} from "@/lib/onboarding";
import {
  BusinessOnboardingAnswers,
  GovernmentOnboardingAnswers,
  OnboardingAnswers,
  PrimaryUserProfile,
  ResearchOnboardingAnswers,
  UserClassification,
  KnowledgeLevel,
  TrackingTheme
} from "@/lib/types";

type OnboardingDraft = {
  fullName?: string;
  email?: string;
  organization?: string;
  stateOfOperation?: string;
  userType?: UserClassification;
  primaryProfile?: PrimaryUserProfile;
  governmental?: Partial<GovernmentOnboardingAnswers>;
  business?: Partial<BusinessOnboardingAnswers>;
  research?: Partial<ResearchOnboardingAnswers>;
  themes?: TrackingTheme[];
  knowledgeLevel?: KnowledgeLevel;
  wantsPersonalizedInsights?: boolean;
};

interface ProfileOnboardingProps {
  initialAnswers?: OnboardingAnswers;
  onComplete: (answers: OnboardingAnswers) => void;
}

function StepPill({ step, title, active }: { step: number; title: string; active: boolean }) {
  return (
    <div className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${active ? "bg-[var(--navy)] text-white" : "bg-[rgba(22,56,77,0.06)] text-[var(--muted)]"}`}>
      {step}. {title}
    </div>
  );
}

function FieldLabel({ children }: { children: string }) {
  return <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">{children}</div>;
}

function ChoiceButton({
  active,
  children,
  onClick
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
        active ? "border-transparent bg-[var(--navy)] text-white shadow-[0_14px_28px_rgba(22,56,77,0.18)]" : "border-[var(--border)] bg-white/90 text-[var(--foreground)]"
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function ChipSelector<T extends string>({
  options,
  values,
  onToggle,
  max
}: {
  options: ReadonlyArray<{ value: T; label: string }>;
  values: T[];
  onToggle: (value: T) => void;
  max?: number;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const active = values.includes(option.value);
        const disabled = Boolean(max && !active && values.length >= max);
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            disabled={disabled}
            className={`rounded-full border px-3 py-2 text-sm transition ${
              active ? "border-transparent bg-[var(--teal)] text-white" : "border-[var(--border)] bg-white/90 text-[var(--foreground)]"
            } ${disabled ? "cursor-not-allowed opacity-45" : ""}`}
            onClick={() => onToggle(option.value)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export function ProfileOnboarding({ initialAnswers, onComplete }: ProfileOnboardingProps) {
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<OnboardingDraft>(initialAnswers ?? {});

  const currentProfileCard = useMemo(
    () => primaryProfileOptions.find((item) => item.value === draft.primaryProfile),
    [draft.primaryProfile]
  );

  function updateDraft(next: Partial<OnboardingDraft>) {
    setDraft((current) => ({ ...current, ...next }));
  }

  function updateGovernment(next: Partial<GovernmentOnboardingAnswers>) {
    setDraft((current) => ({
      ...current,
      governmental: { ...current.governmental, ...next }
    }));
  }

  function updateBusiness(next: Partial<BusinessOnboardingAnswers>) {
    setDraft((current) => ({
      ...current,
      business: { ...current.business, ...next }
    }));
  }

  function updateResearch(next: Partial<ResearchOnboardingAnswers>) {
    setDraft((current) => ({
      ...current,
      research: { ...current.research, ...next }
    }));
  }

  function toggleFromList<T extends string>(values: T[] | undefined, value: T, max?: number) {
    const current = values ?? [];
    if (current.includes(value)) {
      return current.filter((item) => item !== value);
    }
    if (max && current.length >= max) {
      return current;
    }
    return [...current, value];
  }

  function canContinue() {
    if (step === 1) {
      return Boolean(draft.fullName?.trim() && draft.email?.trim() && draft.organization?.trim() && draft.stateOfOperation?.trim());
    }
    if (step === 2) {
      return Boolean(draft.userType && draft.primaryProfile);
    }
    if (step === 3) {
      if (draft.primaryProfile === "government") {
        return Boolean(
          draft.governmental?.sphere &&
            draft.governmental?.mainObjective &&
            draft.governmental.indicators &&
            draft.governmental.indicators.length > 0 &&
            draft.governmental.tracking &&
            draft.governmental.tracking.length > 0
        );
      }
      if (draft.primaryProfile === "business") {
        return Boolean(
          draft.business?.sector &&
            draft.business?.primaryInterest &&
            draft.business.desiredAnalyses &&
            draft.business.desiredAnalyses.length > 0 &&
            draft.business.hasDecarbonizationGoals
        );
      }
      if (draft.primaryProfile === "research") {
        return Boolean(
          draft.research?.area &&
            draft.research?.needs &&
            draft.research.needs.length > 0 &&
            draft.research?.technicalLevel &&
            draft.research?.preferredFormats &&
            draft.research.preferredFormats.length > 0
        );
      }
      return false;
    }
    return Boolean(draft.themes?.length && draft.knowledgeLevel && typeof draft.wantsPersonalizedInsights === "boolean");
  }

  function handleComplete() {
    if (!draft.primaryProfile || !draft.fullName || !draft.email || !draft.organization || !draft.stateOfOperation || !draft.userType || !draft.themes || !draft.knowledgeLevel || typeof draft.wantsPersonalizedInsights !== "boolean") {
      return;
    }

    const answers: OnboardingAnswers = {
      fullName: draft.fullName,
      email: draft.email,
      organization: draft.organization,
      stateOfOperation: draft.stateOfOperation,
      userType: draft.userType,
      primaryProfile: draft.primaryProfile,
      governmental: draft.primaryProfile === "government" ? (draft.governmental as GovernmentOnboardingAnswers) : undefined,
      business: draft.primaryProfile === "business" ? (draft.business as BusinessOnboardingAnswers) : undefined,
      research: draft.primaryProfile === "research" ? (draft.research as ResearchOnboardingAnswers) : undefined,
      themes: draft.themes,
      knowledgeLevel: draft.knowledgeLevel,
      wantsPersonalizedInsights: draft.wantsPersonalizedInsights
    };

    onComplete(answers);
  }

  return (
    <section className="glass shadow-panel rounded-[32px] p-6 md:p-8">
      <div className="max-w-4xl">
        <div className="inline-flex items-center rounded-full border border-[rgba(15,118,110,0.16)] bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--teal)]">
          Onboarding inteligente
        </div>
        <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-[var(--navy)]">Configure sua experiencia em quatro etapas</h1>
        <p className="mt-3 max-w-3xl text-base text-[var(--muted)]">
          Identificamos seu contexto de atuacao e personalizamos a plataforma para os temas, analises e perguntas mais relevantes para voce.
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <StepPill step={1} title="Identificacao" active={step === 1} />
        <StepPill step={2} title="Classificacao" active={step === 2} />
        <StepPill step={3} title="Fluxo dinamico" active={step === 3} />
        <StepPill step={4} title="Personalizacao" active={step === 4} />
      </div>

      <div className="mt-8 space-y-6">
        {step === 1 ? (
          <div className="grid gap-5 md:grid-cols-2">
            <label className="surface-strong rounded-[24px] p-4">
              <FieldLabel>Nome completo</FieldLabel>
              <input
                aria-label="Nome completo"
                className="w-full bg-transparent text-sm outline-none"
                value={draft.fullName ?? ""}
                onChange={(event) => updateDraft({ fullName: event.target.value })}
              />
            </label>
            <label className="surface-strong rounded-[24px] p-4">
              <FieldLabel>E-mail</FieldLabel>
              <input
                aria-label="E-mail"
                type="email"
                className="w-full bg-transparent text-sm outline-none"
                value={draft.email ?? ""}
                onChange={(event) => updateDraft({ email: event.target.value })}
              />
            </label>
            <label className="surface-strong rounded-[24px] p-4">
              <FieldLabel>Organizacao / Instituicao</FieldLabel>
              <input
                aria-label="Organizacao / Instituicao"
                className="w-full bg-transparent text-sm outline-none"
                value={draft.organization ?? ""}
                onChange={(event) => updateDraft({ organization: event.target.value })}
              />
            </label>
            <label className="surface-strong rounded-[24px] p-4">
              <FieldLabel>Estado de atuacao</FieldLabel>
              <input
                aria-label="Estado de atuacao"
                list="states-of-operation"
                className="w-full bg-transparent text-sm outline-none"
                value={draft.stateOfOperation ?? ""}
                onChange={(event) => updateDraft({ stateOfOperation: event.target.value })}
              />
              <datalist id="states-of-operation">
                {brazilStates.map((state) => (
                  <option key={state} value={state} />
                ))}
              </datalist>
            </label>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="grid gap-6 xl:grid-cols-[0.6fr_1.4fr]">
            <div className="surface-strong rounded-[24px] p-4">
              <FieldLabel>Voce utiliza a plataforma como</FieldLabel>
              <div className="grid gap-3">
                {userTypeOptions.map((option) => (
                  <ChoiceButton key={option.value} active={draft.userType === option.value} onClick={() => updateDraft({ userType: option.value })}>
                    {option.label}
                  </ChoiceButton>
                ))}
              </div>
            </div>
            <div>
              <FieldLabel>Qual perfil melhor representa voce</FieldLabel>
              <div className="grid gap-4 lg:grid-cols-3">
                {primaryProfileOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={draft.primaryProfile === option.value}
                    className={`rounded-[28px] border p-5 text-left transition ${
                      draft.primaryProfile === option.value
                        ? "border-transparent bg-[linear-gradient(135deg,var(--navy),#1f5f73)] text-white shadow-[0_18px_48px_rgba(22,56,77,0.18)]"
                        : "border-[rgba(22,56,77,0.08)] bg-white/92 text-[var(--foreground)]"
                    }`}
                    onClick={() => updateDraft({ primaryProfile: option.value })}
                  >
                    <div className="text-3xl">{option.icon}</div>
                    <div className="mt-3 text-xl font-semibold">{option.label}</div>
                    <p className={`mt-2 text-sm ${draft.primaryProfile === option.value ? "text-white/80" : "text-[var(--muted)]"}`}>{option.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {step === 3 && draft.primaryProfile === "government" ? (
          <div className="space-y-5">
            <div className="rounded-[24px] bg-[rgba(22,56,77,0.05)] p-4 text-sm text-[var(--foreground)]">{currentProfileCard?.description}</div>
            <div className="grid gap-5 md:grid-cols-2">
              <label className="surface-strong rounded-[24px] p-4">
                <FieldLabel>Qual esfera governamental voce representa</FieldLabel>
                <select
                  aria-label="Qual esfera governamental voce representa"
                  className="w-full bg-transparent text-sm outline-none"
                  value={draft.governmental?.sphere ?? ""}
                  onChange={(event) => updateGovernment({ sphere: event.target.value as GovernmentOnboardingAnswers["sphere"] })}
                >
                  <option value="">Selecione</option>
                  {governmentSphereOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </label>
              <label className="surface-strong rounded-[24px] p-4">
                <FieldLabel>Qual seu principal objetivo na plataforma</FieldLabel>
                <select
                  aria-label="Qual seu principal objetivo na plataforma"
                  className="w-full bg-transparent text-sm outline-none"
                  value={draft.governmental?.mainObjective ?? ""}
                  onChange={(event) => updateGovernment({ mainObjective: event.target.value as GovernmentOnboardingAnswers["mainObjective"] })}
                >
                  <option value="">Selecione</option>
                  {governmentObjectiveOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="surface-strong rounded-[24px] p-4">
              <FieldLabel>Quais indicadores deseja acompanhar (max. 3)</FieldLabel>
              <ChipSelector options={governmentIndicatorOptions} values={draft.governmental?.indicators ?? []} max={3} onToggle={(value) => updateGovernment({ indicators: toggleFromList(draft.governmental?.indicators, value, 3) as GovernmentOnboardingAnswers["indicators"] })} />
            </div>
            <div className="surface-strong rounded-[24px] p-4">
              <FieldLabel>Voce busca acompanhar</FieldLabel>
              <ChipSelector options={governmentTrackingOptions} values={draft.governmental?.tracking ?? []} onToggle={(value) => updateGovernment({ tracking: toggleFromList(draft.governmental?.tracking, value) as GovernmentOnboardingAnswers["tracking"] })} />
            </div>
          </div>
        ) : null}

        {step === 3 && draft.primaryProfile === "business" ? (
          <div className="space-y-5">
            <div className="rounded-[24px] bg-[rgba(22,56,77,0.05)] p-4 text-sm text-[var(--foreground)]">{currentProfileCard?.description}</div>
            <div className="grid gap-5 md:grid-cols-2">
              <label className="surface-strong rounded-[24px] p-4">
                <FieldLabel>Qual setor da empresa</FieldLabel>
                <select
                  aria-label="Qual setor da empresa"
                  className="w-full bg-transparent text-sm outline-none"
                  value={draft.business?.sector ?? ""}
                  onChange={(event) => updateBusiness({ sector: event.target.value as BusinessOnboardingAnswers["sector"] })}
                >
                  <option value="">Selecione</option>
                  {businessSectorOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </label>
              <label className="surface-strong rounded-[24px] p-4">
                <FieldLabel>Qual seu principal interesse</FieldLabel>
                <select
                  aria-label="Qual seu principal interesse"
                  className="w-full bg-transparent text-sm outline-none"
                  value={draft.business?.primaryInterest ?? ""}
                  onChange={(event) => updateBusiness({ primaryInterest: event.target.value as BusinessOnboardingAnswers["primaryInterest"] })}
                >
                  <option value="">Selecione</option>
                  {businessInterestOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="surface-strong rounded-[24px] p-4">
              <FieldLabel>Quais analises deseja visualizar (max. 3)</FieldLabel>
              <ChipSelector options={businessAnalysisOptions} values={draft.business?.desiredAnalyses ?? []} max={3} onToggle={(value) => updateBusiness({ desiredAnalyses: toggleFromList(draft.business?.desiredAnalyses, value, 3) as BusinessOnboardingAnswers["desiredAnalyses"] })} />
            </div>
            <div className="surface-strong rounded-[24px] p-4">
              <FieldLabel>Sua organizacao possui metas de descarbonizacao</FieldLabel>
              <div className="grid gap-3 sm:grid-cols-2">
                {decarbonizationGoalOptions.map((option) => (
                  <ChoiceButton key={option.value} active={draft.business?.hasDecarbonizationGoals === option.value} onClick={() => updateBusiness({ hasDecarbonizationGoals: option.value })}>
                    {option.label}
                  </ChoiceButton>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {step === 3 && draft.primaryProfile === "research" ? (
          <div className="space-y-5">
            <div className="rounded-[24px] bg-[rgba(22,56,77,0.05)] p-4 text-sm text-[var(--foreground)]">{currentProfileCard?.description}</div>
            <div className="grid gap-5 md:grid-cols-2">
              <label className="surface-strong rounded-[24px] p-4">
                <FieldLabel>Area principal de pesquisa</FieldLabel>
                <select
                  aria-label="Area principal de pesquisa"
                  className="w-full bg-transparent text-sm outline-none"
                  value={draft.research?.area ?? ""}
                  onChange={(event) => updateResearch({ area: event.target.value as ResearchOnboardingAnswers["area"] })}
                >
                  <option value="">Selecione</option>
                  {researchAreaOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </label>
              <div className="surface-strong rounded-[24px] p-4">
                <FieldLabel>Nivel tecnico desejado</FieldLabel>
                <div className="grid gap-3">
                  {technicalLevelOptions.map((option) => (
                    <ChoiceButton key={option.value} active={draft.research?.technicalLevel === option.value} onClick={() => updateResearch({ technicalLevel: option.value })}>
                      {option.label}
                    </ChoiceButton>
                  ))}
                </div>
              </div>
            </div>
            <div className="surface-strong rounded-[24px] p-4">
              <FieldLabel>O que voce busca na plataforma</FieldLabel>
              <ChipSelector options={researchNeedOptions} values={draft.research?.needs ?? []} onToggle={(value) => updateResearch({ needs: toggleFromList(draft.research?.needs, value) as ResearchOnboardingAnswers["needs"] })} />
            </div>
            <div className="surface-strong rounded-[24px] p-4">
              <FieldLabel>Qual formato prefere visualizar</FieldLabel>
              <ChipSelector options={preferredFormatOptions} values={draft.research?.preferredFormats ?? []} onToggle={(value) => updateResearch({ preferredFormats: toggleFromList(draft.research?.preferredFormats, value) as ResearchOnboardingAnswers["preferredFormats"] })} />
            </div>
          </div>
        ) : null}

        {step === 4 ? (
          <div className="space-y-5">
            <div className="surface-strong rounded-[24px] p-4">
              <FieldLabel>Quais temas deseja acompanhar</FieldLabel>
              <ChipSelector options={trackingThemeOptions} values={draft.themes ?? []} onToggle={(value) => updateDraft({ themes: toggleFromList(draft.themes as TrackingTheme[] | undefined, value) as TrackingTheme[] })} />
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="surface-strong rounded-[24px] p-4">
                <FieldLabel>Nivel de conhecimento em transicao energetica</FieldLabel>
                <div className="grid gap-3">
                  {knowledgeLevelOptions.map((option) => (
                    <ChoiceButton key={option.value} active={draft.knowledgeLevel === option.value} onClick={() => updateDraft({ knowledgeLevel: option.value })}>
                      {option.label}
                    </ChoiceButton>
                  ))}
                </div>
              </div>
              <div className="surface-strong rounded-[24px] p-4">
                <FieldLabel>Deseja receber insights personalizados</FieldLabel>
                <div className="grid gap-3">
                  {personalizedInsightOptions.map((option) => (
                    <ChoiceButton key={option.value} active={draft.wantsPersonalizedInsights === (option.value === "yes")} onClick={() => updateDraft({ wantsPersonalizedInsights: option.value === "yes" })}>
                      {option.label}
                    </ChoiceButton>
                  ))}
                </div>
              </div>
            </div>
            {draft.primaryProfile ? (
              <div className="rounded-[24px] bg-[linear-gradient(135deg,rgba(19,53,75,0.95),rgba(15,118,110,0.9))] p-5 text-white">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">Resultado da configuracao</div>
                <p className="mt-2 text-sm text-white/85">
                  Ao concluir, voce entra direto no app com o perfil {currentProfileCard?.label ?? ""} e objetivo inicial {defaultObjectiveForPrimaryProfile(draft.primaryProfile)}.
                </p>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          className="rounded-full border border-[var(--border)] bg-white/85 px-4 py-2 text-sm font-semibold text-[var(--navy)] disabled:cursor-not-allowed disabled:opacity-40"
          onClick={() => setStep((current) => Math.max(1, current - 1))}
          disabled={step === 1}
        >
          Voltar
        </button>
        {step < 4 ? (
          <button
            type="button"
            className="rounded-full bg-[linear-gradient(135deg,var(--teal),#159b8f)] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(15,118,110,0.22)] disabled:cursor-not-allowed disabled:opacity-45"
            disabled={!canContinue()}
            onClick={() => setStep((current) => current + 1)}
          >
            Continuar
          </button>
        ) : (
          <button
            type="button"
            className="rounded-full bg-[linear-gradient(135deg,var(--coral),var(--coral-deep))] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(242,111,99,0.24)] disabled:cursor-not-allowed disabled:opacity-45"
            disabled={!canContinue()}
            onClick={handleComplete}
          >
            Entrar na plataforma
          </button>
        )}
      </div>
    </section>
  );
}
