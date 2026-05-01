import { useState } from "react";
import { ArrowRight, ShieldCheck, ClipboardList, Activity, CheckCircle2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge, type StatusTone } from "./StatusBadge";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";

type MetricKey = string;

interface Metric {
  key: MetricKey;
  value: string;
  label: string;
  emphasis?: boolean;
}

interface MetricDetail {
  summary: string;
  breakdown: { label: string; value: string; tone?: "default" | "attention" | "critical" }[];
  items: { id: string; title: string; meta: string; tone?: "default" | "attention" | "critical" }[];
  ctaLabel: string;
}

interface AttentionCard {
  title: string;
  icon: LucideIcon;
  status: string;
  statusTone: StatusTone;
  metrics: Metric[];
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
      { key: "risks-new", value: "0", label: "Новых рисков" },
      { key: "risks-breached", value: "0", label: "С пробитым лимитом" },
      { key: "risks-ai", value: "0", label: "AI-риски на подтверждение" },
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
      { key: "measures-overdue", value: "4", label: "Меры просрочены", emphasis: true },
      { key: "measures-high-risk", value: "2", label: "Связаны с высокими рисками" },
      { key: "measures-no-progress", value: "1", label: "Мера без прогресса" },
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
      { key: "kir-yellow", value: "3", label: "В жёлтой зоне", emphasis: true },
      { key: "kir-red", value: "0", label: "В красной зоне" },
      { key: "kir-degrading", value: "1", label: "Ухудшается 3-й месяц" },
    ],
    hint: "Есть негативная динамика, требуется проверка.",
    cta: "Открыть КИРы",
  },
];

const metricDetails: Record<MetricKey, MetricDetail> = {
  "risks-new": {
    summary: "За последние 30 дней новых рисков не зарегистрировано. Поток на согласование пуст.",
    breakdown: [
      { label: "За 7 дней", value: "0" },
      { label: "За 30 дней", value: "0" },
      { label: "В черновиках", value: "2" },
    ],
    items: [],
    ctaLabel: "Открыть реестр рисков",
  },
  "risks-breached": {
    summary: "Рисков с пробитым лимитом нет. Все ключевые лимиты под контролем.",
    breakdown: [
      { label: "Прямые потери", value: "0" },
      { label: "Косвенные потери", value: "0" },
      { label: "Кредитные потери", value: "0" },
    ],
    items: [],
    ctaLabel: "Перейти к лимитам",
  },
  "risks-ai": {
    summary: "AI-предложений на подтверждение нет.",
    breakdown: [
      { label: "Новых предложений", value: "0" },
      { label: "Отклонено за месяц", value: "1" },
    ],
    items: [],
    ctaLabel: "Открыть AI-очередь",
  },
  "measures-overdue": {
    summary: "4 меры с истёкшим сроком. 2 из них связаны с рисками высокого уровня — приоритет.",
    breakdown: [
      { label: "Просрочка > 30 дней", value: "1", tone: "critical" },
      { label: "Просрочка 7–30 дней", value: "2", tone: "attention" },
      { label: "Просрочка < 7 дней", value: "1", tone: "attention" },
    ],
    items: [
      { id: "M-2041", title: "Внедрить двойной контроль операций > 5 млн", meta: "Срок 12.04 · −19 дн", tone: "critical" },
      { id: "M-2057", title: "Обновить регламент сверки с контрагентом", meta: "Срок 22.04 · −9 дн", tone: "attention" },
      { id: "M-2063", title: "Доработать логирование в BPM", meta: "Срок 27.04 · −4 дн", tone: "attention" },
      { id: "M-2071", title: "Провести обучение операционистов", meta: "Срок 30.04 · −1 дн", tone: "attention" },
    ],
    ctaLabel: "Открыть просроченные меры",
  },
  "measures-high-risk": {
    summary: "2 просроченные меры закрывают риски с высоким уровнем потерь.",
    breakdown: [
      { label: "Связаны с критическими рисками", value: "1", tone: "critical" },
      { label: "Связаны с высокими рисками", value: "1", tone: "attention" },
    ],
    items: [
      { id: "M-2041", title: "Двойной контроль операций > 5 млн ↔ R-118 (критич.)", meta: "Просрочка 19 дн", tone: "critical" },
      { id: "M-2057", title: "Регламент сверки ↔ R-204 (высокий)", meta: "Просрочка 9 дн", tone: "attention" },
    ],
    ctaLabel: "Перейти к связанным рискам",
  },
  "measures-no-progress": {
    summary: "1 мера без отметок о выполнении более 60 дней. Владелец не отвечал.",
    breakdown: [
      { label: "Без активности 30–60 дн", value: "0" },
      { label: "Без активности > 60 дн", value: "1", tone: "attention" },
    ],
    items: [
      { id: "M-1987", title: "Пилот сценария резервирования", meta: "Последняя активность 18.02", tone: "attention" },
    ],
    ctaLabel: "Открыть карточку меры",
  },
  "kir-yellow": {
    summary: "3 КИРа находятся в жёлтой зоне. Один из них ухудшается третий месяц подряд.",
    breakdown: [
      { label: "Стабильны", value: "2" },
      { label: "Ухудшаются", value: "1", tone: "attention" },
    ],
    items: [
      { id: "KIR-07", title: "Доля ручных корректировок", meta: "4.8% · порог 4.0% · ↑ 3 мес", tone: "attention" },
      { id: "KIR-12", title: "Время восстановления сервиса", meta: "42 мин · порог 30 мин", tone: "attention" },
      { id: "KIR-19", title: "Доля повторных инцидентов", meta: "11% · порог 10%", tone: "attention" },
    ],
    ctaLabel: "Открыть КИРы в жёлтой зоне",
  },
  "kir-red": {
    summary: "Индикаторов в красной зоне нет.",
    breakdown: [
      { label: "В красной зоне", value: "0" },
      { label: "Вблизи красного порога", value: "1", tone: "attention" },
    ],
    items: [],
    ctaLabel: "Открыть все КИРы",
  },
  "kir-degrading": {
    summary: "1 КИР ухудшается 3-й месяц подряд — вероятен переход в красную зону.",
    breakdown: [
      { label: "Текущее значение", value: "4.8%", tone: "attention" },
      { label: "Жёлтый порог", value: "4.0%" },
      { label: "Красный порог", value: "6.0%", tone: "critical" },
    ],
    items: [
      { id: "KIR-07", title: "Доля ручных корректировок", meta: "Фев 3.9% → Мар 4.3% → Апр 4.8%", tone: "attention" },
    ],
    ctaLabel: "Открыть карточку КИР",
  },
};

