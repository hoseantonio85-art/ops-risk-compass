import { useState } from "react";
import { ArrowUp, ArrowDown, ArrowRight, TrendingUp, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";

type CategoryKey = "direct" | "indirect" | "credit" | "forecast";

type DirectCard = {
  key: CategoryKey;
  kind: "direct";
  category: string;
  fact: string;
  factRaw: number; // млн ₽
  limit: number; // млн ₽
};

type ForecastCard = {
  key: CategoryKey;
  kind: "forecast";
  category: string;
  forecast: string;
  trend: number[]; // 14 точек
  deltaMln: number;
};

type CardModel = DirectCard | ForecastCard;

const cards: CardModel[] = [
  { key: "direct", kind: "direct", category: "Прямые потери", fact: "412", factRaw: 412, limit: 600 },
  { key: "indirect", kind: "direct", category: "Косвенные потери", fact: "186", factRaw: 186, limit: 250 },
  { key: "credit", kind: "direct", category: "Потери в кредитовании", fact: "222", factRaw: 222, limit: 240 },
  {
    key: "forecast",
    kind: "forecast",
    category: "Прогноз потерь",
    forecast: "874",
    trend: [820, 818, 825, 830, 828, 835, 840, 845, 850, 855, 860, 865, 872, 874],
    deltaMln: 2.1,
  },
];

const monthly: Record<Exclude<CategoryKey, "forecast">, { m: string; v: number }[]> = {
  direct: [
    { m: "Янв", v: 28 }, { m: "Фев", v: 32 }, { m: "Мар", v: 41 }, { m: "Апр", v: 36 },
    { m: "Май", v: 44 }, { m: "Июн", v: 39 }, { m: "Июл", v: 47 }, { m: "Авг", v: 52 },
    { m: "Сен", v: 48 }, { m: "Окт", v: 45 }, { m: "Ноя", v: 0 }, { m: "Дек", v: 0 },
  ],
  indirect: [
    { m: "Янв", v: 12 }, { m: "Фев", v: 14 }, { m: "Мар", v: 18 }, { m: "Апр", v: 16 },
    { m: "Май", v: 19 }, { m: "Июн", v: 17 }, { m: "Июл", v: 21 }, { m: "Авг", v: 23 },
    { m: "Сен", v: 22 }, { m: "Окт", v: 24 }, { m: "Ноя", v: 0 }, { m: "Дек", v: 0 },
  ],
  credit: [
    { m: "Янв", v: 18 }, { m: "Фев", v: 21 }, { m: "Мар", v: 24 }, { m: "Апр", v: 22 },
    { m: "Май", v: 26 }, { m: "Июн", v: 23 }, { m: "Июл", v: 25 }, { m: "Авг", v: 28 },
    { m: "Сен", v: 27 }, { m: "Окт", v: 28 }, { m: "Ноя", v: 0 }, { m: "Дек", v: 0 },
  ],
};

const incidents: Record<Exclude<CategoryKey, "forecast">, { id: string; date: string; title: string; sum: string; status: string }[]> = {
  direct: [
    { id: "INC-2841", date: "28.04", title: "Сбой процессинга карт, 4 ч простоя", sum: "38.4", status: "В работе" },
    { id: "INC-2812", date: "21.04", title: "Двойное списание, кампания «Весна»", sum: "21.7", status: "Закрыт" },
    { id: "INC-2790", date: "14.04", title: "Ошибка тарификации SMS-уведомлений", sum: "17.2", status: "В работе" },
    { id: "INC-2755", date: "06.04", title: "Сбой POS-терминалов, регион СЗ", sum: "14.9", status: "Закрыт" },
    { id: "INC-2731", date: "01.04", title: "Технический овердрафт по корсчёту", sum: "12.3", status: "Закрыт" },
  ],
  indirect: [
    { id: "INC-2820", date: "24.04", title: "Штраф ЦБ за нарушение сроков отчётности", sum: "9.8", status: "Закрыт" },
    { id: "INC-2802", date: "18.04", title: "Расходы на коммуникации при сбое", sum: "6.4", status: "Закрыт" },
    { id: "INC-2778", date: "11.04", title: "Юридические издержки по спору с вендором", sum: "5.1", status: "В работе" },
    { id: "INC-2744", date: "03.04", title: "Сверхурочные ИТ при инциденте процессинга", sum: "3.8", status: "Закрыт" },
    { id: "INC-2719", date: "28.03", title: "Аудит регуляторных требований, доплата", sum: "2.9", status: "Закрыт" },
  ],
  credit: [
    { id: "INC-2835", date: "27.04", title: "Ошибка скоринга, выдача необеспеч. кредитов", sum: "31.2", status: "В работе" },
    { id: "INC-2808", date: "19.04", title: "Сбой проверки залогов в АБС", sum: "18.6", status: "В работе" },
    { id: "INC-2786", date: "12.04", title: "Некорректная классификация заёмщика SME", sum: "11.4", status: "Закрыт" },
    { id: "INC-2762", date: "07.04", title: "Двойная выдача по реструктуризации", sum: "7.9", status: "Закрыт" },
    { id: "INC-2740", date: "02.04", title: "Просрочка фиксации обеспечения", sum: "5.2", status: "Закрыт" },
  ],
};

const forecastFactors = [
  { title: "Новый инцидент в кредитном портфеле", delta: "+1.4 млн", note: "INC-2835, скоринг" },
  { title: "Пересчёт сценария «Сбой процессинга»", delta: "+0.7 млн", note: "вероятность ↑ на 4 п.п." },
  { title: "Закрытие меры по антифроду", delta: "−0.0 млн", note: "эффект отложен на май" },
];

const toneFor = (pct: number) => {
  if (pct >= 85) return { ring: "hsl(var(--critical))", text: "text-critical", chip: "bg-critical/10 text-critical" };
  if (pct >= 60) return { ring: "hsl(var(--attention))", text: "text-attention", chip: "bg-attention/10 text-attention" };
  return { ring: "hsl(var(--calm))", text: "text-calm", chip: "bg-calm/10 text-calm" };
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
        <circle cx={size / 2} cy={size / 2} r={r} stroke="hsl(var(--neutral-soft))" strokeWidth={stroke} fill="none" />
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
  const points = data.map((v, i) => `${i * step},${h - ((v - min) / range) * h}`).join(" ");
  const color = rising ? "hsl(var(--attention))" : "hsl(var(--calm))";
  return (
    <svg width={w} height={h} className="overflow-visible">
      <polyline fill="none" stroke={color} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" points={points} />
      <circle cx={(data.length - 1) * step} cy={h - ((data[data.length - 1] - min) / range) * h} r={2.5} fill={color} />
    </svg>
  );
};

const DirectDrawerBody = ({ card }: { card: DirectCard }) => {
  const pct = (card.factRaw / card.limit) * 100;
  const tone = toneFor(pct);
  const monthLimit = card.limit / 12;
  const data = monthly[card.key as Exclude<CategoryKey, "forecast">];
  const list = incidents[card.key as Exclude<CategoryKey, "forecast">];

  return (
    <div className="space-y-6">
      {/* Big numbers */}
      <div className="flex items-end justify-between gap-6 rounded-xl border border-border bg-secondary/40 p-5">
        <div>
          <div className="text-xs uppercase tracking-wide text-muted-foreground">Факт потерь · YTD</div>
          <div className="mt-1 font-mono-num text-4xl font-bold text-foreground">
            {card.fact}
            <span className="ml-1 text-base font-medium text-muted-foreground">млн ₽</span>
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            из <span className="font-mono-num font-semibold text-foreground">{card.limit}</span> млн ₽ годового лимита
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <Donut pct={pct} color={tone.ring} />
          <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold", tone.chip)}>
            {pct >= 85 ? "Критично" : pct >= 60 ? "Внимание" : "В норме"}
          </span>
        </div>
      </div>

      {/* Monthly dynamics */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-foreground">Динамика по месяцам · 12 мес</h4>
          <span className="text-xs text-muted-foreground">
            Линия — пропорц. лимит {monthLimit.toFixed(0)} млн/мес
          </span>
        </div>
        <div className="h-48 w-full rounded-xl border border-border bg-card p-3">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="m" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                formatter={(v: number) => [`${v} млн ₽`, "Потери"]}
              />
              <ReferenceLine y={monthLimit} stroke="hsl(var(--attention))" strokeDasharray="4 4" />
              <Bar dataKey="v" fill={tone.ring} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top incidents */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-foreground">Топ инцидентов в категории</h4>
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          {list.map((it, i) => (
            <button
              key={it.id}
              type="button"
              className={cn(
                "flex w-full items-center gap-4 px-4 py-3 text-left transition-colors hover:bg-secondary/60",
                i !== list.length - 1 && "border-b border-border",
              )}
            >
              <span className="font-mono-num text-xs text-muted-foreground w-10">{it.date}</span>
              <span className="font-mono-num text-[11px] font-semibold text-muted-foreground w-20">{it.id}</span>
              <span className="flex-1 truncate text-sm text-foreground">{it.title}</span>
              <span className="font-mono-num text-sm font-semibold text-foreground">{it.sum} млн</span>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[11px] font-medium",
                  it.status === "В работе" ? "bg-attention/10 text-attention" : "bg-muted text-muted-foreground",
                )}
              >
                {it.status}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button>
          Открыть реестр инцидентов
          <ArrowRight className="ml-1.5 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

const ForecastDrawerBody = ({ card }: { card: ForecastCard }) => {
  const rising = card.deltaMln > 0;
  const series = card.trend.map((v, i) => ({ d: `D${i + 1}`, v }));
  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-6 rounded-xl border border-border bg-secondary/40 p-5">
        <div>
          <div className="text-xs uppercase tracking-wide text-muted-foreground">Прогноз на конец года</div>
          <div className="mt-1 font-mono-num text-4xl font-bold text-foreground">
            {card.forecast}
            <span className="ml-1 text-base font-medium text-muted-foreground">млн ₽</span>
          </div>
          <div className="mt-1 text-xs text-muted-foreground">модель пересчитывается ежедневно</div>
        </div>
        <div
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold",
            rising ? "bg-attention/10 text-attention" : "bg-calm/10 text-calm",
          )}
        >
          {rising ? <ArrowUp className="h-3.5 w-3.5" strokeWidth={3} /> : <ArrowDown className="h-3.5 w-3.5" strokeWidth={3} />}
          {rising ? "+" : "−"}
          {Math.abs(card.deltaMln).toFixed(1)} млн ₽ · к вчера
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-foreground">Динамика прогноза · 14 дней</h4>
        <div className="h-44 w-full rounded-xl border border-border bg-card p-3">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={series} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="d" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} domain={["dataMin - 5", "dataMax + 5"]} />
              <Tooltip
                contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                formatter={(v: number) => [`${v} млн ₽`, "Прогноз"]}
              />
              <Line type="monotone" dataKey="v" stroke="hsl(var(--attention))" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-foreground">Что повлияло на прогноз сегодня</h4>
        <div className="space-y-2">
          {forecastFactors.map((f) => (
            <div key={f.title} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-attention/10">
                <AlertTriangle className="h-4 w-4 text-attention" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium text-foreground">{f.title}</div>
                <div className="text-xs text-muted-foreground">{f.note}</div>
              </div>
              <span className="font-mono-num text-sm font-semibold text-foreground">{f.delta}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button>
          <TrendingUp className="mr-1.5 h-4 w-4" />
          Открыть модель прогноза
        </Button>
      </div>
    </div>
  );
};

export const LimitCards = () => {
  const [openKey, setOpenKey] = useState<CategoryKey | null>(null);
  const active = cards.find((c) => c.key === openKey) || null;

  return (
    <>
      <section aria-label="Утилизация лимита по категориям" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => {
          if (c.kind === "direct") {
            const pct = (c.factRaw / c.limit) * 100;
            const tone = toneFor(pct);
            return (
              <button
                key={c.key}
                type="button"
                onClick={() => setOpenKey(c.key)}
                aria-label={`${c.category}: открыть детализацию`}
                className="surface-card group flex flex-col justify-between p-5 text-left transition-all hover:-translate-y-0.5 hover:shadow-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
                  <span className="inline-flex items-center gap-0.5 text-foreground opacity-0 transition-opacity group-hover:opacity-100">
                    Детали <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </button>
            );
          }
          const rising = c.deltaMln > 0;
          return (
            <button
              key={c.key}
              type="button"
              onClick={() => setOpenKey(c.key)}
              aria-label={`${c.category}: открыть детализацию`}
              className="surface-card group flex flex-col justify-between p-5 text-left transition-all hover:-translate-y-0.5 hover:shadow-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
            </button>
          );
        })}
      </section>

      <Sheet open={!!openKey} onOpenChange={(o) => !o && setOpenKey(null)}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-xl">
          {active && (
            <>
              <SheetHeader className="mb-6">
                <SheetTitle>{active.category}</SheetTitle>
                <SheetDescription>
                  {active.kind === "direct"
                    ? "Детализация по категории потерь · динамика и инциденты"
                    : "Прогнозная модель потерь · факторы и динамика"}
                </SheetDescription>
              </SheetHeader>
              {active.kind === "direct" ? (
                <DirectDrawerBody card={active} />
              ) : (
                <ForecastDrawerBody card={active} />
              )}
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};
