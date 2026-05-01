import { ArrowRight, ShieldCheck, ClipboardList, Activity, CheckCircle2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge, type StatusTone } from "./StatusBadge";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AttentionCard {
  title: string;
  icon: LucideIcon;
  status: string;
  statusTone: StatusTone;
  metrics: { value: string; label: string; emphasis?: boolean }[];
  hint?: string;
  cta: string;
}

const cards: AttentionCard[] = [
  {
    title: "Риски",
    icon: ShieldCheck,
    status: "Спокойно",
    statusTone: "calm",
    metrics: [
      { value: "0", label: "Новых рисков" },
      { value: "0", label: "С пробитым лимитом" },
      { value: "0", label: "AI-риски на подтверждение" },
    ],
    hint: "Все ключевые риски в норме, действий не требуется.",
    cta: "Перейти в риски",
  },
  {
    title: "Меры",
    icon: ClipboardList,
    status: "Требуют внимания",
    statusTone: "attention",
    metrics: [
      { value: "4", label: "Меры просрочены", emphasis: true },
      { value: "2", label: "Связаны с высокими рисками" },
      { value: "1", label: "Мера без прогресса" },
    ],
    hint: "Требуется обновить статус или назначить владельцев.",
    cta: "Открыть просроченные",
  },
  {
    title: "КИРы",
    icon: Activity,
    status: "Жёлтая зона",
    statusTone: "attention",
    metrics: [
      { value: "3", label: "В жёлтой зоне", emphasis: true },
      { value: "0", label: "В красной зоне" },
      { value: "1", label: "Ухудшается 3-й месяц" },
    ],
    hint: "Есть негативная динамика, требуется проверка.",
    cta: "Открыть КИРы",
  },
];

export const AttentionZone = () => {
  return (
    <section aria-labelledby="attention-title" className="space-y-5">
      <div>
        <h2 id="attention-title" className="text-2xl font-semibold tracking-tight text-foreground">
          Зона внимания
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Отклонения по ключевым объектам управления
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          const isCalm = card.statusTone === "calm";
          return (
            <article
              key={card.title}
              className="surface-card group flex flex-col p-6 transition-all hover:shadow-elevated"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-xl",
                      isCalm ? "bg-calm-soft text-calm" : "bg-attention-soft text-attention",
                    )}
                  >
                    <Icon className="h-5 w-5" strokeWidth={2.25} />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{card.title}</h3>
                </div>
                <StatusBadge
                  tone={card.statusTone}
                  size="sm"
                  icon={isCalm ? CheckCircle2 : AlertTriangle}
                >
                  {card.status}
                </StatusBadge>
              </div>

              <div className="mt-6 flex-1 space-y-3">
                {card.metrics.map((m, i) => (
                  <button
                    key={i}
                    className="flex w-full items-baseline justify-between gap-3 rounded-lg py-1.5 text-left transition-colors hover:bg-secondary/60"
                  >
                    <span className="text-sm text-muted-foreground">{m.label}</span>
                    <span
                      className={cn(
                        "font-mono-num text-2xl font-bold tabular-nums",
                        m.emphasis ? "text-attention" : "text-foreground",
                        m.value === "0" && "text-muted-foreground/70",
                      )}
                    >
                      {m.value}
                    </span>
                  </button>
                ))}
              </div>

              {card.hint && (
                <p className="mt-5 rounded-lg border border-border bg-secondary/50 px-3 py-2 text-xs leading-relaxed text-muted-foreground">
                  {card.hint}
                </p>
              )}

              <Button
                variant="outline"
                className="mt-4 w-full border-border-strong bg-card hover:bg-primary hover:text-primary-foreground hover:border-primary"
              >
                {card.cta}
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </article>
          );
        })}
      </div>
    </section>
  );
};
