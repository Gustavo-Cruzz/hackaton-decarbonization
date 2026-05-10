"use client";

import clsx from "clsx";
import { ObjectiveId, ProfileId, RankedTerritory } from "@/lib/types";
import { objectivePresets } from "@/data/objectives";
import { profiles } from "@/data/profiles";
import { formatInt } from "@/lib/display";

function objectiveLabel(objective: ObjectiveId) {
  return objectivePresets.find((item) => item.id === objective)?.label ?? "Objetivo";
}

function profileLabel(profileId: ProfileId) {
  return profiles.find((item) => item.id === profileId)?.label ?? "Perfil";
}

interface RankingPanelProps {
  ranked: RankedTerritory[];
  selectedUf: string;
  objective: ObjectiveId;
  profile: ProfileId;
  onSelectUf: (uf: string) => void;
  compact?: boolean;
}

export function RankingPanel({ ranked, selectedUf, objective, profile, onSelectUf, compact }: RankingPanelProps) {
  return (
    <section className={compact ? "glass shadow-panel rounded-[24px] p-4" : "glass shadow-panel rounded-[28px] p-5"}>
      {!compact ? (
        <div>
          <h2 className="text-xl font-semibold text-[var(--navy)]">Ranking territorial</h2>
          <p className="text-sm text-[var(--muted)]">
            {objectiveLabel(objective)} com leitura adaptada para {profileLabel(profile).toLowerCase()}.
          </p>
        </div>
      ) : (
        <p className="text-sm text-[var(--muted)]">
          {objectiveLabel(objective)} com leitura adaptada para {profileLabel(profile).toLowerCase()}.
        </p>
      )}
      <div className="mt-3 space-y-2.5">
        {ranked.map((territory) => {
          const isTopThree = territory.rank <= 3;
          return (
            <button
              key={territory.uf}
              type="button"
              className={clsx(
                "surface-strong flex w-full items-center justify-between rounded-[24px] p-4 text-left transition",
                territory.uf === selectedUf && "ring-2 ring-[var(--teal)] bg-[rgba(19,53,75,0.04)]",
                isTopThree && "border-[rgba(15,118,110,0.25)] bg-[linear-gradient(135deg,rgba(15,118,110,0.08),rgba(255,255,255,0.95))]"
              )}
              onClick={() => onSelectUf(territory.uf)}
            >
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-[var(--navy)]">
                  <span>
                    {territory.rank}. {territory.state}
                  </span>
                  {territory.uf === selectedUf ? (
                    <span className="rounded-full bg-[rgba(19,53,75,0.08)] px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-[var(--navy)]">
                      Em foco
                    </span>
                  ) : null}
                  {isTopThree ? (
                    <span className="rounded-full bg-[rgba(15,118,110,0.12)] px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-[var(--teal)]">
                      Top 3
                    </span>
                  ) : null}
                </div>
                <div className="mt-1 max-w-[34ch] text-xs text-[var(--muted)]">{territory.explanation}</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-semibold text-[var(--navy)]">{formatInt(territory.imte)}</div>
                <div className="text-xs text-[var(--muted)]">{territory.classification}</div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
