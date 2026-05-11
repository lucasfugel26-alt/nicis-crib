import { Check, Heart, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { money } from "../data/categories.js";
import { Card, EmptyState } from "../components/UI.jsx";

const blank = { name: "", estimate: "", priority: "mittel", done: false, favorite: false };

export default function Wishlist({ state, actions }) {
  const [form, setForm] = useState(blank);

  const add = async (event) => {
    event.preventDefault();
    if (!form.name) return;
    await actions.upsertWishlist(form);
    setForm(blank);
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
      <Card>
        <h2 className="text-3xl font-black">Noch kaufen</h2>
        <form onSubmit={add} className="mt-5 space-y-3">
          <input className="w-full rounded-[1.5rem] bg-cream px-5 py-5 text-lg font-bold outline-none ring-1 ring-cocoa/10 focus:ring-2 focus:ring-sage" placeholder="Produktwunsch" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className="w-full rounded-[1.5rem] bg-cream px-5 py-5 text-lg font-bold outline-none ring-1 ring-cocoa/10 focus:ring-2 focus:ring-sage" placeholder="Geschätzter Preis" inputMode="decimal" value={form.estimate} onChange={(e) => setForm({ ...form, estimate: e.target.value.replace(",", ".") })} />
          <select className="w-full rounded-[1.5rem] bg-cream px-5 py-5 text-lg font-bold outline-none ring-1 ring-cocoa/10 focus:ring-2 focus:ring-sage" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
            <option value="hoch">Hohe Priorität</option>
            <option value="mittel">Mittlere Priorität</option>
            <option value="niedrig">Niedrige Priorität</option>
          </select>
          <button className="flex w-full items-center justify-center gap-2 rounded-[1.6rem] bg-sage px-6 py-5 text-lg font-black text-white shadow-glow"><Plus /> Merken</button>
        </form>
      </Card>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-2xl font-black">Wunschliste</h3>
          <p className="font-black">{money(state.wishlist.filter((item) => !item.done).reduce((sum, item) => sum + item.estimate, 0))}</p>
        </div>
        {state.wishlist.length === 0 ? <EmptyState title="Noch leer" text="Hier sammeln sich Dinge, die Nici's Crib noch schoner machen." /> : (
          <div className="space-y-3">
            {state.wishlist.map((item) => (
              <div key={item.id} className={`flex items-center gap-3 rounded-[1.6rem] p-4 ${item.done ? "bg-sage/25" : "bg-white/55"}`}>
                <button onClick={() => actions.upsertWishlist({ ...item, done: !item.done })} className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${item.done ? "bg-sage text-white" : "bg-cream"}`}>
                  <Check />
                </button>
                <div className="min-w-0 flex-1">
                  <p className={`truncate font-black ${item.done ? "line-through opacity-60" : ""}`}>{item.name}</p>
                  <p className="text-sm font-bold text-cocoa/58">{money(item.estimate)} · {item.priority}</p>
                </div>
                <button onClick={() => actions.upsertWishlist({ ...item, favorite: !item.favorite })} className={`rounded-2xl p-3 ${item.favorite ? "bg-rose" : "bg-cream"}`}><Heart size={18} /></button>
                <button onClick={() => actions.deleteWishlist(item.id)} className="rounded-2xl bg-cream p-3"><Trash2 size={18} /></button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
