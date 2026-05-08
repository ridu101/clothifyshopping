import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  ArrowRight,
  Star,
  Sparkles,
} from "lucide-react";
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

  const handleAddToCart = (p: Product) => {
    const size = p.sizes?.[0] ?? "M";
    addItem(p, size);
    toast.success(`${p.title} added to cart`);
    setIsCartOpen(true);
  };

  const active = items[current];
  type CarouselSlot = "left" | "center" | "right";

  const visibleSlides = useMemo(() => {
    const total = items.length;
    const slides: Array<{ slot: CarouselSlot; product: Product; index: number }> = [
      {
        slot: "center",
        product: active,
        index: current,
      },
    ];

    if (total > 1) {
      slides.unshift({
        slot: "left",
        product: items[(current - 1 + total) % total],
        index: (current - 1 + total) % total,
      });

      slides.push({
        slot: "right",
        product: items[(current + 1) % total],
        index: (current + 1) % total,
      });
    }

    return slides;
  }, [active, current, items]);

  const getSlotMotion = (slot: CarouselSlot) => {
    const states = {
      left: {
        x: -430,
        scale: 0.82,
        opacity: 0.7,
        zIndex: 10,
        rotateY: 8,
        filter: "blur(0.8px)",
      },
      center: {
        x: 0,
        scale: 1,
        opacity: 1,
        zIndex: 30,
        rotateY: 0,
        filter: "blur(0px)",
      },
      right: {
        x: 430,
        scale: 0.82,
        opacity: 0.7,
        zIndex: 10,
        rotateY: -8,
        filter: "blur(0.8px)",
      },
    };

    return states[slot];
  };

  return (
    <div className="relative w-full">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[40px]">
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -left-24 w-[520px] h-[520px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(120,116,236,0.5) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <motion.div
          animate={{ x: [0, -60, 0], y: [0, -40, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-40 -right-24 w-[600px] h-[600px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(165,157,255,0.45) 0%, transparent 70%)",
            filter: "blur(90px)",
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[340px] h-[340px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(120,116,236,0.25) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      </div>

      {/* Hero stage */}
      <div
        className="relative min-h-[620px] md:min-h-[780px] lg:min-h-[860px] flex items-center justify-center overflow-hidden rounded-[40px] bg-white/40 backdrop-blur-2xl border border-white/40 px-4 md:px-10 py-10 md:py-16"
        style={{ boxShadow: "0 30px 100px rgba(120,116,236,0.25)" }}
      >
        {/* Carousel cards */}
        <div
          className="relative w-full h-[620px] flex items-center justify-center overflow-visible"
          style={{ perspective: "1400px", transformStyle: "preserve-3d" }}
        >
          {visibleSlides.map(({ product: p, index, slot }) => {
            const isActive = slot === "center";

            return (
              <motion.div
                key={`${p.id}-${slot}`}
                initial={false}
                animate={getSlotMotion(slot)}
                transition={{ duration: 0.7, ease: "easeInOut" }}
                onClick={() => !isActive && setCurrent(index)}
                className={`absolute will-change-transform ${
                  isActive ? "" : "hidden lg:block cursor-pointer"
                }`}
                style={{
                  width: isActive ? "min(620px, 92vw)" : "240px",
                  height: isActive ? "min(620px, 74vh)" : "420px",
                  transformStyle: "preserve-3d",
                }}
              >
                {isActive ? (
                  <ActiveCard p={p} onAddToCart={() => handleAddToCart(p)} />
                ) : (
                  <SideCard p={p} side={slot as "left" | "right"} />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Arrows */}
        <button
          onClick={prev}
          aria-label="Previous"
          className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center bg-white/70 backdrop-blur-xl border border-white/60 transition-all duration-300 hover:scale-110 hover:bg-white"
          style={{ boxShadow: "0 10px 30px rgba(120,116,236,0.35)" }}
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-primary" />
        </button>
        <button
          onClick={next}
          aria-label="Next"
          className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center bg-white/70 backdrop-blur-xl border border-white/60 transition-all duration-300 hover:scale-110 hover:bg-white"
          style={{ boxShadow: "0 10px 30px rgba(120,116,236,0.35)" }}
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-primary" />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
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

/* ---------- Active center card ---------- */
const ActiveCard = ({
  p,
  onAddToCart,
}: {
  p: Product;
  onAddToCart: () => void;
}) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={p.id}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.5 }}
        className="relative w-full overflow-hidden rounded-[40px] border border-white/50 bg-gradient-to-br from-[#7874EC] via-[#8C88F0] to-[#A59DFF]"
        style={{
          boxShadow:
            "0 40px 100px rgba(120,116,236,0.5), 0 0 0 1px rgba(120,116,236,0.3)",
          minHeight: "min(620px, 75vh)",
        }}
      >
        {/* Best seller badge */}
        <div className="absolute top-5 left-5 z-20 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-xl border border-white/60 text-[11px] font-semibold uppercase tracking-wider text-primary">
          <Sparkles className="w-3 h-3" />
          Best Seller
        </div>

        {/* Floating product image */}
        <motion.div
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-10 flex items-center justify-center pt-12 pb-4 md:pt-14 md:pb-6"
        >
          <img
            src={p.image}
            alt={p.title}
            loading="lazy"
            className="w-full max-w-[420px] h-[280px] md:h-[420px] object-contain drop-shadow-[0_30px_50px_rgba(0,0,0,0.35)]"
          />
        </motion.div>

        {/* Bottom dark gradient for legibility */}
        <div className="absolute bottom-0 left-0 right-0 h-[55%] bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 z-20 text-white">
          <span className="block text-[11px] md:text-xs uppercase tracking-[0.3em] text-purple-100 mb-2">
            {p.category}
          </span>
          <h2 className="font-heading text-3xl md:text-5xl font-bold leading-tight mb-2 drop-shadow-2xl">
            {p.title}
          </h2>
          <p className="text-sm md:text-base text-white/85 mb-3 max-w-md font-light line-clamp-2">
            {p.description}
          </p>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="w-3.5 h-3.5 fill-yellow-300 text-yellow-300"
                />
              ))}
            </div>
            <span className="text-xs text-white/70">(128 reviews)</span>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-4 mb-5">
            <span className="text-3xl md:text-4xl font-bold text-white drop-shadow-md">
              ৳{p.price}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onAddToCart}
              className="w-full sm:w-auto h-12 md:h-14 px-6 md:px-8 rounded-2xl text-sm font-semibold text-primary bg-white inline-flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.03] hover:bg-white/95"
              style={{ boxShadow: "0 12px 30px rgba(0,0,0,0.25)" }}
            >
              <ShoppingBag className="w-4 h-4" />
              Add To Cart
            </button>
            <Link
              to={`/product/${p.id}`}
              className="w-full sm:w-auto h-12 md:h-14 px-6 md:px-8 rounded-2xl text-sm font-semibold text-white inline-flex items-center justify-center gap-2 bg-white/15 backdrop-blur-xl border border-white/30 transition-all duration-300 hover:bg-white/25 hover:scale-[1.03]"
            >
              Shop Now
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ---------- Side preview card ---------- */
const SideCard = ({ p }: { p: Product }) => (
  <div
    className="relative w-full overflow-hidden rounded-[28px] border border-white/50 bg-white/60 backdrop-blur-xl transition-all duration-300 hover:shadow-[0_20px_50px_rgba(120,116,236,0.35)]"
    style={{
      boxShadow: "0 12px 40px rgba(120,116,236,0.2)",
      height: "min(420px, 60vh)",
    }}
  >
    <div className="relative w-full h-full">
      <img
        src={p.image}
        alt={p.title}
        loading="lazy"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        <span className="text-[10px] uppercase tracking-[0.25em] text-purple-200">
          {p.category}
        </span>
        <h3 className="font-heading text-base font-semibold truncate">
          {p.title}
        </h3>
        <span className="text-sm font-bold">৳{p.price}</span>
      </div>
    </div>
  </div>
);

export default HeroCarousel;
