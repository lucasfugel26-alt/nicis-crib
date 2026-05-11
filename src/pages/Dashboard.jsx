import { ArrowUpRight, Crown, Euro, PieChart, ReceiptText, ShoppingBag } from "lucide-react";
import { categories, categoryById, money, motivators } from "../data/categories.js";
import { Card, CategoryPill, Progress, StatCard } from "../components/UI.jsx";

export default function Dashboard({ state, go }) {
  const total = state.expenses.reduce((sum, item) => sum + item.price, 0);
  const month = new Date().toISOString().slice(0, 7);
  const monthTotal = state.expenses.filter((item) => item.date.startsWith(month)).reduce((sum, item) => sum + item.price, 0);
  const byCategory = categories.map((category) => ({
    ...category,
    spent: state.expenses.filter((item) => item.category === category.id).reduce((sum, item) => sum + item.price, 0)
  }));
  const biggest = [...byCategory].sort((a, b) => b.spent - a.spent)[0];
  const motivator = motivators[new Date().getDate() % motivators.length];

  return (
    <div className="space-y-5">
      <section className="rounded-[2.5rem] bg-cocoa p-6 text-cream shadow-soft md:p-8">
        <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr] md:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-cream/70">Willkommen zuhause</p>
            <h2 className="mt-3 text-4xl font-black md:text-6xl">Alles rund um dein Crib-Projekt.</h2>
            <p className="mt-4 max-w-xl text-cream/78">{motivator}</p>
          </div>
          <button
            onClick={() => go("add")}
            className="flex items-center justify-center gap-2 rounded-[1.7rem] bg-rose px-6 py-5 text-lg font-black text-cocoa transition hover:scale-[1.01]"
          >
            <ArrowUpRight /> Schnell + Ausgabe
          </button>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Gesamtausgaben" value={money(total)} icon={Euro} tone="bg-sage" />
        <StatCard label="Dieser Monat" value={money(monthTotal)} icon={PieChart} tone="bg-clay" />
        <StatCard label="Einkäufe" value={state.expenses.length} icon={ShoppingBag} tone="bg-skysoft" />
        <StatCard label="Größte Kategorie" value={biggest?.name || "-"} icon={Crown} tone="bg-butter" />
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-black">Kategorie-Verteilung</h3>
            <span className="text-sm font-bold text-cocoa/60">{money(total)}</span>
          </div>
          <div className="space-y-4">
            {byCategory.filter((item) => item.spent > 0).map((item) => (
              <div key={item.id}>
                <div className="mb-2 flex items-center justify-between text-sm font-bold">
                  <CategoryPill id={item.id} />
                  <span>{money(item.spent)}</span>
                </div>
                <Progress value={item.spent} max={total || 1} color={item.color} />
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="mb-4 text-xl font-black">Letzte Einkäufe</h3>
          <div className="space-y-3">
            {state.expenses.slice(0, 6).map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-3xl bg-white/54 p-3">
                <div className="min-w-0">
                  <p className="truncate font-black">{item.name}</p>
                  <p className="text-xs font-bold text-cocoa/58">{item.shop || "Ohne Shop"} · {item.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-black">{money(item.price)}</p>
                  <CategoryPill id={item.category} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {byCategory.map((item) => (
          <button key={item.id} onClick={() => go("stats")} className="rounded-[2rem] bg-white/55 p-5 text-left shadow-soft transition hover:-translate-y-1">
            <item.icon className="mb-4" size={24} style={{ color: categoryById[item.id].color }} />
            <p className="font-black">{item.name}</p>
            <p className="mt-1 text-2xl font-black">{money(item.spent)}</p>
            <p className="mt-2 text-sm font-bold text-cocoa/58">{total ? Math.round((item.spent / total) * 100) : 0}% Anteil</p>
          </button>
        ))}
      </section>

      <Card>
        <div className="mb-4 flex items-center gap-2">
          <ReceiptText />
          <h3 className="text-xl font-black">Budget-Fortschritt</h3>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {categories.slice(0, 6).map((category) => {
            const spent = byCategory.find((item) => item.id === category.id)?.spent || 0;
            const budget = state.budgets[category.id] || 0;
            return (
              <div key={category.id} className="rounded-3xl bg-white/52 p-4">
                <div className="mb-2 flex justify-between font-black">
                  <span>{category.name}</span>
                  <span>{money(Math.max(0, budget - spent))} frei</span>
                </div>
                <Progress value={spent} max={budget || 1} color={category.color} />
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
