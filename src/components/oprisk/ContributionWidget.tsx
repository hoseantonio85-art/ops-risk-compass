import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";

type Segment = {
  id: string;
  name: string;
  pct: number;
  mln: number;
  color: string;
  byMonth: { m: string; v: number }[];
  incidents: { name: string; date: string; sum: number }[];
};

const scenarios: Segment[] = [
  {
    id: "s1",
    name: "Ошибки обработки операций",
    pct: 28,
    mln: 245,
    color: "hsl(var(--chart-1))",
    byMonth: [
      { m: "Янв", v: 18 }, { m: "Фев", v: 22 }, { m: "Мар", v: 19 }, { m: "Апр", v: 24 },
      { m: "Май", v: 21 }, { m: "Июн", v: 26 }, { m: "Июл", v: 23 }, { m: "Авг", v: 28 },
      { m: "Сен", v: 20 }, { m: "Окт", v: 17 }, { m: "Ноя", v: 15 }, { m: "Дек", v: 12 },
    ],
    incidents: [
      { name: "Двойное списание по картам", date: "12 окт", sum: 18.4 },
      { name: "Сбой обработки в SWIFT", date: "08 окт", sum: 12.1 },
      { name: "Ошибка курса валюты", date: "01 окт", sum: 9.8 },
      { name: "Некорректный комиссионный сбор", date: "27 сен", sum: 7.3 },
      { name: "Зависание платежей в очереди", date: "21 сен", sum: 5.9 },
    ],
  },
  {
    id: "s2",
    name: "Сбои каналов обслуживания",
    pct: 22,
    mln: 192,
    color: "hsl(var(--chart-2))",
    byMonth: [
      { m: "Янв", v: 14 }, { m: "Фев", v: 16 }, { m: "Мар", v: 18 }, { m: "Апр", v: 15 },
      { m: "Май", v: 19 }, { m: "Июн", v: 22 }, { m: "Июл", v: 17 }, { m: "Авг", v: 14 },
      { m: "Сен", v: 16 }, { m: "Окт", v: 18 }, { m: "Ноя", v: 12 }, { m: "Дек", v: 11 },
    ],
    incidents: [
      { name: "Недоступность мобильного банка 4ч", date: "14 окт", sum: 22.0 },
      { name: "Сбой колл-центра", date: "06 окт", sum: 8.5 },
      { name: "Простой банкоматной сети", date: "29 сен", sum: 14.2 },
      { name: "Ошибка авторизации в ДБО", date: "18 сен", sum: 6.1 },
    ],
  },
  {
    id: "s3",
    name: "Кибер-инциденты",
    pct: 16,
    mln: 140,
    color: "hsl(var(--chart-3))",
    byMonth: [
      { m: "Янв", v: 8 }, { m: "Фев", v: 9 }, { m: "Мар", v: 12 }, { m: "Апр", v: 14 },
      { m: "Май", v: 11 }, { m: "Июн", v: 15 }, { m: "Июл", v: 13 }, { m: "Авг", v: 10 },
      { m: "Сен", v: 12 }, { m: "Окт", v: 16 }, { m: "Ноя", v: 11 }, { m: "Дек", v: 9 },
    ],
    incidents: [
      { name: "Фишинговая кампания против клиентов", date: "10 окт", sum: 11.4 },
      { name: "DDoS на платёжный шлюз", date: "02 окт", sum: 8.7 },
      { name: "Утечка данных подрядчика", date: "22 сен", sum: 19.0 },
    ],
  },
  {
    id: "s4",
    name: "Регуляторные изменения",
    pct: 14,
    mln: 122,
    color: "hsl(var(--chart-4))",
    byMonth: [
      { m: "Янв", v: 6 }, { m: "Фев", v: 8 }, { m: "Мар", v: 10 }, { m: "Апр", v: 12 },
      { m: "Май", v: 9 }, { m: "Июн", v: 11 }, { m: "Июл", v: 14 }, { m: "Авг", v: 12 },
      { m: "Сен", v: 10 }, { m: "Окт", v: 13 }, { m: "Ноя", v: 8 }, { m: "Дек", v: 9 },
    ],
    incidents: [
      { name: "Доработка под 115-ФЗ", date: "11 окт", sum: 14.0 },
      { name: "Штраф ЦБ по отчётности", date: "30 сен", sum: 9.2 },
    ],
  },
  {
    id: "s5",
    name: "Мошенничество",
    pct: 8,
    mln: 70,
    color: "hsl(var(--chart-5))",
    byMonth: [
      { m: "Янв", v: 4 }, { m: "Фев", v: 5 }, { m: "Мар", v: 6 }, { m: "Апр", v: 7 },
      { m: "Май", v: 5 }, { m: "Июн", v: 8 }, { m: "Июл", v: 6 }, { m: "Авг", v: 7 },
      { m: "Сен", v: 5 }, { m: "Окт", v: 6 }, { m: "Ноя", v: 4 }, { m: "Дек", v: 7 },
    ],
    incidents: [
      { name: "Социнженерия — переводы", date: "13 окт", sum: 8.4 },
      { name: "Поддельные документы по кредиту", date: "04 окт", sum: 6.2 },
    ],
  },
  {
    id: "s6",
    name: "Прочее",
    pct: 12,
    mln: 105,
    color: "hsl(var(--chart-6))",
    byMonth: [
      { m: "Янв", v: 6 }, { m: "Фев", v: 7 }, { m: "Мар", v: 9 }, { m: "Апр", v: 10 },
      { m: "Май", v: 8 }, { m: "Июн", v: 9 }, { m: "Июл", v: 11 }, { m: "Авг", v: 10 },
      { m: "Сен", v: 8 }, { m: "Окт", v: 9 }, { m: "Ноя", v: 7 }, { m: "Дек", v: 8 },
    ],
    incidents: [
      { name: "Прочие операционные потери", date: "—", sum: 0 },
    ],
  },
];

