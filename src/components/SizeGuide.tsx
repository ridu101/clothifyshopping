import { AnimatePresence, motion } from "framer-motion";
import { X, Ruler, Info } from "lucide-react";
import { useEffect } from "react";

type SizeRow = Record<string, string | number>;

type Chart = {
  title: string;
  columns: string[];
  rows: SizeRow[];
  tips: string[];
};

const PANJABI: Chart = {
  title: "Panjabi / Kurta",
  columns: ["Size", "Chest", "Length", "Shoulder", "Sleeve"],
  rows: [
    { Size: "S", Chest: 38, Length: 40, Shoulder: 17, Sleeve: 23 },
    { Size: "M", Chest: 40, Length: 41, Shoulder: 17.5, Sleeve: 23.5 },
    { Size: "L", Chest: 42, Length: 42, Shoulder: 18, Sleeve: 24 },
    { Size: "XL", Chest: 44, Length: 43, Shoulder: 18.5, Sleeve: 24.5 },
    { Size: "XXL", Chest: 46, Length: 44, Shoulder: 19, Sleeve: 25 },
  ],
  tips: [
    "Chest — measure around the fullest part of your chest, keeping the tape level.",
    "Length — measure from the shoulder seam down to the desired hem.",
    "Sleeve — measure from shoulder edge to wrist with arm slightly bent.",
  ],
};

const SHIRT: Chart = {
  title: "Shirt / Polo",
  columns: ["Size", "Chest", "Length", "Shoulder", "Sleeve"],
  rows: [
    { Size: "S", Chest: 38, Length: 28, Shoulder: 17, Sleeve: 24 },
    { Size: "M", Chest: 40, Length: 28.5, Shoulder: 17.5, Sleeve: 24.5 },
    { Size: "L", Chest: 42, Length: 29, Shoulder: 18, Sleeve: 25 },
    { Size: "XL", Chest: 44, Length: 29.5, Shoulder: 18.5, Sleeve: 25.5 },
    { Size: "XXL", Chest: 46, Length: 30, Shoulder: 19, Sleeve: 26 },
  ],
  tips: [
    "Chest — measure under arms around the fullest part.",
    "Shoulder — measure from one shoulder edge across the back to the other.",
    "Sleeve — full sleeve from shoulder seam to cuff.",
  ],
};

const PANT: Chart = {
  title: "Pant / Trouser",
  columns: ["Size", "Waist", "Length", "Hip", "Bottom"],
  rows: [
    { Size: "28", Waist: 28, Length: 40, Hip: 36, Bottom: 13 },
    { Size: "30", Waist: 30, Length: 40.5, Hip: 38, Bottom: 13.5 },
    { Size: "32", Waist: 32, Length: 41, Hip: 40, Bottom: 14 },
    { Size: "34", Waist: 34, Length: 41.5, Hip: 42, Bottom: 14.5 },
    { Size: "36", Waist: 36, Length: 42, Hip: 44, Bottom: 15 },
    { Size: "38", Waist: 38, Length: 42.5, Hip: 46, Bottom: 15.5 },
  ],
  tips: [
    "Waist — measure around natural waistline where you wear your trouser.",
    "Length — outer length from waistband to bottom hem.",
    "Hip — measure around the fullest part of your hips.",
  ],
};

const TSHIRT: Chart = {
  title: "T-Shirt",
  columns: ["Size", "Chest", "Length", "Shoulder"],
  rows: [
    { Size: "S", Chest: 38, Length: 27, Shoulder: 17 },
    { Size: "M", Chest: 40, Length: 28, Shoulder: 17.5 },
    { Size: "L", Chest: 42, Length: 29, Shoulder: 18 },
    { Size: "XL", Chest: 44, Length: 30, Shoulder: 18.5 },
    { Size: "XXL", Chest: 46, Length: 31, Shoulder: 19 },
  ],
  tips: [
    "Chest — keep the tape level around the fullest part of your chest.",
    "Length — top of shoulder down to where you want the hem.",
  ],
};

