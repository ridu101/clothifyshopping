import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { categories } from "@/data/products";

const CategoriesPage = () => {
  return (
    <div className="min-h-screen pt-28 px-6 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="section-title text-foreground mb-10">All Categories</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Link to={`/${cat.slug}`} className="block group">
                <div className="glass-card overflow-hidden glow-behind relative">
                  <div className="aspect-[3/5] overflow-hidden">
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/30 to-transparent" />
                  <div className="absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-primary/0 group-hover:ring-primary/40 group-hover:shadow-[0_0_28px_hsl(var(--primary)/0.35)] transition-all duration-500 pointer-events-none" />
                  <div className="absolute bottom-0 left-0 right-0 p-2.5 md:p-4 text-center md:text-left">
                    <h3 className="font-heading font-bold text-sm md:text-lg text-foreground truncate">{cat.name}</h3>
                    <span className="text-[10px] md:text-xs text-primary font-mono mt-0.5 inline-flex items-center gap-1">
                      Explore <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default CategoriesPage;