const toneText = {
  default: "text-foreground",
  attention: "text-attention",
  critical: "text-critical",
} as const;

export const AttentionZone = () => {
  const [openKey, setOpenKey] = useState<MetricKey | null>(null);
  const openCard = openKey ? cards.find((c) => c.metrics.some((m) => m.key === openKey)) : null;
  const openMetric = openKey && openCard ? openCard.metrics.find((m) => m.key === openKey)! : null;
  const detail = openKey ? metricDetails[openKey] : null;

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
                {card.metrics.map((m) => (
                  <button
                    key={m.key}
                    onClick={() => setOpenKey(m.key)}
                    className="flex w-full items-baseline justify-between gap-3 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-secondary/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  >
                    <span className="text-sm text-muted-foreground">{m.label}</span>
                    <span
                      className={cn(
                        "text-2xl font-bold tabular-nums",
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

      <Sheet open={!!openKey} onOpenChange={(o) => !o && setOpenKey(null)}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-[480px]">
          {openMetric && detail && openCard && (
            <>
              <SheetHeader>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {openCard.title}
                </div>
                <SheetTitle className="text-base">{openMetric.label}</SheetTitle>
                <SheetDescription className="flex items-baseline gap-3 pt-1">
                  <span
                    className={cn(
                      "text-3xl font-bold",
                      openMetric.emphasis ? "text-attention" : "text-foreground",
                      openMetric.value === "0" && "text-muted-foreground/70",
                    )}
                  >
                    {openMetric.value}
                  </span>
                  <span className="text-xs text-muted-foreground">{detail.summary}</span>
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                <div>
                  <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Разбивка
                  </div>
                  <div className="divide-y divide-border rounded-lg border border-border bg-card">
                    {detail.breakdown.map((b, idx) => (
                      <div key={idx} className="flex items-center justify-between px-3 py-2 text-xs">
                        <span className="text-muted-foreground">{b.label}</span>
                        <span className={cn("text-sm font-semibold", toneText[b.tone ?? "default"])}>
                          {b.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {detail.items.length > 0 && (
                  <div>
                    <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Что попадает в эту цифру
                    </div>
                    <ul className="space-y-1.5">
                      {detail.items.map((item) => (
                        <li
                          key={item.id}
                          className="flex items-start justify-between gap-3 rounded-lg border border-border bg-card px-3 py-2.5 text-xs"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-muted-foreground">{item.id}</span>
                              <span className={cn("truncate font-medium", toneText[item.tone ?? "default"])}>
                                {item.title}
                              </span>
                            </div>
                            <div className="mt-0.5 text-[11px] text-muted-foreground">{item.meta}</div>
                          </div>
                          <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {detail.items.length === 0 && (
                  <div className="rounded-lg border border-dashed border-border bg-secondary/30 px-3 py-4 text-center text-xs text-muted-foreground">
                    Объектов в этой выборке нет
                  </div>
                )}
              </div>

              <button className="mt-6 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary">
                {detail.ctaLabel}
                <ArrowRight className="h-4 w-4" />
              </button>
            </>
          )}
        </SheetContent>
      </Sheet>
    </section>
  );
};
