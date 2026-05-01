import { TopBar } from "@/components/oprisk/TopBar";
import { PageHeader } from "@/components/oprisk/PageHeader";
import { AISummary } from "@/components/oprisk/AISummary";
import { LimitCards } from "@/components/oprisk/LimitCards";
import { LimitUtilization } from "@/components/oprisk/LimitUtilization";
import { ContributionWidget } from "@/components/oprisk/ContributionWidget";
import { FocusCases } from "@/components/oprisk/FocusCases";
import { AttentionZone } from "@/components/oprisk/AttentionZone";
import { Analytics } from "@/components/oprisk/Analytics";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <main className="mx-auto max-w-[1440px] space-y-10 px-6 py-8 lg:px-10 lg:py-10">
        <PageHeader />
        <AISummary />
        <LimitCards />
        <LimitUtilization />
        <ContributionWidget />
        <FocusCases />
        <AttentionZone />
        <Analytics />

        <footer className="flex items-center justify-between border-t border-border pt-6 text-xs text-muted-foreground">
          <span>OpRisk Platform · прототип главной страницы</span>
          <span>v0.1 · моковые данные</span>
        </footer>
      </main>
    </div>
  );
};

export default Index;
