import { useState } from "react";
import { Edit3, Plus } from "lucide-react";
import { categoryColors, getCategories, money } from "../data/categories.js";
import { Card, Progress } from "../components/UI.jsx";

export default function Budgets({ state, actions }) {
  const categories = getCategories(state.settings);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ id: "", name: "", color: categoryColors[0] });

  const startEdit = (category) => {
    setEditing(category.id);
    setForm({ id: category.id, name: category.name, color: category.color });
  };

  const startNew = () => {
    setEditing("new");
    setForm({ id: "", name: "", color: categoryColors[(categories.length + 1) % categoryColors.length] });
  };

  const save = async (event) => {
    event.preventDefault();
    if (!form.name.trim()) return;
    await actions.saveCategory(form);
    setEditing(null);
    setForm({ id: "", name: "", color: categoryColors[0] });
  };

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
                <div className="min-w-0 flex-1">
                  <h3 className="text-xl font-black">{category.name}</h3>
                  <p className="text-sm font-bold text-cocoa/58">{money(spent)} ausgegeben</p>
                </div>
                <button
                  onClick={() => startEdit(category)}
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-cream text-cocoa"
                  title="Kategorie bearbeiten"
                >
                  <Edit3 size={18} />
                </button>
              </div>
              <input className="mb-4 w-full rounded-[1.5rem] bg-cream px-5 py-5 text-lg font-bold outline-none ring-1 ring-cocoa/10 focus:ring-2 focus:ring-sage" inputMode="decimal" value={budget} onChange={(e) => actions.updateBudget(category.id, e.target.value.replace(",", "."))} />
              <Progress value={spent} max={budget || 1} color={category.color} />
              <p className="mt-3 font-black">{money(Math.max(0, budget - spent))} übrig</p>
            </Card>
          );
        })}
      </div>

      <Card>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black">Kategorien</h2>
            <p className="mt-2 text-cocoa/65">Namen und Farben anpassen oder eigene Kategorien hinzufügen.</p>
          </div>
          <button onClick={startNew} className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-sage text-white shadow-glow">
            <Plus />
          </button>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => startEdit(category)}
                className="flex items-center gap-3 rounded-3xl bg-white/55 p-4 text-left font-black"
              >
                <div className="grid h-11 w-11 place-items-center rounded-2xl" style={{ backgroundColor: `${category.color}88` }}>
                  <Icon size={20} />
                </div>
                <span className="min-w-0 flex-1 truncate">{category.name}</span>
                <Edit3 size={18} />
              </button>
            );
          })}
        </div>
      </Card>

      {editing && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-cocoa/45 px-4 backdrop-blur-sm">
          <form onSubmit={save} className="w-full max-w-sm rounded-[2rem] bg-cream p-5 text-cocoa shadow-soft">
            <h3 className="text-2xl font-black">{editing === "new" ? "Kategorie anlegen" : "Kategorie bearbeiten"}</h3>
            <input
              className="mt-5 w-full rounded-[1.5rem] bg-white px-5 py-4 text-lg font-bold outline-none ring-1 ring-cocoa/10 focus:ring-2 focus:ring-sage"
              placeholder="Kategoriename"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
            />
            <div className="mt-4 grid grid-cols-5 gap-2">
              {categoryColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setForm({ ...form, color })}
                  className={`h-12 rounded-2xl ring-2 ${form.color === color ? "ring-cocoa" : "ring-transparent"}`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setEditing(null)} className="rounded-[1.3rem] bg-white px-4 py-4 font-black">
                Abbrechen
              </button>
              <button className="rounded-[1.3rem] bg-sage px-4 py-4 font-black text-white">
                Speichern
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
