import { categories, money } from "../data/categories.js";
import { Card, Progress } from "../components/UI.jsx";

export default function Budgets({ state, actions }) {
  return (
    <div className="space-y-5">
      <Card>
        <h2 className="text-3xl font-black">Budgets</h2>
        <p className="mt-2 text-cocoa/65">Pro Kategorie festlegen, wie viel für das Wohnprojekt eingeplant ist.</p>
      </Card>
      <div className="grid gap-4 md:grid-cols-2">
        {categories.map((category) => {
          const spent = state.expenses.filter((item) => item.category === category.id).reduce((sum, item) => sum + item.price, 0);
          const budget = state.budgets[category.id] || 0;
          const Icon = category.icon;
          return (
            <Card key={category.id}>
              <div className="mb-4 flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl" style={{ backgroundColor: `${category.color}88` }}><Icon /></div>
                <div>
                  <h3 className="text-xl font-black">{category.name}</h3>
                  <p className="text-sm font-bold text-cocoa/58">{money(spent)} ausgegeben</p>
                </div>
              </div>
              <input className="mb-4 w-full rounded-[1.5rem] bg-cream px-5 py-5 text-lg font-bold outline-none ring-1 ring-cocoa/10 focus:ring-2 focus:ring-sage" inputMode="decimal" value={budget} onChange={(e) => actions.updateBudget(category.id, e.target.value.replace(",", "."))} />
              <Progress value={spent} max={budget || 1} color={category.color} />
              <p className="mt-3 font-black">{money(Math.max(0, budget - spent))} übrig</p>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
