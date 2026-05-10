"use client";

import { objectivePresets } from "@/data/objectives";
import { profiles } from "@/data/profiles";
import { ObjectiveId, ProfileId } from "@/lib/types";

interface HeaderProps {
  profile: ProfileId;
  objective: ObjectiveId;
  chatOpen: boolean;
  onProfileChange: (profile: ProfileId) => void;
  onObjectiveChange: (objective: ObjectiveId) => void;
  onToggleChat: () => void;
  onApplyPitchFlow: () => void;
}

export function Header({
  profile,
  objective,
  chatOpen,
  onProfileChange,
  onObjectiveChange,
  onToggleChat,
  onApplyPitchFlow
}: HeaderProps) {
  return (
    <header className="glass shadow-panel rounded-[30px] px-6 py-5">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-3">
          <div className="inline-flex items-center rounded-full border border-[rgba(15,118,110,0.14)] bg-[rgba(255,255,255,0.74)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--teal)]">
            PID MVP
          </div>
          <div>
            <h1 className="text-balance text-3xl font-semibold tracking-tight text-[var(--navy)]">
              Copiloto territorial para transicao energetica e descarbonizacao
            </h1>
            <p className="mt-2 max-w-4xl text-sm text-[var(--muted)]">
              Da leitura de camadas estrategicas ao apoio de decisao: mapa, IMTE, ranking, perfis e chatbot
              conectado a uma base hibrida ANEEL + IBGE com sinais curados temporarios.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded-full bg-[linear-gradient(135deg,var(--teal),#159b8f)] px-4 py-2 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(15,118,110,0.22)]"
              onClick={onApplyPitchFlow}
            >
              Pitch rapido: Investidor + Hidrogenio verde + Bahia
            </button>
            <div className="rounded-full border border-[var(--border)] bg-white/78 px-4 py-2 text-sm text-[var(--muted)]">
              Use este atalho para entrar no fluxo principal da apresentacao.
            </div>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="surface-strong rounded-2xl p-3">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
              Perfil
            </span>
            <select
              aria-label="Perfil"
              className="w-full bg-transparent text-sm font-medium outline-none"
              value={profile}
              onChange={(event) => onProfileChange(event.target.value as ProfileId)}
            >
              {profiles.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <label className="surface-strong rounded-2xl p-3">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
              Objetivo
            </span>
            <select
              aria-label="Objetivo"
              className="w-full bg-transparent text-sm font-medium outline-none"
              value={objective}
              onChange={(event) => onObjectiveChange(event.target.value as ObjectiveId)}
            >
              {objectivePresets.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            className="rounded-2xl bg-[linear-gradient(135deg,var(--navy),#1f5f73)] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-92"
            onClick={onToggleChat}
          >
            {chatOpen ? "Ocultar chatbot" : "Abrir chatbot"}
          </button>
        </div>
      </div>
    </header>
  );
}
