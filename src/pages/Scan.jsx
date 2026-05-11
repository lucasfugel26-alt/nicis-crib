import { Camera, FileScan, Sparkles } from "lucide-react";
import { Card } from "../components/UI.jsx";

export default function Scan() {
  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <Card>
        <h2 className="text-3xl font-black">Kassenzettel-Scan</h2>
        <p className="mt-2 text-cocoa/65">Vorbereitet für spätere lokale OCR-Erkennung direkt im Browser.</p>
      </Card>
      <section className="overflow-hidden rounded-[2.4rem] bg-cocoa text-cream shadow-soft">
        <div className="grid aspect-[4/5] place-items-center bg-[radial-gradient(circle_at_center,rgba(251,244,231,.18),transparent_45%),linear-gradient(145deg,#5f4a3f,#7b6152)] p-8">
          <div className="w-full max-w-sm rounded-[2rem] border-2 border-dashed border-cream/55 p-8 text-center">
            <Camera className="mx-auto mb-5" size={56} />
            <p className="text-xl font-black">Kamera-UI Platzhalter</p>
            <p className="mt-2 text-sm text-cream/70">Hier kann spater `getUserMedia` plus lokale OCR mit Tesseract.js angebunden werden.</p>
          </div>
        </div>
        <div className="grid gap-3 p-5 md:grid-cols-2">
          <button className="flex items-center justify-center gap-2 rounded-[1.5rem] bg-rose px-5 py-4 font-black text-cocoa"><FileScan /> Scan vorbereiten</button>
          <button className="flex items-center justify-center gap-2 rounded-[1.5rem] bg-cream/15 px-5 py-4 font-black"><Sparkles /> OCR Architektur bereit</button>
        </div>
      </section>
    </div>
  );
}