const HOODIE: Chart = {
  title: "Hoodie / Jacket",
  columns: ["Size", "Chest", "Length", "Shoulder", "Sleeve"],
  rows: [
    { Size: "S", Chest: 40, Length: 27, Shoulder: 18, Sleeve: 24 },
    { Size: "M", Chest: 42, Length: 28, Shoulder: 18.5, Sleeve: 24.5 },
    { Size: "L", Chest: 44, Length: 29, Shoulder: 19, Sleeve: 25 },
    { Size: "XL", Chest: 46, Length: 30, Shoulder: 19.5, Sleeve: 25.5 },
    { Size: "XXL", Chest: 48, Length: 31, Shoulder: 20, Sleeve: 26 },
  ],
  tips: [
    "Wear over a light tee while measuring for outerwear.",
    "Sleeve — measure from shoulder seam to cuff with arm slightly bent.",
  ],
};

function pickChart(category: string): Chart {
  const c = (category || "").toLowerCase().replace(/[^a-z]/g, "");
  if (c.includes("panjabi") || c.includes("kurta")) return PANJABI;
  if (c.includes("pant") || c.includes("trouser") || c.includes("jeans")) return PANT;
  if (c.includes("hoodie") || c.includes("jacket")) return HOODIE;
  if (c.includes("tshirt") || c === "tee") return TSHIRT;
  if (c.includes("shirt") || c.includes("polo")) return SHIRT;
  return SHIRT;
}

interface Props {
  open: boolean;
  onClose: () => void;
  category: string;
}

const SizeGuide = ({ open, onClose, category }: Props) => {
  const chart = pickChart(category);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 z-[80] bg-foreground/30 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 right-0 z-[81] h-full w-full sm:w-[420px] glass-panel border-l border-white/40 overflow-y-auto"
            style={{
              background: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(28px) saturate(160%)",
              boxShadow: "-30px 0 80px rgba(59,130,246,0.18)",
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Size guide"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-border/60 backdrop-blur-xl bg-white/70">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                  style={{
                    background: "var(--gradient-primary)",
                    boxShadow: "0 8px 20px rgba(59,130,246,0.4)",
                  }}
                >
                  <Ruler className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-foreground">Size Guide</h3>
                  <p className="text-xs text-muted-foreground">{chart.title} · inches</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-secondary transition-colors duration-300"
                aria-label="Close size guide"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="overflow-x-auto rounded-2xl border border-border/70 bg-white/60">
                <table className="w-full text-sm font-mono min-w-[360px]">
                  <thead>
                    <tr
                      className="text-left text-white"
                      style={{ background: "var(--gradient-primary)" }}
                    >
                      {chart.columns.map((c) => (
                        <th key={c} className="px-3 py-2.5 font-heading font-semibold tracking-wide text-xs uppercase">
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {chart.rows.map((row, i) => (
                      <tr
                        key={i}
                        className={`border-t border-border/60 ${i % 2 === 1 ? "bg-secondary/40" : ""}`}
                      >
                        {chart.columns.map((c) => (
                          <td key={c} className="px-3 py-2.5 text-foreground">
                            {String(row[c])}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-start gap-2 text-xs text-muted-foreground">
                <Info className="w-3.5 h-3.5 mt-0.5 text-primary" />
                <p>Measurements may vary slightly (±0.5 inch). All values are in inches.</p>
              </div>

              <div className="glass-card p-5">
                <h4 className="font-heading font-semibold text-sm mb-3 text-foreground">How to measure</h4>
                <ul className="space-y-2 text-xs text-muted-foreground leading-relaxed">
                  {chart.tips.map((t, i) => (
                    <li key={i} className="flex gap-2">
                      <span
                        className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: "var(--gradient-primary)" }}
                      />
                      <span>{t}</span>
                    </li>
                  ))}
                  <li className="flex gap-2">
                    <span
                      className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: "var(--gradient-primary)" }}
                    />
                    <span>Use a soft measuring tape and stand relaxed for the most accurate fit.</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={onClose}
                className="neon-button w-full py-3 text-sm font-heading font-semibold"
              >
                Got it
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default SizeGuide;
