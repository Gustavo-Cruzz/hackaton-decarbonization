"use client";

import { ProfileConfig } from "@/lib/types";

interface ProfileInsightsProps {
  profile: ProfileConfig;
  onAskSuggestedQuestion: (question: string) => void;
}

export function ProfileInsights({ profile, onAskSuggestedQuestion }: ProfileInsightsProps) {
  return (
    <section className="glass rounded-[28px] p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-[var(--navy)]">Perfil ativo</h2>
          <p className="text-sm text-[var(--muted)]">Linguagem e insights adaptados para {profile.label.toLowerCase()}.</p>
        </div>
        <div className="rounded-full bg-[rgba(15,118,110,0.12)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--teal)]">
          {profile.label}
        </div>
      </div>
      <p className="mt-4 rounded-2xl bg-[rgba(19,53,75,0.08)] p-4 text-sm text-[var(--foreground)]">
        A narrativa prioriza {profile.tone}.
      </p>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {profile.insightCards.map((item) => (
          <div key={item} className="surface-strong rounded-2xl p-4 text-sm font-medium text-[var(--navy)]">
            {item}
          </div>
        ))}
      </div>
      <div className="mt-4">
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Perguntas sugeridas</div>
        <div className="mt-2 flex flex-wrap gap-2">
          {profile.suggestedQuestions.map((question) => (
            <button
              key={question}
              type="button"
              className="rounded-full border border-[var(--border)] bg-white px-3 py-2 text-left text-sm text-[var(--foreground)]"
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
