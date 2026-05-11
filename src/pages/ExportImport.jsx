import { Download, FileJson, Upload } from "lucide-react";
import { useState } from "react";
import { Card } from "../components/UI.jsx";

function download(name, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
}

export default function ExportImport({ actions }) {
  const [payload, setPayload] = useState("");

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <Card>
        <h2 className="text-3xl font-black">Daten & Backup</h2>
        <p className="mt-2 text-cocoa/65">CSV Export, JSON Backup und Import sind vorbereitet. Alles bleibt lokal im Browser.</p>
      </Card>
      <div className="grid gap-4 md:grid-cols-2">
        <button onClick={() => download("nicis-crib-ausgaben.csv", actions.exportCsv(), "text/csv")} className="flex items-center justify-center gap-3 rounded-[2rem] bg-sage p-6 text-lg font-black text-white shadow-glow"><Download /> CSV Export</button>
        <button onClick={async () => download("nicis-crib-backup.json", await actions.exportJson(), "application/json")} className="flex items-center justify-center gap-3 rounded-[2rem] bg-cocoa p-6 text-lg font-black text-cream shadow-soft"><FileJson /> JSON Backup</button>
      </div>
      <Card>
        <h3 className="text-2xl font-black">Datenimport</h3>
        <textarea className="mt-4 min-h-52 w-full rounded-[1.5rem] bg-cream px-5 py-4 font-mono text-sm outline-none ring-1 ring-cocoa/10 focus:ring-2 focus:ring-sage" placeholder="JSON Backup hier einfügen" value={payload} onChange={(e) => setPayload(e.target.value)} />
        <button onClick={() => payload && actions.importJson(payload)} className="mt-4 flex w-full items-center justify-center gap-2 rounded-[1.5rem] bg-rose px-5 py-4 font-black text-cocoa"><Upload /> Importieren</button>
      </Card>
    </div>
  );
}
