import { Calendar, RefreshCw } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const periods = ["Неделя", "Месяц", "Квартал", "Год"] as const;

export const PageHeader = () => {
  const [period, setPeriod] = useState<(typeof periods)[number]>("Квартал");

  return (
    <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="space-y-2">
        <h1 className="text-[40px] font-bold leading-tight tracking-tight text-foreground">
          Главная
        </h1>
        <p className="text-base text-muted-foreground">
          Ситуация по операционным рискам на сейчас
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <RefreshCw className="h-3.5 w-3.5" strokeWidth={2.5} />
          <span>
            Обновлено: <span className="text-foreground">сегодня, 10:42</span>
          </span>
        </div>

        <div className="hidden h-4 w-px bg-border md:block" />

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" strokeWidth={2.5} />
          <span>Период:</span>
        </div>

        <div className="inline-flex rounded-xl border border-border bg-card p-1 shadow-xs">
          {periods.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition-all",
                period === p
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
