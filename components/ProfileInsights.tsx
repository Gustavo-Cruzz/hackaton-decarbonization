"use client";

interface ProfileInsightsProps {
  profile: {
    label: string;
    tone: string;
    insightCards: string[];
    suggestedQuestions: string[];
  };
  onAskSuggestedQuestion: (question: string) => void;
}

export function ProfileInsights({ profile, onAskSuggestedQuestion }: ProfileInsightsProps) {
  return (
    <section className="glass rounded-[24px] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-[var(--navy)]">Perfil ativo</h2>
          <p className="text-sm text-[var(--muted)]">Linguagem e insights adaptados para {profile.label.toLowerCase()}.</p>
        </div>
        <div className="rounded-full bg-[rgba(15,118,110,0.1)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--teal)]">
          {profile.label}
        </div>
      </div>
      <p className="mt-3 rounded-2xl bg-[rgba(22,56,77,0.05)] p-3.5 text-sm text-[var(--foreground)]">
        A narrativa prioriza {profile.tone}.
      </p>
      <div className="mt-3 grid gap-2.5 md:grid-cols-1">
        {profile.insightCards.map((item) => (
          <div key={item} className="surface-strong rounded-2xl p-3.5 text-sm font-medium text-[var(--navy)]">
            {item}
          </div>
        ))}
      </div>
      <div className="mt-3">
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Perguntas sugeridas</div>
        <div className="mt-2 flex flex-wrap gap-2">
          {profile.suggestedQuestions.map((question) => (
            <button
              key={question}
              type="button"
              className="rounded-full border border-[var(--border)] bg-white/90 px-3 py-2 text-left text-sm text-[var(--foreground)] transition hover:border-[rgba(242,111,99,0.28)] hover:bg-[var(--coral-soft)]"
              onClick={() => onAskSuggestedQuestion(question)}
            >
              {question}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
