import { useState } from "react";
import { cn } from "@/lib/utils";

// 4x4 матрица: вероятность (Y, низ→верх) × влияние (X, лево→право)
// Каждая ячейка: count рисков, sumLoss (млн ₽), top риски
type Cell = { count: number; loss: number; top: string[] };

// Строки сверху вниз: Очень высокая → Очень низкая
const probabilityLabels = ["Очень высокая", "Высокая", "Средняя", "Низкая"];
const impactLabels = ["Низкое", "Среднее", "Высокое", "Критическое"];

const grid: Cell[][] = [
  // Очень высокая вероятность
  [{ count: 1, loss: 2.1, top: ["Регуляторные изменения"] },
   { count: 2, loss: 8.4, top: ["Сбои каналов", "Ошибки тарификации"] },
   { count: 3, loss: 24.6, top: ["Операционные ошибки", "Клиентские претензии", "Сверка"] },
   { count: 1, loss: 18.2, top: ["Ошибки обработки операций"] }],
  // Высокая
  [{ count: 2, loss: 3.8, top: ["Доступы", "Резервирование"] },
   { count: 4, loss: 12.5, top: ["AML-комплаенс", "BPM", "Журналы", "Сторонние API"] },
   { count: 3, loss: 16.7, top: ["Кибер-инциденты", "Отчётность", "Кадры"] },
   { count: 1, loss: 9.4, top: ["Сбои core-системы"] }],
  // Средняя
  [{ count: 3, loss: 1.2, top: ["Документооборот", "Тестовые среды", "Печать"] },
   { count: 5, loss: 6.8, top: ["Backup", "Обучение", "Контракты", "Поставки", "Митигация"] },
   { count: 2, loss: 7.1, top: ["Релизы", "Мониторинг"] },
   { count: 0, loss: 0, top: [] }],
  // Низкая
  [{ count: 2, loss: 0.4, top: ["Архив", "Лицензии"] },
   { count: 1, loss: 0.9, top: ["Маркетинговые материалы"] },
   { count: 0, loss: 0, top: [] },
   { count: 0, loss: 0, top: [] }],
];

// Уровень тона ячейки: пересечение probability × impact
const toneFor = (rowIdx: number, colIdx: number) => {
  // 0,0 = высш.вер × низ.вл; берём score
  const probScore = 4 - rowIdx; // 4..1
  const impScore = colIdx + 1;  // 1..4
  const score = probScore * impScore; // 1..16
  if (score >= 12) return "critical";
  if (score >= 8) return "high";
  if (score >= 4) return "medium";
  return "low";
};

const toneStyles = {
  low: "bg-neutral-soft hover:bg-neutral-soft/80 text-muted-foreground",
  medium: "bg-attention-soft hover:bg-attention/20 text-attention",
  high: "bg-attention/30 hover:bg-attention/40 text-attention",
  critical: "bg-critical-soft hover:bg-critical/20 text-critical",
} as const;

const emptyStyles = "bg-card text-muted-foreground/40 border border-dashed border-border";

export const RiskHeatmap = () => {
  const [hovered, setHovered] = useState<{ r: number; c: number } | null>(null);
  const hoveredCell = hovered ? grid[hovered.r][hovered.c] : null;

  return (
    <div className="surface-card flex flex-col p-6">
      <div className="mb-1 flex items-baseline justify-between gap-3">
        <h3 className="text-base font-semibold text-foreground">Карта рисков</h3>
        <span className="text-xs text-muted-foreground">кол-во · потери, млн ₽</span>
      </div>
      <p className="mb-5 text-xs text-muted-foreground">
        Вероятность × Влияние · правый верх — максимальный риск
      </p>

      <div className="flex gap-3">
        {/* Y-axis labels */}
        <div className="flex flex-col justify-between py-1 pr-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          {probabilityLabels.map((l) => (
            <span key={l} className="flex h-[60px] items-center text-right leading-tight">
              {l}
            </span>
          ))}
        </div>

        <div className="relative flex-1">
          <div className="grid grid-cols-4 gap-1.5">
            {grid.map((row, r) =>
              row.map((cell, c) => {
                const tone = toneFor(r, c);
                const isEmpty = cell.count === 0;
                const isHovered = hovered?.r === r && hovered?.c === c;
                const isHotZone = tone === "critical" && !isEmpty;
                return (
                  <button
                    key={`${r}-${c}`}
                    onMouseEnter={() => setHovered({ r, c })}
                    onMouseLeave={() => setHovered(null)}
                    title={
                      !isEmpty
                        ? `Перейти к рискам · ${probabilityLabels[r]} × ${impactLabels[c]}`
                        : undefined
                    }
                    className={cn(
                      "relative flex h-[60px] flex-col items-center justify-center rounded-md transition-all",
                      isEmpty ? emptyStyles : toneStyles[tone],
                      isHotZone && "ring-2 ring-critical/60 ring-offset-1 ring-offset-card",
                      isHovered && !isEmpty && "ring-2 ring-offset-2 ring-offset-card ring-primary/40 scale-[1.04] z-10",
                    )}
                  >
                    {isEmpty ? (
                      <span className="font-mono-num text-xs">—</span>
                    ) : (
                      <>
                        <span className="font-mono-num text-base font-bold leading-none">
                          {cell.count}
                        </span>
                        <span className="mt-0.5 font-mono-num text-[10px] opacity-80">
                          {cell.loss.toLocaleString("ru-RU")}
                        </span>
                      </>
                    )}
                  </button>
                );
              }),
            )}
          </div>

          {/* Подпись проблемной зоны */}
          <div className="pointer-events-none mt-2 flex items-center justify-end gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-critical">
            <span className="h-1.5 w-1.5 rounded-full bg-critical" />
            Зона с наибольшими потерями
          </div>

          {/* X-axis labels */}
          <div className="mt-1 grid grid-cols-4 gap-1.5">
            {impactLabels.map((l) => (
              <span key={l} className="text-center text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                {l}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Tooltip area */}
      <div className="mt-4 min-h-[68px] rounded-xl border border-border bg-secondary/40 p-3">
        {hoveredCell && hoveredCell.count > 0 ? (
          <div className="space-y-1.5 animate-fade-in-up">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-foreground">
                {probabilityLabels[hovered!.r]} · {impactLabels[hovered!.c]}
              </span>
              <span className="font-mono-num font-semibold text-foreground">
                {hoveredCell.loss.toLocaleString("ru-RU")} млн ₽
              </span>
            </div>
            <div className="text-[11px] text-muted-foreground">
              Топ: {hoveredCell.top.slice(0, 3).join(" · ")}
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
            Наведите на ячейку, чтобы увидеть детали
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-wider text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded bg-neutral-soft" /> низкий
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded bg-attention-soft" /> средний
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded bg-attention/30" /> высокий
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded bg-critical-soft" /> критич.
        </span>
      </div>
    </div>
  );
};
