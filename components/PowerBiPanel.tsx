"use client";

const POWER_BI_URL =
  "https://app.powerbi.com/view?r=eyJrIjoiZTkxZGJlODEtMzQ4Yi00OGE1LTk3MGEtNWVlODdlMDlhOWIyIiwidCI6IjQ0OTlmNGZmLTI0YTYtNGI0Mi1iN2VmLTEyNGFmY2FkYzkxMyJ9";

export function PowerBiPanel() {
  return (
    <section className="glass shadow-panel rounded-[32px] p-6">
      <div className="max-w-3xl">
        <div className="inline-flex items-center rounded-full bg-[rgba(19,53,75,0.08)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--navy)]">
          Projetos ANP e ANEEL
        </div>
        <h2 className="mt-3 text-2xl font-semibold text-[var(--navy)]">Painel interativo Power BI</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Explore a base interativa de projetos diretamente na mesma experiencia, sem sair do app principal.
        </p>
      </div>

      <div className="mt-5 overflow-hidden rounded-[28px] border border-[var(--border)] bg-white shadow-[0_18px_48px_rgba(22,56,77,0.08)]">
        <iframe
          title="Projetos ANP e ANEEL"
          src={POWER_BI_URL}
          className="h-[760px] w-full border-0"
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>

      <p className="mt-4 text-sm text-[var(--muted)]">
        Se o embed nao carregar, abra diretamente{" "}
        <a className="font-semibold text-[var(--teal)] underline" href={POWER_BI_URL} target="_blank" rel="noreferrer">
          neste link do Power BI
        </a>
        .
      </p>
    </section>
  );
}
