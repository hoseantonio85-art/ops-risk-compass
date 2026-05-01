import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

type DirectCard = {
  kind: "direct";
  category: string;
  fact: string;
  factRaw: number; // млн ₽
  limit: number; // млн ₽
};

type ForecastCard = {
  kind: "forecast";
  category: string;
  forecast: string;
  trend: number[]; // 14 точек
  deltaMln: number; // дельта к вчера, млн ₽ (+ растёт / − падает)
};

const cards: (DirectCard | ForecastCard)[] = [
  {
    kind: "direct",
    category: "Прямые потери",
    fact: "412",
    factRaw: 412,
    limit: 600,
  },
  {
    kind: "direct",
    category: "Косвенные потери",
    fact: "186",
    factRaw: 186,
    limit: 250,
  },
  {
    kind: "direct",
    category: "Потери в кредитовании",
    fact: "222",
    factRaw: 222,
    limit: 240,
  },
  {
    kind: "forecast",
    category: "Прогноз потерь",
    forecast: "874",
    trend: [820, 818, 825, 830, 828, 835, 840, 845, 850, 855, 860, 865, 872, 874],
    deltaMln: 2.1,
  },
];

const toneFor = (pct: number) => {
  if (pct >= 85) return { ring: "hsl(var(--critical))", text: "text-critical" };
  if (pct >= 60) return { ring: "hsl(var(--attention))", text: "text-attention" };
  return { ring: "hsl(var(--calm))", text: "text-calm" };
};

const Donut = ({ pct, color }: { pct: number; color: string }) => {
  const size = 64;
  const stroke = 7;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - Math.min(100, pct) / 100);
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="hsl(var(--neutral-soft))"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 800ms cubic-bezier(0.4,0,0.2,1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-mono-num text-xs font-bold text-foreground">{Math.round(pct)}%</span>
      </div>
    </div>
  );
};

const Sparkline = ({ data, rising }: { data: number[]; rising: boolean }) => {
  const w = 80;
  const h = 32;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = w / (data.length - 1);
  const points = data
    .map((v, i) => `${i * step},${h - ((v - min) / range) * h}`)
    .join(" ");
  const color = rising ? "hsl(var(--attention))" : "hsl(var(--calm))";
  return (
    <svg width={w} height={h} className="overflow-visible">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
      <circle
        cx={(data.length - 1) * step}
        cy={h - ((data[data.length - 1] - min) / range) * h}
        r={2.5}
        fill={color}
      />
    </svg>
  );
};

export const LimitCards = () => {
  return (
    <section aria-label="Утилизация лимита по категориям" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c) => {
        if (c.kind === "direct") {
          const pct = (c.factRaw / c.limit) * 100;
          const tone = toneFor(pct);
          return (
            <div
              key={c.category}
              className="surface-card flex flex-col justify-between p-5 transition-all hover:-translate-y-0.5 hover:shadow-elevated"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {c.category}
                  </div>
                  <div className="mt-2 font-mono-num text-3xl font-bold leading-none text-foreground">
                    {c.fact}
                    <span className="ml-1 text-base font-medium text-muted-foreground">млн ₽</span>
                  </div>
                </div>
                <Donut pct={pct} color={tone.ring} />
              </div>
              <div className="mt-4 flex items-center justify-between gap-2 text-xs text-muted-foreground">
                <span>
                  из <span className="font-mono-num font-semibold text-foreground">{c.limit}</span> млн ₽ лимита
                </span>
                <span className="text-[11px]">Год (янв–дек)</span>
              </div>
            </div>
          );
        }
        const rising = c.deltaMln > 0;
        return (
          <div
            key={c.category}
            className="surface-card flex flex-col justify-between p-5 transition-all hover:-translate-y-0.5 hover:shadow-elevated"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {c.category}
                </div>
                <div className="mt-2 font-mono-num text-3xl font-bold leading-none text-foreground">
                  {c.forecast}
                  <span className="ml-1 text-base font-medium text-muted-foreground">млн ₽</span>
                </div>
              </div>
              <Sparkline data={c.trend} rising={rising} />
            </div>
            <div className="mt-4 flex items-center justify-between gap-2 text-xs">
              <span className="text-muted-foreground">прогноз на конец года</span>
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 font-mono-num font-semibold",
                  rising ? "text-attention" : "text-calm",
                )}
              >
                {rising ? <ArrowUp className="h-3 w-3" strokeWidth={3} /> : <ArrowDown className="h-3 w-3" strokeWidth={3} />}
                {rising ? "+" : "−"}
                {Math.abs(c.deltaMln).toFixed(1)} млн
              </span>
            </div>
          </div>
        );
      })}
    </section>
  );
};
