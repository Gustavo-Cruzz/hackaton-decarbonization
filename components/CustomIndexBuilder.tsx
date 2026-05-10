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
  const shellClassName = compact ? "glass shadow-panel rounded-[24px] p-4" : "glass shadow-panel rounded-[28px] p-5";
  const metricCardClassName = compact ? "rounded-[20px] p-3.5" : "rounded-[24px] p-4";
  const sliderGridClassName = compact ? "mt-4 grid gap-3 xl:grid-cols-2" : "mt-5 grid gap-4 md:grid-cols-2";

  return (
    <section className={shellClassName}>
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
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[var(--navy)]">Indice personalizavel</h2>
            <p className="text-sm text-[var(--muted)]">
              Ajuste pesos perto do mapa e recalcule a leitura atual.
            </p>
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
            Base: {objective.label.toLowerCase()}
          </p>
        </div>
      )}
      {compact ? (
        <div className="mt-3 flex items-center justify-end">
          <button
            type="button"
            className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-medium"
            onClick={onResetWeights}
          >
            Restaurar
          </button>
        </div>
      ) : null}
      {resetMessage ? <p className="mt-3 text-sm text-[var(--teal)]">{resetMessage}</p> : null}
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className={`${metricCardClassName} bg-[rgba(15,118,110,0.08)]`}>
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--teal)]">Dimensao dominante</div>
          <div className="mt-2">
            <span className="block text-sm font-semibold capitalize text-[var(--navy)]">
              {readableDimension(dominantDimension[0] as keyof Weights)}
            </span>
            <span className="mt-1 block text-xl font-semibold text-[var(--navy)]">{formatInt(dominantDimension[1] * 100)}%</span>
          </div>
        </div>
        <div className={`${metricCardClassName} bg-[rgba(19,53,75,0.06)]`}>
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--navy)]">Segundo peso</div>
          <div className="mt-2">
            <span className="block text-sm font-semibold capitalize text-[var(--navy)]">
              {readableDimension(secondDimension[0] as keyof Weights)}
            </span>
            <span className="mt-1 block text-xl font-semibold text-[var(--navy)]">{formatInt(secondDimension[1] * 100)}%</span>
          </div>
        </div>
      </div>
      <div className={sliderGridClassName}>
        {Object.entries(weights).map(([key, value]) => (
          <label key={key} className={`surface-strong ${compact ? "rounded-[20px] p-3.5" : "rounded-[24px] p-4"}`}>
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
