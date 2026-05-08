import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Product } from "@/data/products";
import { useProducts } from "@/context/ProductContext";
import { categories } from "@/data/products";

interface Props {
  products?: Product[];
}

const HeroCarousel = ({ products: incoming }: Props) => {
  const { getProductsByCategory } = useProducts();

  // First product per category (futuristic luxury showcase)
  const items = useMemo<Product[]>(() => {
    const picks = categories
      .map(c => getProductsByCategory(c.slug)[0])
      .filter(Boolean) as Product[];
    return picks.length ? picks : (incoming?.slice(0, 6) ?? []);
  }, [getProductsByCategory, incoming]);

  const [current, setCurrent] = useState(0);
  const next = useCallback(() => setCurrent(p => (p + 1) % items.length), [items.length]);
  const prev = useCallback(() => setCurrent(p => (p - 1 + items.length) % items.length), [items.length]);

  useEffect(() => {
    if (items.length <= 1) return;
    const timer = setInterval(next, 3000);
    return () => clearInterval(timer);
  }, [next, items.length]);

  if (!items.length) return null;

  const getRel = (i: number) => {
    const n = items.length;
    let d = i - current;
    if (d > n / 2) d -= n;
    if (d < -n / 2) d += n;
    return d; // -2, -1, 0, 1, 2
  };

  return (
    <div className="relative w-full">
      {/* Decorative glow blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[40px]">
        <div
          className="absolute -top-32 -left-20 w-[480px] h-[480px] rounded-full opacity-60"
          style={{ background: "radial-gradient(circle, rgba(120,116,236,0.35) 0%, transparent 70%)", filter: "blur(60px)" }}
        />
        <div
          className="absolute -bottom-32 -right-20 w-[520px] h-[520px] rounded-full opacity-60"
          style={{ background: "radial-gradient(circle, rgba(159,156,247,0.3) 0%, transparent 70%)", filter: "blur(70px)" }}
        />
      </div>

      <div
        className="relative h-[460px] md:h-[560px] flex items-center justify-center overflow-hidden rounded-[40px] bg-white/40 backdrop-blur-xl border border-white/30"
        style={{ boxShadow: "0 20px 80px rgba(120,116,236,0.25)" }}
      >
        {items.map((p, i) => {
          const rel = getRel(i);
          const isActive = rel === 0;
          const abs = Math.abs(rel);
          if (abs > 2) return null;

          // hide side cards on mobile
          const hideOnMobile = abs > 0;

          return (
            <motion.div
              key={p.id}
              initial={false}
              animate={{
                x: `${rel * 58}%`,
                scale: isActive ? 1 : abs === 1 ? 0.78 : 0.6,
                opacity: abs >= 2 ? 0 : isActive ? 1 : 0.55,
                filter: isActive ? "blur(0px)" : "blur(3px)",
                zIndex: 10 - abs,
              }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => !isActive && setCurrent(i)}
              className={`absolute top-1/2 -translate-y-1/2 cursor-pointer ${hideOnMobile ? "hidden md:block" : ""}`}
              style={{ width: "min(420px, 78%)" }}
            >
              <div
                className="relative aspect-[4/5] overflow-hidden rounded-[36px] border border-white/40"
                style={{
                  boxShadow: isActive
                    ? "0 30px 80px rgba(120,116,236,0.45), 0 0 0 1px rgba(120,116,236,0.25)"
                    : "0 10px 40px rgba(120,116,236,0.18)",
                }}
              >
                <img
                  src={p.image}
                  alt={p.title}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Content (only on active) */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.5, delay: 0.15 }}
                      className="absolute inset-0 flex flex-col justify-end p-6 md:p-10 text-white"
                    >
                      <span className="text-[11px] md:text-xs font-mono uppercase tracking-[0.3em] text-white/80 mb-2">
                        {p.category}
                      </span>
                      <h2 className="font-heading text-3xl md:text-5xl font-light leading-tight mb-2 drop-shadow-lg">
                        {p.title}
                      </h2>
                      <p className="text-xs md:text-sm text-white/75 mb-4 line-clamp-1 max-w-sm font-light">
                        Premium futuristic essentials
                      </p>
                      <div className="flex items-center gap-4">
                        <span className="font-mono font-bold text-xl md:text-2xl text-white drop-shadow-md">
                          ৳{p.price}
                        </span>
                        <Link
                          to={`/product/${p.id}`}
                          className="px-5 py-2.5 rounded-xl text-xs md:text-sm font-heading font-semibold text-white transition-all duration-300 hover:scale-105"
                          style={{
                            background: "linear-gradient(135deg, #7874EC 0%, #9F9CF7 100%)",
                            boxShadow: "0 8px 24px rgba(120,116,236,0.5)",
                          }}
                        >
                          Shop Now
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}

        {/* Arrows */}
        <button
          onClick={prev}
          aria-label="Previous"
          className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center bg-white/60 backdrop-blur-xl border border-white/40 transition-all duration-300 hover:scale-110"
          style={{ boxShadow: "0 8px 24px rgba(120,116,236,0.25)" }}
        >
          <ChevronLeft className="w-5 h-5 text-primary" />
        </button>
        <button
          onClick={next}
          aria-label="Next"
          className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center bg-white/60 backdrop-blur-xl border border-white/40 transition-all duration-300 hover:scale-110"
          style={{ boxShadow: "0 8px 24px rgba(120,116,236,0.25)" }}
        >
          <ChevronRight className="w-5 h-5 text-primary" />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === current ? "w-8 bg-primary" : "w-1.5 bg-primary/30 hover:bg-primary/50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroCarousel;