const risks: Segment[] = [
  {
    id: "r1",
    name: "Операционные ошибки",
    pct: 32,
    mln: 280,
    color: "hsl(var(--chart-2))",
    byMonth: [
      { m: "Янв", v: 20 }, { m: "Фев", v: 22 }, { m: "Мар", v: 24 }, { m: "Апр", v: 26 },
      { m: "Май", v: 23 }, { m: "Июн", v: 28 }, { m: "Июл", v: 25 }, { m: "Авг", v: 27 },
      { m: "Сен", v: 22 }, { m: "Окт", v: 19 }, { m: "Ноя", v: 16 }, { m: "Дек", v: 14 },
    ],
    incidents: [
      { name: "Ошибка ввода реквизитов", date: "15 окт", sum: 14.2 },
      { name: "Неверная разноска платежа", date: "09 окт", sum: 11.0 },
      { name: "Дубль операции", date: "03 окт", sum: 8.6 },
    ],
  },
  {
    id: "r2",
    name: "Клиентские претензии",
    pct: 21,
    mln: 184,
    color: "hsl(var(--chart-4))",
    byMonth: [
      { m: "Янв", v: 12 }, { m: "Фев", v: 14 }, { m: "Мар", v: 16 }, { m: "Апр", v: 18 },
      { m: "Май", v: 15 }, { m: "Июн", v: 19 }, { m: "Июл", v: 17 }, { m: "Авг", v: 16 },
      { m: "Сен", v: 14 }, { m: "Окт", v: 18 }, { m: "Ноя", v: 13 }, { m: "Дек", v: 12 },
    ],
    incidents: [
      { name: "Массовые жалобы по комиссиям", date: "12 окт", sum: 9.4 },
      { name: "Иск по овердрафту", date: "07 окт", sum: 6.8 },
    ],
  },
  {
    id: "r3",
    name: "Ошибки обработки",
    pct: 18,
    mln: 158,
    color: "hsl(var(--chart-1))",
    byMonth: [
      { m: "Янв", v: 10 }, { m: "Фев", v: 12 }, { m: "Мар", v: 14 }, { m: "Апр", v: 16 },
      { m: "Май", v: 13 }, { m: "Июн", v: 17 }, { m: "Июл", v: 15 }, { m: "Авг", v: 14 },
      { m: "Сен", v: 12 }, { m: "Окт", v: 15 }, { m: "Ноя", v: 11 }, { m: "Дек", v: 9 },
    ],
    incidents: [
      { name: "Сбой пакетной обработки", date: "11 окт", sum: 12.0 },
    ],
  },
  {
    id: "r4",
    name: "Сбои сверки",
    pct: 12,
    mln: 105,
    color: "hsl(var(--chart-5))",
    byMonth: [
      { m: "Янв", v: 6 }, { m: "Фев", v: 8 }, { m: "Мар", v: 9 }, { m: "Апр", v: 11 },
      { m: "Май", v: 9 }, { m: "Июн", v: 12 }, { m: "Июл", v: 10 }, { m: "Авг", v: 9 },
      { m: "Сен", v: 8 }, { m: "Окт", v: 10 }, { m: "Ноя", v: 7 }, { m: "Дек", v: 6 },
    ],
    incidents: [
      { name: "Расхождение по карточным операциям", date: "08 окт", sum: 7.4 },
    ],
  },
  {
    id: "r5",
    name: "Кадровые риски",
    pct: 7,
    mln: 61,
    color: "hsl(var(--chart-3))",
    byMonth: [
      { m: "Янв", v: 3 }, { m: "Фев", v: 4 }, { m: "Мар", v: 5 }, { m: "Апр", v: 6 },
      { m: "Май", v: 4 }, { m: "Июн", v: 7 }, { m: "Июл", v: 5 }, { m: "Авг", v: 6 },
      { m: "Сен", v: 4 }, { m: "Окт", v: 5 }, { m: "Ноя", v: 3 }, { m: "Дек", v: 4 },
    ],
    incidents: [
      { name: "Уход ключевого специалиста", date: "06 окт", sum: 4.0 },
    ],
  },
  {
    id: "r6",
    name: "Прочее",
    pct: 10,
    mln: 88,
    color: "hsl(var(--chart-6))",
    byMonth: [
      { m: "Янв", v: 5 }, { m: "Фев", v: 6 }, { m: "Мар", v: 8 }, { m: "Апр", v: 9 },
      { m: "Май", v: 7 }, { m: "Июн", v: 8 }, { m: "Июл", v: 10 }, { m: "Авг", v: 9 },
      { m: "Сен", v: 7 }, { m: "Окт", v: 8 }, { m: "Ноя", v: 6 }, { m: "Дек", v: 7 },
    ],
    incidents: [
      { name: "Прочие риски", date: "—", sum: 0 },
    ],
  },
];

