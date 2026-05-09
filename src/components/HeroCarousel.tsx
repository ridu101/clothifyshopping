import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { ShoppingBag, ArrowRight, Sparkles, Star, ShieldCheck } from "lucide-react";
import { Product, categories } from "@/data/products";
import { useProducts } from "@/context/ProductContext";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

interface Props {
  products?: Product[];
}

const EASE = [0.22, 1, 0.36, 1] as const;

const SLIDE_META = [
  { tag: "New Arrival", title: "Premium Panjabi Collection", subtitle: "Tailored elegance crafted for the modern man.", slug: "panjabi" },
  { tag: "Trending", title: "Luxury Streetwear", subtitle: "Bold silhouettes. Refined details. Everyday icon.", slug: "tshirt" },
  { tag: "Winter 2026", title: "Winter Essentials", subtitle: "Stay warm, stay sharp — engineered for the season.", slug: "jacket" },
  { tag: "Signature", title: "Premium Polo Collection", subtitle: "Effortless polish for work, weekends, and beyond.", slug: "polo" },
  { tag: "Everyday Luxe", title: "Modern Casual Wear", subtitle: "Soft fabrics, sharp cuts. Comfort redefined.", slug: "shirt" },
];

const HeroCarousel = ({ products: incoming }: Props) => {
  const { getProductsByCategory } = useProducts();
  const { addItem, setIsCartOpen } = useCart();

  const slides = useMemo(() => {
    const list = SLIDE_META.map((m) => {
      const fromCat = getProductsByCategory(m.slug)[0];
      return { ...m, product: fromCat };
    }).filter((s) => s.product) as Array<typeof SLIDE_META[number] & { product: Product }>;

    if (list.length) return list;
    // fallback to incoming
    return (incoming?.slice(0, 5) ?? []).map((p, i) => {
      const meta = SLIDE_META[i % SLIDE_META.length];
      return { ...meta, product: p };
    });
  }, [getProductsByCategory, incoming]);

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(() => setCurrent((p) => (p + 1) % slides.length), 4500);
    return () => clearInterval(t);
  }, [slides.length]);

  // mouse parallax (desktop only)
  const stageRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 60, damping: 18, mass: 0.6 });
  const imgX = useTransform(sx, (v) => v * 22);
  const imgY = useTransform(sy, (v) => v * 16);
  const blobX = useTransform(sx, (v) => v * 35);
  const blobY = useTransform(sy, (v) => v * 25);

  const onMouseMove = (e: React.MouseEvent) => {
    const r = stageRef.current?.getBoundingClientRect();
    if (!r) return;
    mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
    my.set(((e.clientY - r.top) / r.height) * 2 - 1);
  };
  const onMouseLeave = () => {
    mx.set(0);
    my.set(0);
  };

  if (!slides.length) return null;
  const slide = slides[current];
  const next = slides[(current + 1) % slides.length];

  const handleAddToCart = () => {
    const p = slide.product;
    const size = p.sizes?.[0] ?? "M";
    addItem(p, size);
    toast.success(`${p.title} added to cart`);
    setIsCartOpen(true);
  };

  return (
    <section
      ref={stageRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="relative w-full overflow-hidden rounded-3xl md:rounded-[40px] bg-gradient-to-br from-white/70 via-white/40 to-blue-50/60 backdrop-blur-2xl border border-white/50"
      style={{ boxShadow: "0 30px 100px rgba(59,130,246,0.18)" }}
    >
      {/* Animated background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          style={{ x: blobX, y: blobY }}
          animate={{ x: [0, 40, -20, 0], y: [0, 30, -10, 0], scale: [1, 1.1, 0.95, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -left-24 w-[420px] h-[420px] rounded-full"
          aria-hidden
        >
          <div className="w-full h-full rounded-full" style={{ background: "radial-gradient(circle, hsl(var(--primary)/0.45) 0%, transparent 70%)", filter: "blur(70px)" }} />
        </motion.div>
        <motion.div
          animate={{ x: [0, -40, 20, 0], y: [0, -30, 20, 0], scale: [1, 0.95, 1.1, 1] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-32 -right-20 w-[480px] h-[480px] rounded-full"
          aria-hidden
        >
          <div className="w-full h-full rounded-full" style={{ background: "radial-gradient(circle, hsl(var(--secondary)/0.45) 0%, transparent 70%)", filter: "blur(80px)" }} />
        </motion.div>
        {/* particles */}
        <div className="hidden md:block">
          {[...Array(8)].map((_, i) => (
            <motion.span
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-primary/60"
              style={{
                top: `${(i * 53) % 90 + 5}%`,
                left: `${(i * 37) % 90 + 5}%`,
                boxShadow: "0 0 12px hsl(var(--primary)/0.6)",
              }}
              animate={{ y: [0, -24, 0], opacity: [0.3, 0.9, 0.3] }}
              transition={{ duration: 5 + (i % 4), repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
            />
          ))}
        </div>
      </div>

      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 px-5 sm:px-8 md:px-12 lg:px-16 py-8 md:py-14 lg:py-16 min-h-[560px] md:min-h-[600px] lg:min-h-[680px] items-center">
        {/* LEFT: copy */}
        <div className="order-2 md:order-1 text-center md:text-left">
          <AnimatePresence mode="wait">
            <motion.div
              key={`txt-${current}`}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 backdrop-blur-md border border-primary/20 text-[10px] md:text-xs uppercase tracking-[0.2em] text-primary font-semibold">
                <Sparkles className="w-3 h-3" /> {slide.tag}
              </span>
              <h1 className="mt-4 font-heading font-bold leading-[1.05] text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground">
                {slide.title.split(" ").map((w, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 + i * 0.05, ease: EASE }}
                    className="inline-block mr-[0.25em]"
                  >
                    {i === slide.title.split(" ").length - 1 ? <span className="text-gradient">{w}</span> : w}
                  </motion.span>
                ))}
              </h1>
              <p className="mt-4 text-sm md:text-base lg:text-lg text-muted-foreground max-w-md mx-auto md:mx-0">
                {slide.subtitle}
              </p>

              {/* category tags */}
              <div className="mt-5 flex flex-wrap justify-center md:justify-start gap-2">
                {categories.slice(0, 4).map((c) => (
                  <Link
                    key={c.slug}
                    to={`/${c.slug}`}
                    className="text-[10px] md:text-xs px-3 py-1 rounded-full bg-white/60 backdrop-blur-md border border-white/60 text-foreground/80 hover:text-primary hover:border-primary/40 transition"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>

              {/* CTAs */}
              <div className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                <button
                  onClick={handleAddToCart}
                  className="h-12 md:h-14 px-6 md:px-8 rounded-2xl text-sm md:text-base font-semibold text-white inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-secondary transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_10px_40px_hsl(var(--primary)/0.5)]"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Shop Now
                </button>
                <Link
                  to={`/${slide.slug}`}
                  className="h-12 md:h-14 px-6 md:px-8 rounded-2xl text-sm md:text-base font-semibold text-primary inline-flex items-center justify-center gap-2 bg-white/70 backdrop-blur-xl border border-primary/30 transition-all duration-300 hover:bg-white hover:scale-[1.03]"
                >
                  Explore Collection
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* slide indicators */}
          <div className="mt-7 md:mt-10 flex justify-center md:justify-start gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === current ? "w-8 bg-primary" : "w-1.5 bg-primary/30 hover:bg-primary/50"
                }`}
              />
            ))}
          </div>
        </div>

        {/* RIGHT: visual */}
        <div className="order-1 md:order-2 relative flex items-center justify-center">
          <div className="relative w-full max-w-[420px] md:max-w-[480px] aspect-[4/5]">
            <AnimatePresence mode="wait">
              <motion.div
                key={`img-${current}`}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.9, ease: EASE }}
                className="absolute inset-0 rounded-3xl md:rounded-[36px] overflow-hidden border border-white/60 bg-white/40 backdrop-blur-md"
                style={{ boxShadow: "0 30px 80px hsl(var(--primary)/0.28)" }}
              >
                <motion.img
                  src={slide.product.image}
                  alt={slide.product.title}
                  loading="eager"
                  style={{ x: imgX, y: imgY }}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
                  className="w-full h-full object-cover will-change-transform"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                {/* price chip */}
                <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-xl border border-white/70 text-[11px] md:text-xs font-semibold text-primary">
                  <Sparkles className="w-3 h-3" /> ৳{slide.product.price}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Floating mini card — next slide preview (desktop only) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: [0, -8, 0] }}
              transition={{ y: { duration: 5, repeat: Infinity, ease: "easeInOut" }, opacity: { duration: 0.6 } }}
              className="hidden md:flex absolute -left-8 lg:-left-12 bottom-10 w-36 lg:w-40 rounded-2xl overflow-hidden border border-white/70 bg-white/70 backdrop-blur-xl"
              style={{ boxShadow: "0 20px 50px hsl(var(--primary)/0.25)" }}
            >
              <div className="w-full">
                <img src={next.product.image} alt={next.product.title} loading="lazy" className="w-full h-24 lg:h-28 object-cover" />
                <div className="px-3 py-2">
                  <p className="text-[10px] uppercase tracking-wider text-primary font-semibold">Up Next</p>
                  <p className="text-xs font-semibold text-foreground line-clamp-1">{next.title}</p>
                </div>
              </div>
            </motion.div>

            {/* Floating stats card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0, y: [0, 8, 0] }}
              transition={{ y: { duration: 6, repeat: Infinity, ease: "easeInOut" }, opacity: { duration: 0.6 } }}
              className="hidden md:flex absolute -right-4 lg:-right-8 top-8 flex-col gap-1 px-4 py-3 rounded-2xl border border-white/70 bg-white/75 backdrop-blur-xl"
              style={{ boxShadow: "0 20px 50px hsl(var(--primary)/0.25)" }}
            >
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-[11px] font-semibold text-foreground">4.9 / 5 Rating</p>
              <p className="text-[10px] text-muted-foreground">10k+ happy buyers</p>
            </motion.div>

            {/* Trust badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="hidden lg:flex absolute -bottom-6 right-6 items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary to-secondary text-white text-xs font-semibold"
              style={{ boxShadow: "0 12px 30px hsl(var(--primary)/0.4)" }}
            >
              <ShieldCheck className="w-4 h-4" /> Premium Quality Guaranteed
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroCarousel;
