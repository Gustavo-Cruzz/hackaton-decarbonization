"use client";

import clsx from "clsx";
import { ComparisonEntry, RankedTerritory } from "@/lib/types";
import { formatInt } from "@/lib/display";

interface ComparisonPanelProps {
  ranked: RankedTerritory[];
  comparison: ComparisonEntry[];
  compareUfs: string[];
  onToggleCompare: (uf: string) => void;
  compact?: boolean;
}

export function ComparisonPanel({ ranked, comparison, compareUfs, onToggleCompare, compact }: ComparisonPanelProps) {
  const selectedComparison = ranked.filter((territory) => compareUfs.includes(territory.uf));
  const shellClassName = compact ? "glass shadow-panel rounded-[24px] p-4" : "glass shadow-panel rounded-[28px] p-5";

  return (
    <section className={shellClassName}>
      {!compact ? (
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-[var(--navy)]">Comparacao guiada</h2>
            <p className="text-sm text-[var(--muted)]">
              Selecione ate 3 estados para comparar IMTE, dimensoes e gargalos.
            </p>
          </div>
          <div className="rounded-full bg-[rgba(19,53,75,0.08)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--navy)]">
            {compareUfs.length} territ.
          </div>
        </div>
      ) : (
        <div>
          <p className="text-sm text-[var(--muted)]">
            Selecione ate 3 estados para comparar IMTE, dimensoes e gargalos.
          </p>
        </div>
      )}
      {selectedComparison.length > 0 ? (
        <div className="mt-4 rounded-[24px] bg-[rgba(19,53,75,0.06)] p-4">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Territorios escolhidos</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {selectedComparison.map((territory) => (
              <span
                key={territory.uf}
                className="rounded-full bg-[var(--navy)] px-3 py-2 text-sm font-semibold text-white"
              >
                {territory.state}
              </span>
            ))}
          </div>
        </div>
      ) : null}
      <div className="mt-3 flex max-h-[148px] flex-wrap gap-2 overflow-y-auto pr-1">
        {ranked.map((territory) => (
          <button
            key={territory.uf}
            type="button"
            className={clsx(
              "rounded-full border px-3 py-2 text-sm transition",
              compareUfs.includes(territory.uf)
                ? "border-transparent bg-[var(--navy)] text-white"
                : "border-[var(--border)] bg-white text-[var(--foreground)]"
            )}
            onClick={() => onToggleCompare(territory.uf)}
          >
            {territory.state}
          </button>
        ))}
      </div>
      <div className="mt-3 space-y-3">
        {comparison.length < 2 ? (
          <div className="surface-strong rounded-[24px] p-4 text-sm text-[var(--muted)]">
            Selecione pelo menos 2 territorios para comparar gargalos e sinais de decisao.
          </div>
        ) : null}
        {comparison.map((territory) => (
          <div key={territory.uf} className="surface-strong rounded-[24px] p-4">
              <div className="flex items-center justify-between">
                <div className="text-lg font-semibold text-[var(--navy)]">{territory.state}</div>
              <div className="rounded-full bg-[rgba(15,118,110,0.1)] px-3 py-1 text-sm font-semibold text-[var(--navy)]">IMTE {formatInt(territory.imte)}</div>
              </div>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Pontos fortes</div>
                <p className="mt-1 text-sm text-[var(--muted)]">{territory.strengths.join(" • ")}</p>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Gargalos</div>
                <p className="mt-1 text-sm text-[var(--muted)]">{territory.bottlenecks.join(" • ")}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
