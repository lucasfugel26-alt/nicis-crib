import { getCategory } from "../data/categories.js";

export function Card({ children, className = "" }) {
  return <section className={`soft-card p-5 ${className}`}>{children}</section>;
}

export function StatCard({ label, value, icon: Icon, tone = "bg-sage" }) {
  return (
    <Card className="min-h-32">
      <div className={`mb-4 grid h-11 w-11 place-items-center rounded-2xl ${tone} text-white`}>
        <Icon size={22} />
      </div>
      <p className="text-sm font-bold text-cocoa/62">{label}</p>
      <p className="mt-1 text-2xl font-black">{value}</p>
    </Card>
  );
}

export function Progress({ value, max, color = "#9daf8c" }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div>
      <div className="h-3 overflow-hidden rounded-full bg-cocoa/10">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <p className="mt-1 text-xs font-bold text-cocoa/55">{pct}% genutzt</p>
    </div>
  );
}

export function CategoryPill({ id, settings }) {
  const category = getCategory(id, settings);
  const Icon = category.icon;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black" style={{ backgroundColor: `${category.color}66` }}>
      <Icon size={14} /> {category.name}
    </span>
  );
}

export function EmptyState({ title, text }) {
  return (
    <div className="rounded-[2rem] border border-dashed border-cocoa/20 p-8 text-center">
      <p className="text-lg font-black">{title}</p>
      <p className="mt-2 text-sm text-cocoa/65">{text}</p>
    </div>
  );
}
