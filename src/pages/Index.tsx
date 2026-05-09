import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Mail, Truck, RotateCcw, ShieldCheck, Gem } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import HeroCarousel from "@/components/HeroCarousel";
import { categories } from "@/data/products";
import { useProducts } from "@/context/ProductContext";
import { toast } from "sonner";

const features = [
  { icon: Truck, title: "Free Delivery", desc: "On orders over ৳2000" },
  { icon: RotateCcw, title: "Easy Returns", desc: "7-day return policy" },
  { icon: ShieldCheck, title: "Secure Payment", desc: "Cash on Delivery" },
  { icon: Gem, title: "Premium Quality", desc: "Handpicked materials" },
];

const Index = () => {
  const { getTrendingProducts, getFeaturedProducts, getSeasonalProducts, products } = useProducts();
  const trending = getTrendingProducts().slice(0, 8);
  const featured = getFeaturedProducts().slice(0, 8);
  const latestProducts = products.slice(0, 6);

  // Show only the selected seasonal collection if one is active
  const savedSeason = localStorage.getItem("clothify_season");
  const seasonalProducts = savedSeason ? getSeasonalProducts(savedSeason) : [];
  const seasonLabels: Record<string, string> = { eid: "🌙 Eid Collection", winter: "❄️ Winter Collection", summer: "☀️ Summer Collection" };

  const [email, setEmail] = useState("");

  const sectionAnim = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.6 },
  };

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success("Subscribed to newsletter!");
    setEmail("");
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      <section className="px-4 md:px-6 pt-24 md:pt-28 pb-8 md:pb-10 max-w-7xl mx-auto">
        <HeroCarousel products={latestProducts} />
      </section>

      <section className="px-4 md:px-6 pb-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="glass-card p-4 md:p-6 rounded-2xl md:rounded-3xl flex items-center gap-3 md:gap-4 transition-all duration-300"
            >
              <div
                className="w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center shrink-0"
                style={{
                  background: "linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)",
                  boxShadow: "0 8px 20px rgba(59,130,246,0.35)",
                }}
              >
                <f.icon className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
              <div className="min-w-0">
                <h3 className="font-heading font-semibold text-sm md:text-base text-foreground truncate">{f.title}</h3>
                <p className="text-xs text-muted-foreground truncate">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {savedSeason && seasonalProducts.length > 0 && (
        <section className="px-4 md:px-6 py-12 md:py-16 max-w-7xl mx-auto">
          <motion.div {...sectionAnim}>
            <SectionHeader title={seasonLabels[savedSeason] || "Seasonal Collection"} subtitle="Curated picks for the season" link="/shop" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {seasonalProducts.slice(0, 8).map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          </motion.div>
        </section>
      )}

      <section className="px-4 md:px-6 py-12 md:py-16 max-w-7xl mx-auto">
        <motion.div {...sectionAnim}>
          <SectionHeader title="Trending Now" subtitle="Most popular picks this season" link="/trending" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {trending.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </motion.div>
      </section>

      <section className="px-4 md:px-6 py-12 md:py-16 max-w-7xl mx-auto">
        <motion.div {...sectionAnim}>
          <SectionHeader title="Latest Collection" subtitle="Fresh arrivals just for you" link="/shop" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {featured.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </motion.div>
      </section>

      <section className="px-4 md:px-6 py-12 md:py-16 max-w-7xl mx-auto">
        <motion.div {...sectionAnim}>
          <SectionHeader title="Featured Categories" subtitle="Browse by category" link="/categories" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categories.map((cat, i) => (
              <motion.div key={cat.slug} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.05 }}>
                <Link to={`/${cat.slug}`} className="block group">
                  <div className="glass-card overflow-hidden relative">
                    <div className="aspect-[3/5] overflow-hidden">
                      <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                      <h3 className="font-heading font-bold text-base md:text-lg text-foreground">{cat.name}</h3>
                      <span className="text-xs text-primary font-mono mt-1 inline-flex items-center gap-1">Explore <ArrowRight className="w-3 h-3" /></span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="px-4 md:px-6 py-12 md:py-16 max-w-7xl mx-auto">
        <motion.div {...sectionAnim}>
          <h2 className="section-title text-foreground text-center mb-8 md:mb-10">Customer Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {[
              { name: "Rahim K.", text: "Amazing quality and modern design! Clothify Shopping never disappoints.", rating: 5 },
              { name: "Nusrat A.", text: "The panjabi collection is stunning. Fast delivery too.", rating: 5 },
              { name: "Tanvir H.", text: "Best online shopping experience. Love the clean design!", rating: 4 },
            ].map((review, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass-card p-5 md:p-6">
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: review.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm text-foreground/80 mb-4 leading-relaxed break-words">"{review.text}"</p>
                <p className="text-xs font-heading font-bold text-foreground">{review.name}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="px-4 md:px-6 py-12 md:py-16 max-w-3xl mx-auto">
        <motion.div {...sectionAnim} className="glass-card p-6 md:p-12 text-center">
          <Mail className="w-8 h-8 md:w-10 md:h-10 text-primary mx-auto mb-4" />
          <h2 className="font-heading text-xl md:text-3xl font-bold text-foreground mb-3">Stay Updated</h2>
          <p className="text-sm text-muted-foreground mb-6">Subscribe to get exclusive offers and new arrivals.</p>
          <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)}
              className="flex-1 bg-white/50 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none border border-border focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-300" />
            <button type="submit" className="neon-button h-10 md:h-12 px-6 text-xs md:text-sm rounded-xl">Subscribe</button>
          </form>
        </motion.div>
      </section>
    </div>
  );
};

const SectionHeader = ({ title, subtitle, link }: { title: string; subtitle: string; link: string }) => (
  <div className="flex items-end justify-between mb-8">
    <div>
      <h2 className="section-title text-foreground">{title}</h2>
      <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
    </div>
    <Link to={link} className="text-sm text-primary hover:underline font-mono hidden md:flex items-center gap-1">
      View All <ArrowRight className="w-3 h-3" />
    </Link>
  </div>
);

export default Index;
