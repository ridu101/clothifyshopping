import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
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

const EASE = [0.22, 1, 0.36, 1] as const;
const DUR = 0.9;

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
  const [direction, setDirection] = useState<1 | -1>(1);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((p) => (p + 1) % Math.max(items.length, 1));
  }, [items.length]);
  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((p) => (p - 1 + items.length) % Math.max(items.length, 1));
  }, [items.length]);

  useEffect(() => {
    if (items.length <= 1) return;
    const t = setInterval(next, 4000);
    return () => clearInterval(t);
  }, [next, items.length]);

  // Mouse parallax
  const stageRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 60, damping: 18, mass: 0.6 });
  const cardX = useTransform(sx, (v) => v * 18);
  const cardY = useTransform(sy, (v) => v * 12);
  const imgX = useTransform(sx, (v) => v * 28);
  const imgY = useTransform(sy, (v) => v * 18);
  const blobX = useTransform(sx, (v) => v * 40);
  const blobY = useTransform(sy, (v) => v * 30);

  const handleMouseMove = (e: React.MouseEvent) => {
    const r = stageRef.current?.getBoundingClientRect();
    if (!r) return;
    mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
    my.set(((e.clientY - r.top) / r.height) * 2 - 1);
  };
  const handleMouseLeave = () => {
    mx.set(0);
    my.set(0);
  };

  // Touch swipe (mobile)
  const touchStart = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => (touchStart.current = e.touches[0].clientX);
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStart.current;
    if (Math.abs(dx) > 50) (dx < 0 ? next : prev)();
    touchStart.current = null;
  };

  if (!items.length) return null;

  const handleAddToCart = (p: Product) => {
    const size = p.sizes?.[0] ?? "M";
    addItem(p, size);
    toast.success(`${p.title} added to cart`);
    setIsCartOpen(true);
  };

  const active = items[current];
  type Slot = "left" | "center" | "right";

  const visibleSlides = useMemo(() => {
    const total = items.length;
    const slides: Array<{ slot: Slot; product: Product; index: number }> = [
      { slot: "center", product: active, index: current },
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

  const getSlotMotion = (slot: Slot) => {
    const states = {
      left: { x: -430, scale: 0.88, opacity: 0.6, zIndex: 10, rotateY: 8, filter: "blur(1px) brightness(0.9)" },
      center: { x: 0, scale: 1, opacity: 1, zIndex: 30, rotateY: 0, filter: "blur(0px) brightness(1)" },
      right: { x: 430, scale: 0.88, opacity: 0.6, zIndex: 10, rotateY: -8, filter: "blur(1px) brightness(0.9)" },
    };
    return states[slot];
  };

  return (
    <div className="relative w-full">
      {/* Decorative animated background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[40px]">
        <motion.div
          style={{
            background: "radial-gradient(circle, rgba(120,116,236,0.55) 0%, transparent 70%)",
            filter: "blur(80px)",
            x: blobX,
            y: blobY,
            willChange: "transform",
          }}
          animate={{ x: [0, 50, -20, 0], y: [0, 30, -10, 0], scale: [1, 1.1, 0.95, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -left-24 w-[520px] h-[520px] rounded-full"
        />
        <motion.div
          style={{
            background: "radial-gradient(circle, rgba(165,157,255,0.5) 0%, transparent 70%)",
            filter: "blur(90px)",
            willChange: "transform",
          }}
          animate={{ x: [0, -60, 20, 0], y: [0, -40, 30, 0], scale: [1, 0.95, 1.08, 1] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-40 -right-24 w-[600px] h-[600px] rounded-full"
        />
        <motion.div
          animate={{ scale: [1, 1.25, 1], opacity: [0.25, 0.55, 0.25] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[340px] h-[340px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(120,116,236,0.3) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        {/* Floating particles */}
        {[...Array(10)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full"
            style={{
              background: "rgba(120,116,236,0.7)",
              boxShadow: "0 0 12px rgba(120,116,236,0.7)",
              top: `${(i * 47) % 90 + 5}%`,
              left: `${(i * 31) % 90 + 5}%`,
              willChange: "transform",
            }}
            animate={{ y: [0, -28, 0], opacity: [0.3, 0.9, 0.3] }}
            transition={{ duration: 5 + (i % 4), repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
          />
        ))}
        {/* Glass reflection sheen */}
        <motion.div
          className="absolute inset-y-0 w-[40%] -skew-x-12"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)",
            willChange: "transform",
          }}
          animate={{ x: ["-30%", "180%"] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", repeatDelay: 2 }}
        />
      </div>

      {/* Hero stage */}
      <div
        ref={stageRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className="relative min-h-[520px] md:min-h-[780px] lg:min-h-[860px] flex items-center justify-center overflow-hidden rounded-[28px] md:rounded-[40px] bg-white/40 backdrop-blur-2xl border border-white/40 px-3 md:px-10 py-6 md:py-16"
        style={{ boxShadow: "0 30px 100px rgba(59,130,246,0.22)" }}
      >
        {/* Carousel cards */}
        <div
          className="relative w-full h-[500px] md:h-[620px] flex items-center justify-center overflow-visible"
          style={{ perspective: "1600px", transformStyle: "preserve-3d" }}
        >
          <AnimatePresence initial={false} custom={direction}>
            {visibleSlides.map(({ slot, product, index }) => {
              const motionState = getSlotMotion(slot);
              const isCenter = slot === "center";
              return (
                <motion.div
                  key={`${product.id}-${slot}`}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[88%] sm:w-[70%] md:w-[460px] h-full"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={motionState}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: DUR, ease: EASE }}
                  style={{ x: isCenter ? cardX : undefined, y: isCenter ? cardY : undefined }}
                  onClick={() => {
                    if (!isCenter) {
                      setDirection(slot === "right" ? 1 : -1);
                      setCurrent(index);
                    }
                  }}
                >
                  {isCenter ? (
                    <ActiveCard
                      p={product}
                      direction={direction}
                      imgX={imgX}
                      imgY={imgY}
                      onAddToCart={() => handleAddToCart(product)}
                    />
                  ) : (
                    <SideCard p={product} side={slot as "left" | "right"} />
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {items.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous"
              className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/70 backdrop-blur-xl border border-white/60 text-primary flex items-center justify-center hover:bg-white transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              aria-label="Next"
              className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/70 backdrop-blur-xl border border-white/60 text-primary flex items-center justify-center hover:bg-white transition"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Indicators */}
        <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > current ? 1 : -1);
                setCurrent(i);
              }}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === current ? "w-8 md:w-10 bg-primary" : "w-1.5 bg-primary/30 hover:bg-primary/50"
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
  direction,
  imgX,
  imgY,
  onAddToCart,
}: {
  p: Product;
  direction: 1 | -1;
  imgX: any;
  imgY: any;
  onAddToCart: () => void;
}) => {
  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={p.id}
        custom={direction}
        initial={{ opacity: 0, scale: 0.92, x: direction * 60 }}
        animate={{
          opacity: 1,
          scale: 1,
          x: 0,
          boxShadow: [
            "0 40px 100px rgba(120,116,236,0.4), 0 0 0 1px rgba(120,116,236,0.25)",
            "0 50px 120px rgba(120,116,236,0.6), 0 0 0 1px rgba(120,116,236,0.35)",
            "0 40px 100px rgba(120,116,236,0.4), 0 0 0 1px rgba(120,116,236,0.25)",
          ],
        }}
        exit={{ opacity: 0, scale: 0.92, x: -direction * 60 }}
        transition={{
          duration: DUR,
          ease: EASE,
          boxShadow: { duration: 4, repeat: Infinity, ease: "easeInOut" },
        }}
        className="relative w-full overflow-hidden rounded-[40px] border border-white/50 bg-gradient-to-br from-[#7874EC] via-[#8C88F0] to-[#A59DFF] will-change-transform"
        style={{ minHeight: "min(620px, 75vh)" }}
      >
        {/* Best seller badge */}
        <div className="absolute top-5 left-5 z-20 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-xl border border-white/60 text-[11px] font-semibold uppercase tracking-wider text-primary">
          <Sparkles className="w-3 h-3" />
          Best Seller
        </div>

        {/* Floating product image with parallax */}
        <motion.div
          style={{ x: imgX, y: imgY, willChange: "transform" }}
          className="relative z-10 flex items-center justify-center pt-12 pb-4 md:pt-14 md:pb-6"
        >
          <motion.img
            src={p.image}
            alt={p.title}
            loading="lazy"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-full max-w-[420px] h-[280px] md:h-[420px] object-contain drop-shadow-[0_30px_50px_rgba(0,0,0,0.35)] will-change-transform"
          />
        </motion.div>

        {/* Bottom dark gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-[55%] bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />

        {/* Bottom content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
          className="absolute bottom-0 left-0 right-0 p-6 md:p-10 z-20 text-white"
        >
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
                <Star key={i} className="w-3.5 h-3.5 fill-yellow-300 text-yellow-300" />
              ))}
            </div>
            <span className="text-xs text-white/70">(128 reviews)</span>
          </div>
          <div className="flex items-center justify-between flex-wrap gap-4 mb-5">
            <span className="text-3xl md:text-4xl font-bold text-white drop-shadow-md">৳{p.price}</span>
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
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ---------- Side preview card ---------- */
const SideCard = ({ p, side }: { p: Product; side: "left" | "right" }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    transition={{ duration: 0.4, ease: EASE }}
    className="relative w-full h-full overflow-hidden rounded-[28px] border border-white/50 bg-white/65 backdrop-blur-md will-change-transform"
    style={{
      boxShadow:
        side === "left"
          ? "-18px 24px 55px rgba(120,116,236,0.28)"
          : "18px 24px 55px rgba(120,116,236,0.28)",
    }}
  >
    <div className="relative w-full h-full">
      <img src={p.image} alt={p.title} loading="lazy" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/22 to-white/5" />
      <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
        <span className="text-[10px] uppercase tracking-[0.25em] text-purple-200">{p.category}</span>
        <h3 className="font-heading text-base font-semibold leading-tight line-clamp-2 mt-1">
          {p.title}
        </h3>
        <span className="text-sm font-bold">৳{p.price}</span>
      </div>
    </div>
  </motion.div>
);

export default HeroCarousel;
