"use client";

import dynamic from "next/dynamic";
import clsx from "clsx";
import {
  buildLegendDefinition,
  getEnabledLayerKeys,
  getPrimaryActiveLayer,
  layerDefinitions,
  layerGroups
} from "@/lib/map-config";
import {
  LayerGroupKey,
  LayerKey,
  LayerVisibilityState,
  LegendDefinition,
  MapLevel,
  MunicipalityRecord,
  RankedTerritory
} from "@/lib/types";
import { formatInt } from "@/lib/display";

const LeafletMapCanvas = dynamic(() => import("@/components/LeafletMapCanvas"), {
  ssr: false
});

interface MapViewProps {
  ranked: RankedTerritory[];
  municipalities: MunicipalityRecord[];
  municipalityStatus: "idle" | "loading" | "available" | "unavailable";
  selectedUf: string;
  selectedMunicipalityId?: string;
  mapLevel: MapLevel;
  activeTheme?: LayerGroupKey;
  enabledLayers: LayerVisibilityState;
  layerOpacity: number;
  useBasemap: boolean;
  onSelectUf: (uf: string) => void;
  onSelectMunicipality: (municipalityId: string) => void;
  onToggleLayer: (layer: LayerKey) => void;
  onSetActiveTheme: (theme: LayerGroupKey) => void;
  onSetMapLevel: (level: MapLevel) => void;
  onSetLayerOpacity: (opacity: number) => void;
  onToggleBasemap: () => void;
  onResetView: () => void;
  onShareView: () => void;
  onDownloadTerritory: () => void;
}

