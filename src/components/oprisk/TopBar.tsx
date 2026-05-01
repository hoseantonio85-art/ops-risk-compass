import { Bell, Search, Shield } from "lucide-react";

const navItems = [
  { label: "Главная", active: true },
  { label: "Инциденты" },
  { label: "Риски" },
  { label: "Меры" },
  { label: "КИРы" },
  { label: "Лимиты" },
  { label: "Сценарии" },
  { label: "Аналитика" },
];

export const TopBar = () => {
  return (
    <div className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-[1440px] items-center gap-6 px-6 lg:px-10">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Shield className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <span className="text-sm font-semibold tracking-tight text-foreground">OpRisk</span>
        </div>

        <nav className="hidden flex-1 items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.label}
              href="#"
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                item.active
                  ? "bg-primary-soft text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground">
            <Search className="h-4 w-4" />
          </button>
          <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground">
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-attention" />
          </button>
          <div className="ml-1 flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-foreground">
            АП
          </div>
        </div>
      </div>
    </div>
  );
};
