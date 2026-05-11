import { useEffect, useMemo, useState } from "react";
import { Camera, ChartNoAxesCombined, Heart, Home, ListPlus, Plus, Settings, WalletCards } from "lucide-react";
import { AppShell } from "./components/AppShell.jsx";
import { loadState, put, rememberCategory, rememberShop, remove, exportCsv, exportJson, clearStore } from "./data/db.js";
import { suggestCategory, todayISO } from "./data/categories.js";
import Dashboard from "./pages/Dashboard.jsx";
import AddExpense from "./pages/AddExpense.jsx";
import AddPurchase from "./pages/AddPurchase.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import Budgets from "./pages/Budgets.jsx";
import Stats from "./pages/Stats.jsx";
import Scan from "./pages/Scan.jsx";
import ExportImport from "./pages/ExportImport.jsx";

const tabs = [
  { id: "dashboard", label: "Home", icon: Home },
  { id: "add", label: "Ausgabe", icon: Plus },
  { id: "purchase", label: "Einkauf", icon: ListPlus },
  { id: "wishlist", label: "Wunsch", icon: Heart },
  { id: "budgets", label: "Budget", icon: WalletCards },
  { id: "stats", label: "Stats", icon: ChartNoAxesCombined },
  { id: "scan", label: "Scan", icon: Camera },
  { id: "export", label: "Daten", icon: Settings }
];

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [state, setState] = useState(null);
  const [toast, setToast] = useState("");

  const refresh = async () => setState(await loadState());

  useEffect(() => {
    refresh();
  }, []);

  const actions = useMemo(() => {
    if (!state) return {};

    return {
      addExpense: async (expense) => {
        const category = expense.category || suggestCategory(expense.name, state.settings.learnedCategories);
        const item = {
          id: crypto.randomUUID(),
          name: expense.name.trim(),
          price: Number(expense.price || 0),
          shop: expense.shop?.trim() || "",
          date: expense.date || todayISO(),
          category,
          note: expense.note?.trim() || "",
          favorite: Boolean(expense.favorite),
          purchaseId: expense.purchaseId || null
        };
        await put("expenses", item);
        await rememberShop(item.shop);
        const settings = await rememberCategory(item.name, item.category, state.settings);
        setState((current) => ({
          ...current,
          expenses: [item, ...current.expenses],
          settings,
          shops: item.shop ? [{ id: item.shop.toLowerCase(), name: item.shop, lastUsedAt: Date.now() }, ...current.shops] : current.shops
        }));
        setToast("Gespeichert. Das Zuhause-Konto ist aktuell.");
      },
      addPurchase: async ({ shop, date, note, items }) => {
        const purchaseId = crypto.randomUUID();
        const purchase = { id: purchaseId, shop, date, note, itemIds: [] };
        await put("purchases", purchase);
        for (const item of items) {
          await actions.addExpense({ ...item, shop, date, purchaseId });
        }
        await refresh();
        setToast("Einkauf gespeichert.");
      },
      updateBudget: async (id, amount) => {
        await put("budgets", { id, amount: Number(amount || 0) });
        setState((current) => ({ ...current, budgets: { ...current.budgets, [id]: Number(amount || 0) } }));
      },
      upsertWishlist: async (item) => {
        const next = { ...item, id: item.id || crypto.randomUUID(), estimate: Number(item.estimate || 0) };
        await put("wishlist", next);
        setState((current) => ({
          ...current,
          wishlist: item.id ? current.wishlist.map((entry) => (entry.id === item.id ? next : entry)) : [next, ...current.wishlist]
        }));
      },
      deleteWishlist: async (id) => {
        await remove("wishlist", id);
        setState((current) => ({ ...current, wishlist: current.wishlist.filter((item) => item.id !== id) }));
      },
      exportCsv: () => exportCsv(state.expenses),
      exportJson: () => exportJson(state),
      importJson: async (payload) => {
        const data = JSON.parse(payload);
        for (const store of ["expenses", "wishlist", "budgets", "purchases", "shops"]) await clearStore(store);
        await Promise.all((data.expenses || []).map((item) => put("expenses", item)));
        await Promise.all((data.wishlist || []).map((item) => put("wishlist", item)));
        await Promise.all(Object.entries(data.budgets || {}).map(([id, amount]) => put("budgets", { id, amount })));
        await Promise.all((data.purchases || []).map((item) => put("purchases", item)));
        await Promise.all((data.shops || []).map((item) => put("shops", item)));
        await refresh();
        setToast("Backup importiert.");
      }
    };
  }, [state]);

  if (!state) {
    return <div className="flex min-h-screen items-center justify-center text-cocoa">Nici's Crib wird gemutlich gemacht...</div>;
  }

  const pageProps = { state, actions, go: setActiveTab };
  const pages = {
    dashboard: <Dashboard {...pageProps} />,
    add: <AddExpense {...pageProps} />,
    purchase: <AddPurchase {...pageProps} />,
    wishlist: <Wishlist {...pageProps} />,
    budgets: <Budgets {...pageProps} />,
    stats: <Stats {...pageProps} />,
    scan: <Scan {...pageProps} />,
    export: <ExportImport {...pageProps} />
  };

  return (
    <AppShell tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} toast={toast} clearToast={() => setToast("")}>
      {pages[activeTab]}
    </AppShell>
  );
}
