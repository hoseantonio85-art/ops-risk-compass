import { ArrowRight, ArrowUpRight, TrendingUp, AlertTriangle, ShieldCheck, ClipboardCheck, Activity, FileWarning } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./StatusBadge";
import { cn } from "@/lib/utils";

const contributors = [
  { name: "Риск операционных ошибок", value: 32, kind: "Риск" },
  { name: "Риск клиентских претензий", value: 21, kind: "Риск" },
  { name: "Сценарий «Ошибки обработки операций»", value: 18, kind: "Сценарий" },
];

const signals = [
  { label: "Риски", value: "спокойно, новых нет", tone: "calm" as const, icon: ShieldCheck },
  { label: "Меры", value: "4 просрочены", tone: "attention" as const, icon: ClipboardCheck },
  { label: "КИРы", value: "3 в жёлтой зоне", tone: "attention" as const, icon: Activity },
  { label: "Инциденты", value: "5 фокусных", tone: "attention" as const, icon: FileWarning },
];

// Полукольцевой индикатор утилизации
const Gauge = ({ value }: { value: number }) => {
  const radius = 84;
  const circumference = Math.PI * radius;
  const offset = circumference * (1 - value / 100);
  return (
    <div className="relative flex h-[150px] w-[200px] items-end justify-center">
      <svg viewBox="0 0 200 110" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="gauge-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--calm))" />
            <stop offset="60%" stopColor="hsl(var(--attention))" />
            <stop offset="100%" stopColor="hsl(var(--critical))" />
          </linearGradient>
        </defs>
        <path
          d="M 16 100 A 84 84 0 0 1 184 100"
          fill="none"
          stroke="hsl(var(--neutral-soft))"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <path
          d="M 16 100 A 84 84 0 0 1 184 100"
          fill="none"
          stroke="url(#gauge-grad)"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)" }}
        />
        {/* Critical threshold tick at 90% */}
        <line
          x1="178" y1="34" x2="190" y2="26"
          stroke="hsl(var(--critical))" strokeWidth="2" strokeLinecap="round"
        />
      </svg>
      <div className="relative z-10 mb-1 flex flex-col items-center">
        <div className="font-mono-num text-5xl font-bold leading-none text-foreground">
          {value}
          <span className="text-2xl text-muted-foreground">%</span>
        </div>
      </div>
    </div>
  );
};

export const LimitUtilization = () => {
  return (
    <section aria-labelledby="limit-title" className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Main utilization card — занимает 2/3 */}
      <div className="surface-card-lg p-7 lg:col-span-2">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 id="limit-title" className="text-xl font-semibold tracking-tight text-foreground">
              Утилизация лимита
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Главный индикатор по операционному риску
            </p>
          </div>
          <StatusBadge tone="attention" icon={AlertTriangle}>Зона внимания</StatusBadge>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-[auto_1fr]">
          {/* Левая часть — gauge + цифры */}
          <div className="flex flex-col items-center gap-4 md:items-start">
            <Gauge value={82} />
            <div className="space-y-2 text-center md:text-left">
              <div className="font-mono-num text-base font-medium text-foreground">
                820 млн ₽ <span className="text-muted-foreground">из 1 млрд ₽</span>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs md:justify-start">
                <span className="inline-flex items-center gap-1 font-medium text-attention">
                  <TrendingUp className="h-3.5 w-3.5" strokeWidth={2.5} />
                  +7% к прошлому месяцу
                </span>
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground">
                  до критич. порога <span className="font-mono-num font-semibold text-foreground">8%</span>
                </span>
              </div>
            </div>
          </div>

          {/* Правая часть — основной вклад */}
          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Основной вклад
            </div>
            <div className="space-y-2.5">
              {contributors.map((c, i) => (
                <button
                  key={c.name}
                  className="group flex w-full items-center gap-3 rounded-xl border border-transparent p-2.5 text-left transition-all hover:border-border hover:bg-secondary/60"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary-soft font-mono-num text-xs font-bold text-primary">
                    {i + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-foreground">{c.name}</div>
                    <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{c.kind}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* mini bar */}
                    <div className="hidden h-1.5 w-20 overflow-hidden rounded-full bg-neutral-soft sm:block">
                      <div
                        className="h-full rounded-full bg-gradient-attention"
                        style={{ width: `${(c.value / 32) * 100}%` }}
                      />
                    </div>
                    <span className="font-mono-num text-sm font-semibold text-foreground">
                      {c.value}%
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-border pt-5">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            Открыть детализацию
            <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>
          <Button variant="outline" className="border-border-strong bg-card hover:bg-secondary">
            Лимитная кампания
          </Button>
        </div>
      </div>

      {/* Краткие сигналы */}
      <aside className="surface-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Краткие сигналы
          </h3>
        </div>
        <div className="space-y-1">
          {signals.map((s) => (
            <button
              key={s.label}
              className="group flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors hover:bg-secondary"
            >
              <div
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                  s.tone === "calm" && "bg-calm-soft text-calm",
                  s.tone === "attention" && "bg-attention-soft text-attention",
                )}
              >
                <s.icon className="h-4 w-4" strokeWidth={2.5} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-foreground">{s.label}</div>
                <div className="truncate text-xs text-muted-foreground">{s.value}</div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
            </button>
          ))}
        </div>
      </aside>
    </section>
  );
};
