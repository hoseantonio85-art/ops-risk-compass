import { RiskHeatmap } from "./RiskHeatmap";
import { ContributionWidget } from "./ContributionWidget";

export const Analytics = () => {
  return (
    <section aria-labelledby="analytics-title" className="space-y-5">
      <div>
        <h2 id="analytics-title" className="text-2xl font-semibold tracking-tight text-foreground">
          Аналитика
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">Что формирует текущую картину</p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RiskHeatmap />
        </div>
        <div className="lg:col-span-1">
          <ContributionWidget />
        </div>
      </div>
    </section>
  );
};
