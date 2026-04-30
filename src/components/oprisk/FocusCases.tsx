import { ArrowRight, Clock, AlertCircle, Repeat, TrendingDown, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge, type StatusTone } from "./StatusBadge";
import type { LucideIcon } from "lucide-react";

interface FocusCase {
  title: string;
  status: string;
  statusTone: StatusTone;
  loss: string;
  overdueDays?: number;
  relatedRisk?: string;
  reason: string;
  reasonIcon: LucideIcon;
  reasonTone: "attention" | "critical";
}

const cases: FocusCase[] = [
  {
    title: "Ошибка обработки клиентской операции",
    status: "Расследование",
    statusTone: "attention",
    loss: "12,4 млн ₽",
    overdueDays: 3,
    relatedRisk: "Операционные ошибки",
    reason: "Высокая сумма + просрочка",
    reasonIcon: AlertCircle,
    reasonTone: "critical",
  },
  {
    title: "Клиентская претензия по списанию",
    status: "На утверждении",
    statusTone: "neutral",
    loss: "8,1 млн ₽",
    relatedRisk: "Клиентские претензии",
    reason: "Влияет на лимит",
    reasonIcon: TrendingDown,
    reasonTone: "attention",
  },
  {
    title: "Сбой сверки операций",
    status: "Расследование",
    statusTone: "attention",
    loss: "5,7 млн ₽",
    overdueDays: 1,
    reason: "Повторяемость сценария",
    reasonIcon: Repeat,
    reasonTone: "attention",
  },
];

const reasonStyles = {
  attention: "bg-attention-soft text-attention border-attention/20",
  critical: "bg-critical-soft text-critical border-critical/20",
};

export const FocusCases = () => {
  return (
    <section aria-labelledby="focus-title" className="space-y-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 id="focus-title" className="text-2xl font-semibold tracking-tight text-foreground">
            Фокусные кейсы
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Инциденты, которые требуют внимания
          </p>
        </div>
        <Button variant="ghost" className="text-primary hover:bg-primary-soft hover:text-primary">
          Все инциденты
          <ArrowRight className="ml-1.5 h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cases.map((c) => {
          const ReasonIcon = c.reasonIcon;
          return (
            <article
              key={c.title}
              className="surface-card group flex flex-col p-5 transition-all hover:-translate-y-0.5 hover:shadow-elevated"
            >
              {/* Reason — почему в фокусе, наверху, цветная подсветка */}
              <div
                className={`mb-4 inline-flex items-center gap-1.5 self-start rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${reasonStyles[c.reasonTone]}`}
              >
                <ReasonIcon className="h-3 w-3" strokeWidth={2.5} />
                {c.reason}
              </div>

              <h3 className="text-base font-semibold leading-snug text-foreground">
                {c.title}
              </h3>

              <div className="mt-3 flex items-center gap-2">
                <StatusBadge tone={c.statusTone} size="sm">{c.status}</StatusBadge>
                {c.overdueDays !== undefined && (
                  <StatusBadge tone="attention" size="sm" icon={Clock}>
                    Просрочка {c.overdueDays} {c.overdueDays === 1 ? "день" : "дн."}
                  </StatusBadge>
                )}
              </div>

              <div className="mt-5 space-y-2.5 border-t border-border pt-4 text-sm">
                <div className="flex items-baseline justify-between">
                  <span className="text-muted-foreground">Потери</span>
                  <span className="font-mono-num text-base font-semibold text-foreground">{c.loss}</span>
                </div>
                {c.relatedRisk && (
                  <div className="flex items-start justify-between gap-3">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Link2 className="h-3 w-3" />
                      Связанный риск
                    </span>
                    <span className="text-right font-medium text-foreground">{c.relatedRisk}</span>
                  </div>
                )}
              </div>

              <Button
                variant="outline"
                className="mt-5 w-full border-border-strong bg-card hover:bg-primary hover:text-primary-foreground hover:border-primary"
              >
                Открыть
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </article>
          );
        })}
      </div>
    </section>
  );
};
