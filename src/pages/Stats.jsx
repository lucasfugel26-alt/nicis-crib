import { Crown, Store, Trash2, TrendingUp } from "lucide-react";
import { categories, money } from "../data/categories.js";
import { Card, CategoryPill, Progress, StatCard } from "../components/UI.jsx";

export default function Stats({ state, actions }) {
  const total = state.expenses.reduce((sum, item) => sum + item.price, 0);
  const categoryRows = categories.map((category) => ({
    ...category,
    total: state.expenses.filter((item) => item.category === category.id).reduce((sum, item) => sum + item.price, 0)
  })).sort((a, b) => b.total - a.total);

  const shops = Object.entries(state.expenses.reduce((acc, item) => {
    if (item.shop) acc[item.shop] = (acc[item.shop] || 0) + 1;
    return acc;
  }, {})).sort((a, b) => b[1] - a[1]);

  const months = Object.entries(state.expenses.reduce((acc, item) => {
    const month = item.date.slice(0, 7);
    acc[month] = (acc[month] || 0) + item.price;
    return acc;
  }, {})).sort();

  const biggest = [...state.expenses].sort((a, b) => b.price - a.price).slice(0, 5);

  return (
    <div className="space-y-5">
      <section className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <StatCard label="Gesamtverlauf" value={money(total)} icon={TrendingUp} tone="bg-sage" />
        <StatCard label="Häufigster Shop" value={shops[0]?.[0] || "-"} icon={Store} tone="bg-skysoft" />
        <StatCard label="Größter Kauf" value={biggest[0] ? money(biggest[0].price) : "-"} icon={Crown} tone="bg-rose" />
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-2xl font-black">Ausgaben pro Kategorie</h2>
          <div className="space-y-4">
            {categoryRows.map((row) => (
              <div key={row.id}>
                <div className="mb-2 flex justify-between font-black"><CategoryPill id={row.id} /><span>{money(row.total)}</span></div>
                <Progress value={row.total} max={total || 1} color={row.color} />
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 text-2xl font-black">Größte Einzelkäufe</h2>
          <div className="space-y-3">
            {biggest.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3 rounded-3xl bg-white/55 p-4">
                <div><p className="font-black">{item.name}</p><p className="text-sm font-bold text-cocoa/58">{item.shop || "Ohne Shop"}</p></div>
                <p className="ml-auto font-black">{money(item.price)}</p>
                <button
                  onClick={() => actions.deleteExpense(item.id)}
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-rose/55 text-cocoa transition hover:bg-rose"
                  title="Einkauf löschen"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 text-2xl font-black">Häufigste Shops</h2>
          <div className="space-y-3">
            {shops.map(([shop, count]) => (
              <div key={shop} className="flex items-center justify-between rounded-3xl bg-white/55 p-4 font-black">
                <span>{shop}</span><span>{count}x</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 text-2xl font-black">Monatsübersicht</h2>
          <div className="space-y-4">
            {months.map(([month, amount]) => (
              <div key={month}>
                <div className="mb-2 flex justify-between font-black"><span>{month}</span><span>{money(amount)}</span></div>
                <Progress value={amount} max={Math.max(...months.map(([, value]) => value), 1)} color="#9daf8c" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
