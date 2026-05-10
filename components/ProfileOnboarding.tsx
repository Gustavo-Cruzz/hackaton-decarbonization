"use client";

import { ProfileConfig } from "@/lib/types";

interface ProfileOnboardingProps {
  profiles: ProfileConfig[];
  onChooseProfile: (profileId: ProfileConfig["id"]) => void;
}

export function ProfileOnboarding({ profiles, onChooseProfile }: ProfileOnboardingProps) {
  return (
    <section className="glass shadow-panel rounded-[32px] p-6 md:p-8">
      <div className="max-w-3xl">
        <div className="inline-flex items-center rounded-full border border-[rgba(15,118,110,0.16)] bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--teal)]">
          Escolha seu perfil
        </div>
        <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-[var(--navy)]">
          Entre pelo ponto de vista que guia sua decisao
        </h1>
        <p className="mt-3 max-w-2xl text-base text-[var(--muted)]">
          O app adapta a narrativa, o ranking e as perguntas sugeridas ao seu perfil. Escolha como voce quer explorar o territorio antes de entrar no mapa.
        </p>
      </div>

      <div className="mt-8 grid gap-5 xl:grid-cols-2">
        {profiles.map((profile) => (
          <article
            key={profile.id}
            className="rounded-[28px] border border-[rgba(22,56,77,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(255,247,244,0.9))] p-5 shadow-[0_18px_48px_rgba(22,56,77,0.08)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--teal)]">Perfil</div>
                <h2 className="mt-2 text-2xl font-semibold text-[var(--navy)]">{profile.label}</h2>
              </div>
              <div className="rounded-full bg-[rgba(242,111,99,0.12)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--coral-deep)]">
                {profile.insightCards[0]}
              </div>
            </div>

            <p className="mt-4 text-sm text-[var(--foreground)]">{profile.summary ?? profile.tone}</p>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {profile.insightCards.map((item) => (
                <div key={item} className="surface-strong rounded-2xl p-3 text-sm font-medium text-[var(--navy)]">
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-5">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Perguntas que esse perfil costuma fazer</div>
              <div className="mt-3 space-y-2">
                {profile.suggestedQuestions.slice(0, 2).map((question) => (
                  <p key={question} className="rounded-2xl bg-[rgba(22,56,77,0.05)] px-4 py-3 text-sm text-[var(--foreground)]">
                    {question}
                  </p>
                ))}
              </div>
            </div>

            <button
              type="button"
              className="mt-5 rounded-2xl bg-[linear-gradient(135deg,var(--teal),#159b8f)] px-4 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(15,118,110,0.22)]"
              onClick={() => onChooseProfile(profile.id)}
            >
              Entrar como {profile.label}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
