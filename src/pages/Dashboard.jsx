import { useState } from "react";
import { ArrowUpRight, ChevronDown, Crown, Euro, PieChart, ReceiptText, ShoppingBag, Trash2 } from "lucide-react";
import { categories, categoryById, money, motivators } from "../data/categories.js";
import { Card, CategoryPill, Progress, StatCard } from "../components/UI.jsx";

export default function Dashboard({ state, actions, go }) {
  const [openCategory, setOpenCategory] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const total = state.expenses.reduce((sum, item) => sum + item.price, 0);
  const month = new Date().toISOString().slice(0, 7);
  const monthTotal = state.expenses.filter((item) => item.date.startsWith(month)).reduce((sum, item) => sum + item.price, 0);
  const byCategory = categories.map((category) => ({
    ...category,
    spent: state.expenses.filter((item) => item.category === category.id).reduce((sum, item) => sum + item.price, 0)
  }));
  const biggest = [...byCategory].sort((a, b) => b.spent - a.spent)[0];
  const motivator = motivators[new Date().getDate() % motivators.length];
  const confirmDelete = async () => {
    if (!pendingDelete) return;
    await actions.deleteExpense(pendingDelete.id);
    setPendingDelete(null);
  };

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
              <div key={item.id} className="flex items-center justify-between gap-3 rounded-3xl bg-white/54 p-3">
                <div className="min-w-0">
                  <p className="truncate font-black">{item.name}</p>
                  <p className="text-xs font-bold text-cocoa/58">{item.shop || "Ohne Shop"} · {item.date}</p>
                </div>
                <div className="min-w-fit text-right">
                  <p className="font-black">{money(item.price)}</p>
                  <CategoryPill id={item.category} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {byCategory.map((item) => {
          const isOpen = openCategory === item.id;
          const categoryExpenses = state.expenses.filter((expense) => expense.category === item.id);
          return (
            <article key={item.id} className={`rounded-[2rem] bg-white/55 p-5 text-left shadow-soft transition ${isOpen ? "md:col-span-2 xl:col-span-2" : ""}`}>
              <button
                onClick={() => setOpenCategory(isOpen ? null : item.id)}
                className="flex w-full items-start justify-between gap-4 text-left"
              >
                <div>
                  <item.icon className="mb-4" size={24} style={{ color: categoryById[item.id].color }} />
                  <p className="font-black">{item.name}</p>
                  <p className="mt-1 text-2xl font-black">{money(item.spent)}</p>
                  <p className="mt-2 text-sm font-bold text-cocoa/58">{total ? Math.round((item.spent / total) * 100) : 0}% Anteil</p>
                </div>
                <ChevronDown className={`mt-1 shrink-0 transition ${isOpen ? "rotate-180" : ""}`} />
              </button>

              {isOpen && (
                <div className="mt-5 space-y-3 border-t border-cocoa/10 pt-4">
                  {categoryExpenses.length === 0 ? (
                    <p className="rounded-3xl bg-cream/70 p-4 text-sm font-bold text-cocoa/60">Noch keine Einkäufe in dieser Kategorie.</p>
                  ) : (
                    categoryExpenses.map((expense) => (
                      <div key={expense.id} className="flex items-center justify-between gap-3 rounded-3xl bg-cream/72 p-3">
                        <div className="min-w-0">
                          <p className="truncate font-black">{expense.name}</p>
                          <p className="text-xs font-bold text-cocoa/58">{expense.shop || "Ohne Shop"} · {expense.date}</p>
                        </div>
                        <p className="ml-auto shrink-0 font-black">{money(expense.price)}</p>
                        <button
                          onClick={() => setPendingDelete(expense)}
                          className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-rose/55 text-cocoa transition hover:bg-rose"
                          title="Einkauf löschen"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </article>
          );
        })}
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

      {pendingDelete && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-cocoa/45 px-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-[2rem] bg-cream p-5 text-cocoa shadow-soft">
            <h3 className="text-2xl font-black">Einkauf löschen?</h3>
            <p className="mt-2 text-sm font-bold text-cocoa/65">
              „{pendingDelete.name}“ über {money(pendingDelete.price)} wird dauerhaft entfernt.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button onClick={() => setPendingDelete(null)} className="rounded-[1.3rem] bg-white px-4 py-4 font-black">
                Abbrechen
              </button>
              <button onClick={confirmDelete} className="rounded-[1.3rem] bg-rose px-4 py-4 font-black text-cocoa">
                Löschen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