export const ContributionWidget = () => {
  const [mode, setMode] = useState<"scenarios" | "risks">("scenarios");
  const [hovered, setHovered] = useState<number | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const data = useMemo(() => (mode === "scenarios" ? scenarios : risks), [mode]);
  const selected = selectedId ? data.find((d) => d.id === selectedId) : null;
  const total = useMemo(() => data.reduce((s, d) => s + d.pct, 0), [data]);

  const switchMode = (m: "scenarios" | "risks") => {
    setMode(m);
    setSelectedId(null);
    setHovered(null);
  };

  return (
    <div className="surface-card flex h-full flex-col p-6">
      <div className="mb-1 flex items-baseline justify-between gap-3">
        <h3 className="text-base font-semibold text-foreground">Вклад в утилизацию</h3>
        <span className="text-xs text-muted-foreground">доля · млн ₽</span>
      </div>
      <p className="mb-4 text-xs text-muted-foreground">
        Что больше всего влияет на лимит — клик по сегменту откроет разбор
      </p>

      <div className="mb-4 inline-flex w-fit rounded-full bg-secondary p-1">
        {(["scenarios", "risks"] as const).map((m) => (
          <button
            key={m}
            onClick={() => switchMode(m)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition-all",
              mode === m ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {m === "scenarios" ? "По сценариям" : "По рискам"}
          </button>
        ))}
      </div>

      {/* Stacked horizontal bar */}
      <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-secondary">
        {data.map((d, i) => (
          <button
            key={d.id}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => setSelectedId(d.id)}
            aria-label={`${d.name} · ${d.pct}%`}
            className="h-full transition-opacity"
            style={{
              width: `${(d.pct / total) * 100}%`,
              backgroundColor: d.color,
              opacity: hovered === null || hovered === i ? 1 : 0.4,
            }}
          />
        ))}
      </div>

      <ul className="mt-4 flex w-full flex-1 flex-col gap-0.5">
        {data.map((d, i) => (
          <li key={d.id}>
            <button
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => setSelectedId(d.id)}
              className={cn(
                "group flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-colors",
                hovered === i ? "bg-secondary" : "hover:bg-secondary/70",
              )}
            >
              <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ backgroundColor: d.color }} />
              <span className="min-w-0 flex-1 truncate text-sm text-foreground">{d.name}</span>
              <span className="text-xs text-muted-foreground">{d.mln}</span>
              <span className="w-9 text-right text-sm font-semibold tabular-nums text-foreground">{d.pct}%</span>
            </button>
          </li>
        ))}
      </ul>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelectedId(null)}>
        <SheetContent side="right" className="w-[92vw] overflow-y-auto p-0 sm:max-w-[640px]"><div className="p-8 space-y-6">
          {selected && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 shrink-0 rounded-sm" style={{ backgroundColor: selected.color }} />
                  <SheetTitle className="text-base">{selected.name}</SheetTitle>
                </div>
                <SheetDescription className="flex items-baseline gap-2 pt-1">
                  <span className="text-2xl font-bold text-foreground">{selected.mln}</span>
                  <span className="text-xs text-muted-foreground">млн ₽ · {selected.pct}% вклад в утилизацию</span>
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6">
                <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Потери по месяцам
                </div>
                <div className="h-[160px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={selected.byMonth} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
                      <XAxis
                        dataKey="m"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                        interval={0}
                      />
                      <Tooltip
                        cursor={{ fill: "hsl(var(--secondary))" }}
                        contentStyle={{
                          background: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: 8,
                          fontSize: 12,
                        }}
                        formatter={(v: number) => [`${v} млн ₽`, "Потери"]}
                      />
                      <Bar dataKey="v" radius={[4, 4, 0, 0]}>
                        {selected.byMonth.map((_, idx) => (
                          <Cell key={idx} fill={selected.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="mt-6">
                <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Топ инцидентов категории
                </div>
                <ul className="divide-y divide-border rounded-xl bg-card">
                  {selected.incidents.slice(0, 5).map((inc, idx) => (
                    <li
                      key={idx}
                      className="flex items-center justify-between gap-2 px-3 py-2 text-xs"
                    >
                      <span className="min-w-0 flex-1 truncate text-foreground">{inc.name}</span>
                      <span className="text-muted-foreground">{inc.date}</span>
                      <span className="w-16 text-right font-semibold text-foreground">
                        {inc.sum.toFixed(1)} млн
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <button className="mt-6 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-secondary px-3 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary/70">
                Все инциденты этой категории
                <ArrowRight className="h-4 w-4" />
              </button>
            </>
          )}
        </div></SheetContent>
      </Sheet>
    </div>
  );
};
