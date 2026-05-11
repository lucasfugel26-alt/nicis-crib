import {
  Armchair,
  Bath,
  Brush,
  CookingPot,
  Flower2,
  Laptop,
  Package,
  ShoppingBasket,
  Sparkles
} from "lucide-react";

export const categories = [
  { id: "kueche", name: "Küche", color: "#f1d88d", icon: CookingPot },
  { id: "bad", name: "Bad", color: "#b9d6d3", icon: Bath },
  { id: "moebel", name: "Möbel", color: "#d9b894", icon: Armchair },
  { id: "deko", name: "Deko", color: "#e8b8ad", icon: Flower2 },
  { id: "reinigung", name: "Reinigung", color: "#c8d5b9", icon: Brush },
  { id: "technik", name: "Technik", color: "#b7bed9", icon: Laptop },
  { id: "lebensmittel", name: "Lebensmittel", color: "#d7c58d", icon: ShoppingBasket },
  { id: "sonstiges", name: "Sonstiges", color: "#d8cec2", icon: Package }
];

export const categoryById = Object.fromEntries(categories.map((category) => [category.id, category]));
export const fallbackCategory = { id: "sonstiges", name: "Sonstiges", color: "#d8cec2", icon: Package };

export const categoryColors = ["#f1d88d", "#b9d6d3", "#d9b894", "#e8b8ad", "#c8d5b9", "#b7bed9", "#d7c58d", "#d8cec2", "#c98572", "#9daf8c"];

export function getCategories(settings = {}) {
  const overrides = settings.categoryOverrides || {};
  const custom = settings.customCategories || [];
  const base = categories.map((category) => ({ ...category, ...(overrides[category.id] || {}) }));
  return [...base, ...custom.map((category) => ({ ...category, icon: Package }))];
}

export function getCategoryMap(settings = {}) {
  return Object.fromEntries(getCategories(settings).map((category) => [category.id, category]));
}

export function getCategory(id, settings = {}) {
  return getCategoryMap(settings)[id] || fallbackCategory;
}

const rules = {
  kueche: ["pfanne", "topf", "glas", "teller", "besteck", "messer", "brett", "schussel", "kuche", "vorratsdose", "kaffee"],
  bad: ["dusche", "duschvorhang", "handtuch", "bad", "seife", "spiegel", "zahnburste", "badematte"],
  moebel: ["regal", "sofa", "stuhl", "tisch", "bett", "kommode", "schrank", "lampe", "matratze"],
  deko: ["kerze", "vase", "poster", "bild", "kissen", "decke", "pflanze", "lichterkette"],
  reinigung: ["reiniger", "schwamm", "waschmittel", "besen", "mopp", "tuch", "spuli", "sauger"],
  technik: ["kabel", "adapter", "router", "steckdose", "led", "akku", "lautsprecher", "smart"],
  lebensmittel: ["brot", "milch", "nudeln", "reis", "gemuse", "obst", "kaese", "tee", "snack"]
};

export function suggestCategory(name, learned = {}) {
  const key = normalizeName(name);
  if (learned[key]) return learned[key];
  const hit = Object.entries(rules).find(([, words]) => words.some((word) => key.includes(word)));
  return hit?.[0] || "sonstiges";
}

export function normalizeName(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9 ]/g, "")
    .trim();
}

export function money(value) {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(Number(value || 0));
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export const motivators = [
  "Das Nest wird langsam fertig.",
  "Heute wieder etwas fürs Zuhause getan.",
  "Kleine Dinge, großer Zuhause-Vibe.",
  "Nici's Crib bekommt jeden Tag mehr Charakter.",
  "Ordnung im Budget, Gemutlichkeit im Kopf."
];
