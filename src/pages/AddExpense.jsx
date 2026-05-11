import { Heart, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { getCategories, getCategory, money, suggestCategory, todayISO } from "../data/categories.js";
import { Card } from "../components/UI.jsx";

const initial = { name: "", price: "", shop: "", date: todayISO(), category: "sonstiges", note: "", favorite: false };

export default function AddExpense({ state, actions, go }) {
  const [form, setForm] = useState(initial);
  const categories = getCategories(state.settings);

  useEffect(() => {
    if (form.name) setForm((current) => ({ ...current, category: suggestCategory(current.name, state.settings.learnedCategories) }));
  }, [form.name, state.settings.learnedCategories]);

  const submit = async (event) => {
    event.preventDefault();
    if (!form.name || !form.price) return;
    await actions.addExpense(form);
    setForm({ ...initial, date: todayISO(), shop: form.shop });
    go("dashboard");
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <h2 className="text-3xl font-black">Ausgabe hinzufügen</h2>
        <p className="mt-2 text-cocoa/65">Schnell rein, automatisch sortiert, lokal gespeichert.</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <input className="w-full rounded-[1.5rem] border-0 bg-cream px-5 py-5 text-lg font-bold outline-none ring-1 ring-cocoa/10 focus:ring-2 focus:ring-sage" placeholder="Produktname" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <input className="w-full rounded-[1.5rem] border-0 bg-cream px-5 py-5 text-lg font-bold outline-none ring-1 ring-cocoa/10 focus:ring-2 focus:ring-sage" placeholder="Preis" inputMode="decimal" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value.replace(",", ".") })} />
            <input className="w-full rounded-[1.5rem] border-0 bg-cream px-5 py-5 text-lg font-bold outline-none ring-1 ring-cocoa/10 focus:ring-2 focus:ring-sage" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </div>
          <input list="shops" className="w-full rounded-[1.5rem] border-0 bg-cream px-5 py-5 text-lg font-bold outline-none ring-1 ring-cocoa/10 focus:ring-2 focus:ring-sage" placeholder="Shop optional" value={form.shop} onChange={(e) => setForm({ ...form, shop: e.target.value })} />
          <datalist id="shops">{state.shops.map((shop) => <option key={shop.id} value={shop.name} />)}</datalist>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            {categories.map((category) => {
              const Icon = category.icon;
              const active = form.category === category.id;
              return (
                <button type="button" key={category.id} onClick={() => setForm({ ...form, category: category.id })} className={`rounded-3xl p-3 text-left font-black ring-1 transition ${active ? "bg-cocoa text-cream ring-cocoa" : "bg-white/55 ring-white/70"}`}>
                  <Icon size={20} style={{ color: active ? "#fbf4e7" : category.color }} />
                  <span className="mt-2 block">{category.name}</span>
                </button>
              );
            })}
          </div>
          <textarea className="min-h-24 w-full rounded-[1.5rem] border-0 bg-cream px-5 py-4 font-bold outline-none ring-1 ring-cocoa/10 focus:ring-2 focus:ring-sage" placeholder="Notiz optional" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
          <div className="flex items-center justify-between rounded-[1.5rem] bg-white/55 p-4">
            <button type="button" onClick={() => setForm({ ...form, favorite: !form.favorite })} className={`flex items-center gap-2 rounded-full px-4 py-3 font-black ${form.favorite ? "bg-rose text-cocoa" : "bg-cream text-cocoa/70"}`}>
              <Heart size={18} /> Favorit
            </button>
            <p className="font-black">{money(form.price || 0)} · {getCategory(form.category, state.settings).name}</p>
          </div>
          <button className="flex w-full items-center justify-center gap-2 rounded-[1.6rem] bg-sage px-6 py-5 text-lg font-black text-white shadow-glow">
            <Save /> Speichern
          </button>
        </form>
      </Card>
    </div>
  );
}
