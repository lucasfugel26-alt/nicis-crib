import { useEffect } from "react";

export function AppShell({ children, tabs, activeTab, setActiveTab, toast, clearToast }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(clearToast, 2600);
    return () => clearTimeout(timer);
  }, [toast, clearToast]);

  return (
    <div className="min-h-screen pb-28 text-cocoa md:pb-8">
      <header className="sticky top-0 z-30 border-b border-white/50 bg-cream/70 px-4 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <button onClick={() => setActiveTab("dashboard")} className="text-left">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-moss">Lokales Zuhause-Budget</p>
            <h1 className="text-2xl font-black">Nici's Crib</h1>
          </button>
          <button
            onClick={() => setActiveTab("add")}
            className="rounded-full bg-cocoa px-5 py-3 text-sm font-bold text-cream shadow-glow transition hover:scale-[1.02]"
          >
            + Ausgabe
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-5 md:py-8">
        <div className="page-enter">{children}</div>
      </main>

      <nav className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-white/60 bg-cream/82 px-2 py-2 backdrop-blur-2xl md:left-1/2 md:w-[760px] md:-translate-x-1/2 md:rounded-t-[2rem] md:border md:shadow-soft">
        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex min-w-0 flex-col items-center gap-1 rounded-2xl px-1 py-2 text-[10px] font-bold transition ${
                  active ? "bg-sage text-white shadow-glow" : "text-cocoa/68 hover:bg-white/60"
                }`}
                title={tab.label}
              >
                <Icon size={20} strokeWidth={2.4} />
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {toast && (
        <div className="fixed left-4 right-4 top-20 z-50 mx-auto max-w-md rounded-3xl bg-cocoa px-5 py-4 text-center font-bold text-cream shadow-soft">
          {toast}
        </div>
      )}
    </div>
  );
}
