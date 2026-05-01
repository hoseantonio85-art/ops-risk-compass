import { Sparkles, ShieldAlert } from "lucide-react";

export const AISummary = () => {
  return (
    <section
      aria-labelledby="ai-summary-title"
      className="relative overflow-hidden rounded-2xl border border-primary/15 bg-gradient-ai-soft p-8 shadow-ai"
    >
      {/* Subtle decorative orb */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary-glow/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 left-1/3 h-56 w-56 rounded-full bg-primary/10 blur-3xl"
      />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-ai shadow-sm">
              <Sparkles className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <h2 id="ai-summary-title" className="text-sm font-semibold uppercase tracking-wider text-primary">
              AI-саммари · ситуация на сейчас
            </h2>
          </div>

          <p className="max-w-3xl text-xl font-medium leading-relaxed text-foreground lg:text-[22px]">
            Ситуация требует внимания. Лимит использован на{" "}
            <span className="font-bold text-attention">82%</span>, но пока не пробит.
            Основной вклад дают{" "}
            <span className="font-semibold text-foreground">3 риска</span>. Есть{" "}
            <span className="font-semibold text-attention">4 просроченные меры</span>, 2 из них связаны
            с высокими рисками.
          </p>

          <div className="flex items-start gap-2.5 rounded-xl border border-primary/10 bg-card/60 p-4 backdrop-blur-sm">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={2.5} />
            <div className="space-y-1.5">
              <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Рекомендуем начать с
              </div>
              <ol className="space-y-1 text-sm font-medium text-foreground">
                <li className="flex items-baseline gap-2">
                  <span className="text-xs font-bold text-primary">1.</span>
                  Утилизации лимита
                </li>
                <li className="flex items-baseline gap-2">
                  <span className="text-xs font-bold text-primary">2.</span>
                  Просроченных мер
                </li>
              </ol>
              <div className="pt-1 text-xs text-muted-foreground">
                Это важно, потому что 2 меры связаны с рисками, влияющими на лимит.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
