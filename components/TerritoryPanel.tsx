"use client";

import { DataSourceKind, MunicipalityRecord, ProfileConfig, RankedTerritory, Scores, Weights } from "@/lib/types";
import { readableDimension } from "@/lib/imte";
import { formatInt } from "@/lib/display";

interface TerritoryPanelProps {
  selectedState: RankedTerritory;
  selectedMunicipality?: MunicipalityRecord | null;
  comparisonAverage: Scores;
  profile: ProfileConfig;
  isCompared: boolean;
  onCompare: () => void;
  onAskChat: () => void;
}

function averageAssetValue(values: number[]) {
  const total = values.reduce((sum, value) => sum + value, 0);
  return total === 0 ? 1 : total;
}

export function TerritoryPanel({
  selectedState,
  selectedMunicipality,
  comparisonAverage,
  profile,
  isCompared,
  onCompare,
  onAskChat
}: TerritoryPanelProps) {
  const active = selectedMunicipality ?? selectedState;
  const isMunicipal = Boolean(selectedMunicipality);
  const scores = isMunicipal ? selectedMunicipality!.scoresProxy : selectedState.scores;
  const assets = isMunicipal ? selectedMunicipality!.assetsProxy : selectedState.assets;
  const sourceModeLabel: Record<DataSourceKind, string> = {
    official: "oficial",
    derived: "derivado",
    curated: "curado",
    hybrid: "hibrido"
  };
  const strongestSignal = active.strengths[0];
  const mainConstraint = active.bottlenecks[0];
  const dominantDimension = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  const compositionEntries = [
    { label: "Solar", value: assets.solar, color: "#f59e0b" },
    { label: "Eolica", value: assets.eolica, color: "#0f766e" },
    { label: "Biomassa", value: assets.biomassa, color: "#65a30d" }
  ];
  const compositionTotal = averageAssetValue(compositionEntries.map((entry) => entry.value));

  return (
    <aside className="surface-strong rounded-[28px] p-6 shadow-panel" aria-live="polite">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Territorio selecionado</p>
          <h3 className="text-3xl font-semibold text-[var(--navy)]">{isMunicipal ? selectedMunicipality?.name : selectedState.state}</h3>
          <p className="text-sm text-[var(--muted)]">
            {isMunicipal ? `Municipio • ${selectedMunicipality?.uf} • leitura demonstrativa` : `Estado • ${selectedState.region}`}
          </p>
        </div>
        <div className="rounded-[24px] bg-[linear-gradient(135deg,var(--navy),#1f5b63)] px-5 py-4 text-right text-white shadow-[0_18px_40px_rgba(19,53,75,0.24)]">
          <div className="text-[11px] uppercase tracking-[0.18em] text-white/70">{isMunicipal ? "IMTE proxy" : "IMTE"}</div>
          <div className="text-4xl font-semibold">{formatInt(isMunicipal ? selectedMunicipality?.imteProxy ?? 0 : selectedState.imte)}</div>
          <div className="text-sm">{isMunicipal ? selectedMunicipality?.classification : selectedState.classification}</div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <button type="button" className="rounded-[20px] bg-[var(--navy)] px-4 py-3 text-sm font-semibold text-white" onClick={onCompare}>
          {isCompared ? "Remover da comparacao" : "Comparar"}
        </button>
        <button
          type="button"
          className="rounded-[20px] border border-[var(--border)] bg-white/80 px-4 py-3 text-sm font-semibold text-[var(--navy)]"
          onClick={onAskChat}
        >
          Perguntar ao chatbot
        </button>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <div className="rounded-[24px] bg-[rgba(15,118,110,0.1)] p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--teal)]">Melhor sinal</p>
          <p className="mt-2 text-sm font-medium text-[var(--foreground)]">{strongestSignal}</p>
        </div>
        <div className="rounded-[24px] bg-[rgba(217,119,6,0.1)] p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--amber)]">Restricao principal</p>
          <p className="mt-2 text-sm font-medium text-[var(--foreground)]">{mainConstraint}</p>
        </div>
      </div>

      <div className="mt-5 rounded-[24px] bg-[rgba(19,53,75,0.08)] p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--navy)]">Por que este territorio agora</p>
        <p className="mt-2 text-sm text-[var(--foreground)]">{active.explanation}</p>
        <p className="mt-1 text-xs text-[var(--muted)]">Leitura atual alinhada ao perfil {profile.label.toLowerCase()}.</p>
        {"sourceMeta" in active && active.sourceMeta ? (
          <>
            {"proxyMethod" in active.sourceMeta ? (
              <p className="mt-1 text-xs text-[var(--muted)]">{active.sourceMeta.proxyMethod}</p>
            ) : (
              <>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  Base atual: ANEEL {active.sourceMeta.aneelSnapshotDate}, IBGE populacao {active.sourceMeta.ibgePopulationYear}, PIB{" "}
                  {active.sourceMeta.ibgeGdpYear}.
                </p>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  Metodo {active.sourceMeta.methodVersion} com sinais curados temporarios de logistica e parte da infraestrutura.
                </p>
              </>
            )}
          </>
        ) : null}
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="rounded-[24px] border border-[rgba(15,118,110,0.16)] bg-[rgba(15,118,110,0.05)] p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--teal)]">Dimensao dominante</p>
          <div className="mt-2">
            <span className="block text-base font-semibold capitalize text-[var(--navy)]">
              {readableDimension(dominantDimension[0] as keyof Weights)}
            </span>
            <span className="mt-1 block text-2xl font-semibold text-[var(--navy)]">{dominantDimension[1]}</span>
          </div>
        </div>
        <div className="rounded-[24px] border border-[rgba(19,53,75,0.12)] bg-[rgba(19,53,75,0.04)] p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--navy)]">Posicao</p>
          <div className="mt-2 text-2xl font-semibold text-[var(--navy)]">
            {isMunicipal ? `#${formatInt(selectedMunicipality?.rankInState ?? 0)} na UF` : `#${formatInt(selectedState.rank)} no ranking`}
          </div>
          <p className="mt-1 text-xs text-[var(--muted)]">
            {isMunicipal ? "Referencia municipal demonstrativa dentro da UF ativa." : "Comparacao estadual oficial do recorte atual."}
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {Object.entries(scores).map(([key, value]) => {
          const average = comparisonAverage[key as keyof Scores];
          return (
            <div key={key}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="capitalize">{readableDimension(key as keyof Weights)}</span>
                <span className="font-semibold">
                  {formatInt(value)} <span className="text-[var(--muted)]">vs media {formatInt(average)}</span>
                </span>
              </div>
              <div className="h-2.5 rounded-full bg-slate-200">
                <div className="h-2.5 rounded-full bg-[var(--teal)]" style={{ width: `${value}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 rounded-[24px] bg-[rgba(15,118,110,0.08)] p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--teal)]">Recomendacao</p>
        <p className="mt-2 text-base text-[var(--foreground)]">{active.recommendations[0]}</p>
      </div>

      <details className="mt-5 rounded-[24px] border border-[var(--border)] bg-white/75 p-4">
        <summary className="cursor-pointer text-xs font-semibold uppercase tracking-[0.18em] text-[var(--navy)]">
          Abrir detalhamento territorial
        </summary>
        <div className="mt-4 space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--navy)]">Composicao de ativos energeticos</p>
            <div className="mt-3 space-y-2">
              {compositionEntries.map((entry) => (
                <div key={entry.label}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span>{entry.label}</span>
                    <span className="font-semibold">{formatInt(entry.value)}</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-slate-200">
                    <div
                      className="h-2.5 rounded-full"
                      style={{ width: `${Math.round((entry.value / compositionTotal) * 100)}%`, backgroundColor: entry.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="text-sm font-semibold text-[var(--navy)]">Forcas</h4>
              <ul className="mt-2 space-y-2 text-sm text-[var(--muted)]">
                {active.strengths.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[var(--navy)]">Gargalos</h4>
              <ul className="mt-2 space-y-2 text-sm text-[var(--muted)]">
                {active.bottlenecks.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </details>

      {!isMunicipal && selectedState.scoreSources ? (
        <details className="mt-5 rounded-[24px] border border-[var(--border)] bg-[var(--surface-soft)] p-4">
          <summary className="cursor-pointer text-xs font-semibold uppercase tracking-[0.18em] text-[var(--navy)]">
            Como o IMTE foi montado
          </summary>
          <div className="mt-3 space-y-3">
            {Object.entries(selectedState.scoreSources).map(([key, trace]) => (
              <div key={key}>
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="capitalize text-[var(--foreground)]">{readableDimension(key as keyof Weights)}</span>
                  <span className="rounded-full bg-[rgba(19,53,75,0.08)] px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--navy)]">
                    {sourceModeLabel[trace.mode]}
                  </span>
                </div>
                <p className="mt-1 text-xs text-[var(--muted)]">{trace.summary}</p>
              </div>
            ))}
          </div>
        </details>
      ) : null}
    </aside>
  );
}
