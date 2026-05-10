"use client";

import { ObjectivePreset, Weights } from "@/lib/types";
import { readableDimension } from "@/lib/imte";
import { formatInt } from "@/lib/display";

interface CustomIndexBuilderProps {
  objective: ObjectivePreset;
  weights: Weights;
  resetMessage: string | null;
  onUpdateWeight: (key: keyof Weights, value: number) => void;
  onResetWeights: () => void;
  compact?: boolean;
}

export function CustomIndexBuilder({
  objective,
  weights,
  resetMessage,
  onUpdateWeight,
  onResetWeights,
  compact
}: CustomIndexBuilderProps) {
  const orderedWeights = Object.entries(weights).sort((a, b) => b[1] - a[1]);
  const dominantDimension = orderedWeights[0];
  const secondDimension = orderedWeights[1];

  return (
    <section className="glass shadow-panel rounded-[28px] p-5">
      {!compact ? (
        <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-[var(--navy)]">Indice personalizavel</h2>
            <p className="text-sm text-[var(--muted)]">
              Ajuste pesos e recalcule a ordem dos territorios para {objective.label.toLowerCase()}.
            </p>
          </div>
          <button
            type="button"
            className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-medium"
            onClick={onResetWeights}
          >
            Restaurar pesos
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-[var(--muted)]">
            Ajuste pesos e recalcule a ordem dos territorios para {objective.label.toLowerCase()}.
          </p>
          <button
            type="button"
            className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-medium"
            onClick={onResetWeights}
          >
            Restaurar
          </button>
        </div>
      )}
      {resetMessage ? <p className="mt-3 text-sm text-[var(--teal)]">{resetMessage}</p> : null}
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-[24px] bg-[rgba(15,118,110,0.08)] p-4">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--teal)]">Dimensao dominante</div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm font-semibold capitalize text-[var(--navy)]">
              {readableDimension(dominantDimension[0] as keyof Weights)}
            </span>
            <span className="text-xl font-semibold text-[var(--navy)]">{formatInt(dominantDimension[1] * 100)}%</span>
          </div>
        </div>
        <div className="rounded-[24px] bg-[rgba(19,53,75,0.06)] p-4">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--navy)]">Segundo peso</div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm font-semibold capitalize text-[var(--navy)]">
              {readableDimension(secondDimension[0] as keyof Weights)}
            </span>
            <span className="text-xl font-semibold text-[var(--navy)]">{formatInt(secondDimension[1] * 100)}%</span>
          </div>
        </div>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {Object.entries(weights).map(([key, value]) => (
          <label key={key} className="surface-strong rounded-[24px] p-4">
            <div className="mb-2 flex items-center justify-between text-sm font-medium">
              <span className="capitalize">{readableDimension(key as keyof Weights)}</span>
              <span>{formatInt(value * 100)}%</span>
            </div>
            <input
              aria-label={`Peso ${readableDimension(key as keyof Weights)}`}
              type="range"
              min="0"
              max="100"
              value={Math.round(value * 100)}
              onChange={(event) => onUpdateWeight(key as keyof Weights, Number(event.target.value))}
              className="w-full accent-[var(--teal)]"
            />
          </label>
        ))}
      </div>
    </section>
  );
}
