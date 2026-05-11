import { todayISO } from "./categories.js";

const daysAgo = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().slice(0, 10);
};

export const mockExpenses = [
  { id: crypto.randomUUID(), name: "Regal Kallax", price: 89.99, shop: "IKEA", date: daysAgo(3), category: "moebel", note: "Für Wohnzimmer", favorite: true, purchaseId: "ikea-1" },
  { id: crypto.randomUUID(), name: "Kerze Vanille", price: 7.95, shop: "Depot", date: daysAgo(4), category: "deko", note: "", favorite: false, purchaseId: "depot-1" },
  { id: crypto.randomUUID(), name: "Pfanne 28 cm", price: 34.5, shop: "Butlers", date: daysAgo(8), category: "kueche", note: "", favorite: true, purchaseId: null },
  { id: crypto.randomUUID(), name: "Duschvorhang", price: 19.99, shop: "H&M Home", date: daysAgo(11), category: "bad", note: "Salbeigrun", favorite: false, purchaseId: null },
  { id: crypto.randomUUID(), name: "LED Lichterkette", price: 12.99, shop: "Amazon", date: daysAgo(17), category: "deko", note: "", favorite: false, purchaseId: null },
  { id: crypto.randomUUID(), name: "Vorratsdosen Set", price: 22.4, shop: "IKEA", date: daysAgo(26), category: "kueche", note: "", favorite: false, purchaseId: "ikea-2" },
  { id: crypto.randomUUID(), name: "Allzweckreiniger", price: 3.45, shop: "dm", date: daysAgo(2), category: "reinigung", note: "", favorite: false, purchaseId: null },
  { id: crypto.randomUUID(), name: "WLAN Steckdose", price: 15.9, shop: "MediaMarkt", date: daysAgo(35), category: "technik", note: "", favorite: false, purchaseId: null }
];

export const mockWishlist = [
  { id: crypto.randomUUID(), name: "Esstisch rund", estimate: 180, priority: "hoch", done: false, favorite: true },
  { id: crypto.randomUUID(), name: "Badematte", estimate: 25, priority: "mittel", done: false, favorite: false },
  { id: crypto.randomUUID(), name: "Gewurzregal", estimate: 18, priority: "niedrig", done: true, favorite: false }
];

export const mockBudgets = {
  moebel: 650,
  kueche: 220,
  bad: 140,
  deko: 180,
  reinigung: 60,
  technik: 240,
  lebensmittel: 120,
  sonstiges: 100
};

export const mockShops = ["IKEA", "dm", "Depot", "H&M Home", "Amazon", "Butlers", "MediaMarkt"];

export const mockPurchases = [
  { id: "ikea-1", shop: "IKEA", date: daysAgo(3), note: "Wohnzimmerrunde", itemIds: [] },
  { id: "depot-1", shop: "Depot", date: daysAgo(4), note: "", itemIds: [] },
  { id: "ikea-2", shop: "IKEA", date: daysAgo(26), note: "Küchenzeug", itemIds: [] }
];

export const defaultSettings = {
  seededAt: todayISO(),
  darkModeReady: true,
  learnedCategories: {}
};
