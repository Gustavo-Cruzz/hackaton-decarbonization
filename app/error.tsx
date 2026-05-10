"use client";

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error("App route error", error);

  return (
    <main className="mx-auto flex min-h-screen max-w-[880px] flex-col justify-center gap-5 px-4 py-10 text-[15px] lg:px-6">
      <section className="glass rounded-[32px] p-8 shadow-panel">
        <div className="inline-flex items-center rounded-full bg-[rgba(220,38,38,0.08)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--red)]">
          Application error
        </div>
        <h1 className="mt-4 text-3xl font-semibold text-[var(--navy)]">A tela encontrou um erro no cliente</h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          A aplicacao falhou ao renderizar uma secao desta pagina. Tente recarregar a experiencia.
        </p>
        <button
          type="button"
          className="mt-5 rounded-2xl bg-[linear-gradient(135deg,var(--navy),#1f5f73)] px-4 py-3 text-sm font-semibold text-white"
          onClick={() => reset()}
        >
          Tentar novamente
        </button>
      </section>
    </main>
  );
}
