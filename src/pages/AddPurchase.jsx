import { Plus, Save, Trash2 } from "lucide-react";
import { useState } from "react";
import { getCategories, money, suggestCategory, todayISO } from "../data/categories.js";
import { Card } from "../components/UI.jsx";

export default function AddPurchase({ state, actions, go }) {
  const [shop, setShop] = useState("");
  const [date, setDate] = useState(todayISO());
  const [note, setNote] = useState("");
  const [items, setItems] = useState([{ id: crypto.randomUUID(), name: "", price: "", category: "sonstiges" }]);
  const categories = getCategories(state.settings);
  const total = items.reduce((sum, item) => sum + Number(item.price || 0), 0);

  const update = (id, patch) => setItems((current) => current.map((item) => item.id === id ? { ...item, ...patch } : item));
  const addItem = () => setItems((current) => [...current, { id: crypto.randomUUID(), name: "", price: "", category: "sonstiges" }]);

  const submit = async (event) => {
    event.preventDefault();
    const clean = items.filter((item) => item.name && item.price);
    if (!shop || clean.length === 0) return;
    await actions.addPurchase({ shop, date, note, items: clean });
    go("dashboard");
  };

  return (
    <div className="mx-auto max-w-3xl">
      <Card>
        <h2 className="text-3xl font-black">Einkauf hinzufügen</h2>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <input list="shops" className="rounded-[1.5rem] bg-cream px-5 py-5 text-lg font-bold outline-none ring-1 ring-cocoa/10 focus:ring-2 focus:ring-sage" placeholder="Shop, z.B. IKEA" value={shop} onChange={(e) => setShop(e.target.value)} />
            <input className="rounded-[1.5rem] bg-cream px-5 py-5 text-lg font-bold outline-none ring-1 ring-cocoa/10 focus:ring-2 focus:ring-sage" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <datalist id="shops">{state.shops.map((entry) => <option key={entry.id} value={entry.name} />)}</datalist>
          <textarea className="min-h-20 w-full rounded-[1.5rem] bg-cream px-5 py-4 font-bold outline-none ring-1 ring-cocoa/10 focus:ring-2 focus:ring-sage" placeholder="Notiz optional" value={note} onChange={(e) => setNote(e.target.value)} />
          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={item.id} className="grid gap-2 rounded-[1.6rem] bg-white/55 p-3 md:grid-cols-[1fr_120px_160px_44px]">
                <input className="rounded-2xl bg-cream px-4 py-4 font-bold outline-none" placeholder={`Produkt ${index + 1}`} value={item.name} onChange={(e) => update(item.id, { name: e.target.value, category: suggestCategory(e.target.value, state.settings.learnedCategories) })} />
                <input className="rounded-2xl bg-cream px-4 py-4 font-bold outline-none" placeholder="Preis" inputMode="decimal" value={item.price} onChange={(e) => update(item.id, { price: e.target.value.replace(",", ".") })} />
                <select className="rounded-2xl bg-cream px-4 py-4 font-bold outline-none" value={item.category} onChange={(e) => update(item.id, { category: e.target.value })}>
                  {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                </select>
                <button type="button" className="grid place-items-center rounded-2xl bg-rose/50" onClick={() => setItems((current) => current.filter((entry) => entry.id !== item.id))}>
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
          <button type="button" onClick={addItem} className="flex w-full items-center justify-center gap-2 rounded-[1.5rem] bg-white/65 px-5 py-4 font-black">
            <Plus /> Produkt dazu
          </button>
          <div className="flex items-center justify-between rounded-[1.7rem] bg-cocoa p-5 text-cream">
            <span className="font-black">Gesamtsumme</span>
            <span className="text-2xl font-black">{money(total)}</span>
          </div>
          <button className="flex w-full items-center justify-center gap-2 rounded-[1.6rem] bg-sage px-6 py-5 text-lg font-black text-white shadow-glow">
            <Save /> Einkauf speichern
          </button>
        </form>
      </Card>
    </div>
  );
}