function LegendCard({ legend }: { legend: LegendDefinition }) {
  return (
    <div className="surface-strong rounded-[24px] p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">{legend.title}</p>
      <p className="mt-2 text-sm text-[var(--foreground)]">{legend.description}</p>
      <div className="mt-3 space-y-2 text-sm text-[var(--foreground)]">
        {legend.items.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <span
              className={clsx("inline-flex", item.symbol === "square" ? "h-3 w-3 rounded-[4px]" : "h-3 w-3 rounded-full")}
              style={{ backgroundColor: item.color }}
            />
            {item.label}
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-[var(--muted)]">
        Fonte: {legend.source} • ref. {legend.referenceDate}
      </p>
    </div>
  );
}

export function MapView({
  ranked,
  municipalities,
  municipalityStatus,
  selectedUf,
  selectedMunicipalityId,
  mapLevel,
  activeTheme,
  enabledLayers,
  layerOpacity,
  useBasemap,
  onSelectUf,
  onSelectMunicipality,
  onToggleLayer,
  onSetActiveTheme,
  onSetMapLevel,
  onSetLayerOpacity,
  onToggleBasemap,
  onResetView,
  onShareView,
  onDownloadTerritory
}: MapViewProps) {
  const selected = ranked.find((territory) => territory.uf === selectedUf) ?? ranked[0];
  const selectedMunicipality = municipalities.find((territory) => territory.id === selectedMunicipalityId) ?? null;
  const activeLayers = getEnabledLayerKeys(enabledLayers);
  const primaryLayer = getPrimaryActiveLayer(enabledLayers, activeTheme);
  const legend = buildLegendDefinition(primaryLayer, selected.sourceMeta);
  const activeThemeLabel = layerGroups.find((group) => group.key === activeTheme)?.label ?? "Tema";
  const territoryLabel =
    mapLevel === "municipal" && selectedMunicipality
      ? `${selectedMunicipality.name}, ${selectedMunicipality.uf}`
      : selected.state;

  return (
    <section className="glass shadow-panel rounded-[28px] p-5">
      <div className="mb-3 flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <div className="mb-1.5 inline-flex items-center rounded-full bg-[rgba(19,53,75,0.08)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--navy)]">
            Exploracao geoespacial ativa
          </div>
          <h2 className="text-2xl font-semibold text-[var(--navy)]">Mapa analitico Brasil → UF → municipios</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            O mapa concentra a navegacao principal; analise e ajuste ficam colados ao contexto.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button type="button" className="rounded-full bg-[var(--navy)] px-3 py-2 text-xs font-semibold text-white" onClick={onResetView}>
            Resetar visao
          </button>
          <button
            type="button"
            className="rounded-full border border-[var(--border)] bg-white/80 px-3 py-2 text-xs font-semibold text-[var(--navy)]"
            onClick={onShareView}
          >
            Compartilhar visao
          </button>
          <button
            type="button"
            className="rounded-full border border-[var(--border)] bg-white/80 px-3 py-2 text-xs font-semibold text-[var(--navy)]"
            onClick={onDownloadTerritory}
          >
            Baixar JSON
          </button>
        </div>
      </div>

      <div className="grid gap-3 xl:grid-cols-[minmax(0,1.55fr)_300px]">
        <div className="space-y-3">
          <div className="rounded-[22px] bg-[linear-gradient(135deg,rgba(19,53,75,0.96),rgba(15,118,110,0.92))] p-3.5 text-white">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">Foco atual</p>
                <div className="mt-2 text-2xl font-semibold">{territoryLabel}</div>
                <p className="mt-1 text-sm text-white/80">
                  {mapLevel === "municipal" && selectedMunicipality
                    ? `Municipio demonstrativo • IMTE proxy ${formatInt(selectedMunicipality.imteProxy)} • ${selectedMunicipality.classification}`
                    : `UF em foco • IMTE ${formatInt(selected.imte)} • ${selected.classification}`}
                </p>
              </div>
              <p className="max-w-2xl text-sm text-white/85">
                {mapLevel === "municipal" && selectedMunicipality ? selectedMunicipality.explanation : selected.explanation}
              </p>
            </div>
          </div>

          <div className="surface-strong rounded-[22px] p-3.5">
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Escala</span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className={clsx(
                      "rounded-full px-3 py-2 text-xs font-semibold transition",
                      mapLevel === "national" ? "bg-[var(--navy)] text-white" : "bg-[rgba(19,53,75,0.08)] text-[var(--navy)]"
                    )}
                    onClick={() => onSetMapLevel("national")}
                  >
                    Brasil
                  </button>
                  <button
                    type="button"
                    className={clsx(
                      "rounded-full px-3 py-2 text-xs font-semibold transition",
                      mapLevel === "state" ? "bg-[var(--navy)] text-white" : "bg-[rgba(19,53,75,0.08)] text-[var(--navy)]"
                    )}
                    onClick={() => onSetMapLevel("state")}
                  >
                    UF ativa
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  className="rounded-full border border-[var(--border)] bg-white/80 px-3 py-2 text-xs font-semibold text-[var(--navy)]"
                  onClick={onToggleBasemap}
                >
                  {useBasemap ? "Basemap online" : "Fallback local"}
                </button>
                <div className="flex items-center gap-3">
                  <label htmlFor="layer-opacity" className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                    Opacidade
                  </label>
                  <input
                    id="layer-opacity"
                    type="range"
                    min="20"
                    max="100"
                    value={Math.round(layerOpacity * 100)}
                    onChange={(event) => onSetLayerOpacity(Number(event.target.value) / 100)}
                  />
                  <span className="text-sm text-[var(--navy)]">{formatInt(layerOpacity * 100)}%</span>
                </div>
              </div>

              <div className="overflow-hidden rounded-[22px]">
                <LeafletMapCanvas
                  ranked={ranked}
                  municipalities={municipalities}
                  selectedUf={selectedUf}
                  selectedMunicipalityId={selectedMunicipalityId}
                  mapLevel={mapLevel}
                  primaryLayer={primaryLayer}
                  enabledLayers={enabledLayers}
                  layerOpacity={layerOpacity}
                  useBasemap={useBasemap}
                  onSelectUf={onSelectUf}
                  onSelectMunicipality={onSelectMunicipality}
                  onBasemapFailure={() => {
                    if (useBasemap) {
                      onToggleBasemap();
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="surface-strong rounded-[22px] p-3.5">
            <div className="flex flex-wrap gap-2">
              {layerGroups.map((group) => (
                <button
                  key={group.key}
                  type="button"
                  className={clsx(
                    "rounded-full px-3 py-2 text-xs font-semibold transition",
                    activeTheme === group.key ? "bg-[var(--navy)] text-white" : "bg-[rgba(19,53,75,0.06)] text-[var(--navy)]"
                  )}
                  onClick={() => onSetActiveTheme(group.key)}
                >
                  {group.label}
                </button>
              ))}
            </div>
            <p className="mt-2 text-sm text-[var(--muted)]">
              {layerGroups.find((group) => group.key === activeTheme)?.description ?? "Selecione um tema para explorar as camadas."}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {layerDefinitions
                .filter((layer) => !activeTheme || layer.group === activeTheme)
                .map((layer) => (
                  <button
                    key={layer.key}
                    type="button"
                    aria-label={`${enabledLayers[layer.key] ? "Desligar" : "Ligar"} camada ${layer.label}`}
                    className={clsx(
                      "rounded-full border px-3 py-2 text-xs font-semibold transition",
                      enabledLayers[layer.key]
                        ? "border-transparent bg-[var(--teal)] text-white"
                        : "border-[var(--border)] bg-white/80 text-[var(--navy)]"
                    )}
                    onClick={() => onToggleLayer(layer.key)}
                  >
                    {layer.label}
                  </button>
                ))}
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Camadas ativas</span>
              {activeLayers.map((layerKey) => (
                <span
                  key={layerKey}
                  className="rounded-full bg-[rgba(15,118,110,0.12)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--teal)]"
                >
                  {layerDefinitions.find((layer) => layer.key === layerKey)?.label ?? layerKey}
                </span>
              ))}
            </div>
            <p className="mt-2 text-xs text-[var(--muted)]">Tema ativo: {activeThemeLabel}.</p>
          </div>

          <LegendCard legend={legend} />

          {municipalityStatus === "loading" ? <p className="rounded-[18px] bg-[rgba(19,53,75,0.04)] p-3 text-sm text-[var(--muted)]">Carregando municipios da UF ativa...</p> : null}
          {municipalityStatus === "unavailable" ? (
            <p className="rounded-[18px] bg-[rgba(217,119,6,0.08)] p-3 text-sm text-[var(--foreground)]">
              O chunk municipal da UF ativa ainda nao esta disponivel localmente. O app permanece no nivel estadual com aviso demonstrativo.
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
