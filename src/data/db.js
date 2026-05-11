import { normalizeName } from "./categories.js";

const DB_NAME = "nicis-crib-local";
const DB_VERSION = 1;
const STORES = ["expenses", "wishlist", "budgets", "purchases", "shops", "settings"];

let dbPromise;

function openDb() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      STORES.forEach((store) => {
        if (!db.objectStoreNames.contains(store)) db.createObjectStore(store, { keyPath: "id" });
      });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  return dbPromise;
}

async function tx(storeName, mode = "readonly") {
  const db = await openDb();
  const transaction = db.transaction(storeName, mode);
  return transaction.objectStore(storeName);
}

export async function getAll(storeName) {
  const store = await tx(storeName);
  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function put(storeName, value) {
  const store = await tx(storeName, "readwrite");
  return new Promise((resolve, reject) => {
    const request = store.put(value);
    request.onsuccess = () => resolve(value);
    request.onerror = () => reject(request.error);
  });
}

export async function remove(storeName, id) {
  const store = await tx(storeName, "readwrite");
  return new Promise((resolve, reject) => {
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function clearStore(storeName) {
  const store = await tx(storeName, "readwrite");
  return new Promise((resolve, reject) => {
    const request = store.clear();
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function seedIfEmpty() {
  const settings = await getAll("settings");
  const appSettings = settings.find((item) => item.id === "app");

  if (appSettings?.seededAt) {
    await Promise.all(["expenses", "wishlist", "budgets", "purchases", "shops", "settings"].map((store) => clearStore(store)));
    await put("settings", { id: "app", learnedCategories: {}, categoryOverrides: {}, customCategories: [], darkModeReady: true, demoDataRemovedAt: new Date().toISOString() });
    return;
  }

  if (appSettings) return;
  await put("settings", { id: "app", learnedCategories: {}, categoryOverrides: {}, customCategories: [], darkModeReady: true, createdAt: new Date().toISOString() });
}

export async function loadState() {
  await seedIfEmpty();
  const [expenses, wishlist, budgets, purchases, shops, settings] = await Promise.all([
    getAll("expenses"),
    getAll("wishlist"),
    getAll("budgets"),
    getAll("purchases"),
    getAll("shops"),
    getAll("settings")
  ]);
  return {
    expenses: expenses.sort((a, b) => b.date.localeCompare(a.date)),
    wishlist,
    budgets: Object.fromEntries(budgets.map((budget) => [budget.id, budget.amount])),
    purchases,
    shops: shops.sort((a, b) => (b.lastUsedAt || 0) - (a.lastUsedAt || 0)),
    settings: settings.find((item) => item.id === "app") || { id: "app", learnedCategories: {} }
  };
}

export async function rememberCategory(productName, category, settings) {
  const learnedCategories = { ...(settings.learnedCategories || {}), [normalizeName(productName)]: category };
  const next = { ...settings, learnedCategories };
  await put("settings", next);
  return next;
}

export async function rememberShop(name) {
  if (!name?.trim()) return;
  await put("shops", { id: normalizeName(name), name: name.trim(), lastUsedAt: Date.now() });
}
