import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type Segment = { name: string; value: number; color: string };

const dataByRisks: Segment[] = [
  { name: "Операционные ошибки", value: 32, color: "hsl(232 64% 42%)" },
  { name: "Клиентские претензии", value: 21, color: "hsl(258 60% 55%)" },
  { name: "Ошибки обработки операций", value: 18, color: "hsl(35 92% 52%)" },
  { name: "Сбои сверки", value: 12, color: "hsl(190 70% 45%)" },
  { name: "Прочее", value: 17, color: "hsl(220 12% 70%)" },
];

const dataByScenarios: Segment[] = [
  { name: "Ошибки обработки операций", value: 28, color: "hsl(35 92% 52%)" },
  { name: "Сбои каналов обслуживания", value: 22, color: "hsl(232 64% 42%)" },
  { name: "Кибер-инциденты", value: 16, color: "hsl(0 70% 55%)" },
  { name: "Регуляторные изменения", value: 14, color: "hsl(258 60% 55%)" },
  { name: "Прочее", value: 20, color: "hsl(220 12% 70%)" },
];

// Donut SVG
const Donut = ({ data, hovered, onHover }: { data: Segment[]; hovered: number | null; onHover: (i: number | null) => void }) => {
  const size = 220;
  const cx = size / 2;
  const cy = size / 2;
  const r = 88;
  const innerR = 58;

  const total = data.reduce((s, d) => s + d.value, 0);
  let acc = 0;
  const arcs = data.map((d, i) => {
    const startAngle = (acc / total) * Math.PI * 2 - Math.PI / 2;
    acc += d.value;
    const endAngle = (acc / total) * Math.PI * 2 - Math.PI / 2;
    const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;

    const isHovered = hovered === i;
    const rOuter = isHovered ? r + 6 : r;

    const x1 = cx + rOuter * Math.cos(startAngle);
    const y1 = cy + rOuter * Math.sin(startAngle);
    const x2 = cx + rOuter * Math.cos(endAngle);
    const y2 = cy + rOuter * Math.sin(endAngle);
    const x3 = cx + innerR * Math.cos(endAngle);
    const y3 = cy + innerR * Math.sin(endAngle);
    const x4 = cx + innerR * Math.cos(startAngle);
    const y4 = cy + innerR * Math.sin(startAngle);

    const path = `M ${x1} ${y1} A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerR} ${innerR} 0 ${largeArc} 0 ${x4} ${y4} Z`;
    return { path, color: d.color, i };
  });

  const center = hovered !== null ? data[hovered] : null;

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${size} ${size}`} className="h-[220px] w-[220px]">
        {arcs.map((a) => (
          <path
            key={a.i}
            d={a.path}
            fill={a.color}
            onMouseEnter={() => onHover(a.i)}
            onMouseLeave={() => onHover(null)}
            style={{
              transition: "all 200ms cubic-bezier(0.4,0,0.2,1)",
              cursor: "pointer",
              opacity: hovered === null || hovered === a.i ? 1 : 0.5,
            }}
          />
        ))}
      </svg>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
        {center ? (
          <>
            <div className="font-mono-num text-3xl font-bold text-foreground">{center.value}%</div>
            <div className="mt-1 max-w-[110px] text-[10px] uppercase tracking-wider text-muted-foreground">
              {center.name}
            </div>
          </>
        ) : (
          <>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">всего</div>
            <div className="font-mono-num text-3xl font-bold text-foreground">100%</div>
            <div className="mt-1 text-[10px] text-muted-foreground">наведите</div>
          </>
        )}
      </div>
    </div>
  );
};

export const ContributionChart = () => {
  const [mode, setMode] = useState<"risks" | "scenarios">("risks");
  const [hovered, setHovered] = useState<number | null>(null);
  const data = useMemo(() => (mode === "risks" ? dataByRisks : dataByScenarios), [mode]);

  return (
    <div className="surface-card flex flex-col p-6">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-foreground">Вклад в утилизацию</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">Что больше всего влияет на лимит</p>
        </div>
        <div className="inline-flex rounded-lg border border-border bg-secondary/60 p-0.5">
          {(["risks", "scenarios"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={cn(
                "rounded-md px-3 py-1 text-xs font-medium transition-all",
                mode === m ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {m === "risks" ? "По рискам" : "По сценариям"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-center lg:gap-7">
        <Donut data={data} hovered={hovered} onHover={setHovered} />

        <ul className="flex w-full flex-1 flex-col gap-1.5">
          {data.map((d, i) => (
            <li key={d.name}>
              <button
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors",
                  hovered === i ? "bg-secondary" : "hover:bg-secondary/60",
                )}
              >
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-sm"
                  style={{ backgroundColor: d.color }}
                />
                <span className="min-w-0 flex-1 truncate text-sm text-foreground">{d.name}</span>
                <span className="font-mono-num text-sm font-semibold text-foreground">{d.value}%</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
