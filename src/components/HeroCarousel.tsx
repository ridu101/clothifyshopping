import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ShoppingBag, ArrowRight } from "lucide-react";
import { Product, categories } from "@/data/products";
import { useProducts } from "@/context/ProductContext";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

interface Props {
  products?: Product[];
}

const HeroCarousel = ({ products: incoming }: Props) => {
  const { getProductsByCategory } = useProducts();
  const { addItem, setIsCartOpen } = useCart();

  const items = useMemo<Product[]>(() => {
    const picks = categories
      .map((c) => getProductsByCategory(c.slug)[0])
      .filter(Boolean) as Product[];
    return picks.length ? picks : incoming?.slice(0, 6) ?? [];
  }, [getProductsByCategory, incoming]);

  const [current, setCurrent] = useState(0);
  const next = useCallback(
    () => setCurrent((p) => (p + 1) % items.length),
    [items.length]
  );
  const prev = useCallback(
    () => setCurrent((p) => (p - 1 + items.length) % items.length),
    [items.length]
  );

  useEffect(() => {
    if (items.length <= 1) return;
    const t = setInterval(next, 4000);
    return () => clearInterval(t);
  }, [next, items.length]);

  if (!items.length) return null;

  const getRel = (i: number) => {
    const n = items.length;
    let d = i - current;
    if (d > n / 2) d -= n;
    if (d < -n / 2) d += n;
    return d;
  };

  const handleAddToCart = (p: Product) => {
    const size = p.sizes?.[0] ?? "M";
    addItem(p, size);
    toast.success(`${p.title} added to cart`);
    setIsCartOpen(true);
  };

  return (
    <div className="relative w-full">
      {/* Animated background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[40px]">
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -left-20 w-[480px] h-[480px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(120,116,236,0.45) 0%, transparent 70%)",
            filter: "blur(70px)",
          }}
        />
        <motion.div
          animate={{ x: [0, -50, 0], y: [0, -40, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-32 -right-20 w-[560px] h-[560px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(165,157,255,0.4) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[300px] h-[300px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(120,116,236,0.25) 0%, transparent 70%)",
            filter: "blur(50px)",
          }}
        />
      </div>

      <div
        className="relative min-h-[520px] md:min-h-[780px] flex items-center justify-center overflow-hidden rounded-[40px] bg-white/40 backdrop-blur-2xl border border-white/40"
        style={{ boxShadow: "0 30px 100px rgba(120,116,236,0.25)" }}
      >
        {items.map((p, i) => {
          const rel = getRel(i);
          const isActive = rel === 0;
          const abs = Math.abs(rel);
          if (abs > 2) return null;

          const hideOnMobile = abs > 0;

          return (
            <motion.div
              key={p.id}
              initial={false}
              animate={{
                x: `${rel * 62}%`,
                scale: isActive ? 1 : abs === 1 ? 0.82 : 0.66,
                opacity: abs >= 2 ? 0 : isActive ? 1 : 0.75,
                filter: isActive ? "blur(0px)" : "blur(1.5px)",
                zIndex: 10 - abs,
              }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => !isActive && setCurrent(i)}
              className={`absolute top-1/2 -translate-y-1/2 ${
                isActive ? "" : "cursor-pointer"
              } ${hideOnMobile ? "hidden md:block" : ""}`}
              style={{ width: isActive ? "min(560px, 90%)" : "min(420px, 70%)" }}
            >
              <div
                className="relative aspect-[4/5] overflow-hidden rounded-[36px] border border-white/40 group"
                style={{
                  boxShadow: isActive
                    ? "0 40px 100px rgba(120,116,236,0.5), 0 0 0 1px rgba(120,116,236,0.3)"
                    : "0 12px 40px rgba(120,116,236,0.18)",
                }}
              >
                <motion.img
                  src={p.image}
                  alt={p.title}
                  loading="lazy"
                  animate={isActive ? { y: [0, -10, 0] } : { y: 0 }}
                  transition={{
                    duration: 6,
                    repeat: isActive ? Infinity : 0,
                    ease: "easeInOut",
                  }}
                  className="w-full h-full object-cover"
                />

                {/* Strong dark gradient overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />
                {/* Subtle purple tint */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#7874EC]/20 via-transparent to-transparent" />

                {/* Side card mini-label */}
                {!isActive && (
                  <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-purple-200">
                      {p.category}
                    </span>
                    <h3 className="font-heading text-lg font-semibold truncate">
                      {p.title}
                    </h3>
                  </div>
                )}

                {/* Active card content */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 12 }}
                      transition={{ duration: 0.5, delay: 0.15 }}
                      className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 text-white"
                    >
                      <span className="text-xs md:text-sm uppercase tracking-[0.3em] text-purple-200 mb-3">
                        {p.category}
                      </span>
                      <h2 className="font-heading text-2xl md:text-6xl font-bold leading-tight mb-3 drop-shadow-2xl">
                        {p.title}
                      </h2>
                      <p className="text-sm md:text-base text-white/85 mb-5 max-w-md font-light line-clamp-2">
                        {p.description ||
                          "Premium futuristic essentials crafted for modern luxury."}
                      </p>
                      <div className="flex items-center gap-3 mb-6">
                        <span className="text-2xl md:text-3xl font-semibold text-white drop-shadow-md">
                          ৳{p.price}
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(p);
                          }}
                          className="w-full sm:w-auto px-6 py-3 rounded-full text-sm font-semibold text-white inline-flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 hover:brightness-110"
                          style={{
                            background:
                              "linear-gradient(135deg, #7874EC 0%, #9F9CF7 100%)",
                            boxShadow:
                              "0 10px 30px rgba(120,116,236,0.55)",
                          }}
                        >
                          <ShoppingBag className="w-4 h-4" />
                          Add To Cart
                        </button>
                        <Link
                          to={`/product/${p.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full sm:w-auto px-6 py-3 rounded-full text-sm font-semibold text-white inline-flex items-center justify-center gap-2 bg-white/15 backdrop-blur-xl border border-white/30 transition-all duration-300 hover:bg-white/25 hover:scale-105"
                        >
                          Shop Now
                          <ArrowRight className="w-4 h-4" />
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
          className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center bg-white/70 backdrop-blur-xl border border-white/50 transition-all duration-300 hover:scale-110 hover:bg-white"
          style={{ boxShadow: "0 10px 30px rgba(120,116,236,0.35)" }}
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-primary" />
        </button>
        <button
          onClick={next}
          aria-label="Next"
          className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center bg-white/70 backdrop-blur-xl border border-white/50 transition-all duration-300 hover:scale-110 hover:bg-white"
          style={{ boxShadow: "0 10px 30px rgba(120,116,236,0.35)" }}
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-primary" />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === current
                  ? "w-10 bg-primary"
                  : "w-1.5 bg-primary/30 hover:bg-primary/50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroCarousel;
