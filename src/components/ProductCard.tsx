import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Product } from "@/data/products";
import { Zap, Eye } from "lucide-react";

const ProductCard = ({ product, index = 0 }: { product: Product; index?: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <Link to={`/product/${product.id}`} className="block group"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
        <div className="relative rounded-2xl overflow-hidden glass-panel transition-all duration-300 group-hover:shadow-[0_15px_40px_rgba(0,120,255,0.12)] group-hover:-translate-y-1 md:group-hover:-translate-y-2">
          {product.stock <= 0 && (
            <div className="absolute top-2 right-2 md:top-3 md:right-3 z-20 px-2 py-1 md:px-2.5 rounded-full bg-destructive/15 backdrop-blur-md border border-destructive/30 text-destructive">
              <span className="text-[9px] md:text-[10px] font-mono font-bold uppercase tracking-wider">Out of Stock</span>
            </div>
          )}
          {product.trending && product.stock > 0 && (
            <div className="absolute top-2 left-2 md:top-3 md:left-3 z-20 flex items-center gap-1 px-2 py-1 md:px-2.5 rounded-full bg-primary/10 backdrop-blur-md border border-primary/20 text-primary">
              <Zap className="w-3 h-3 fill-primary" />
              <span className="text-[9px] md:text-[10px] font-mono font-bold uppercase tracking-wider">Trending</span>
            </div>
          )}
          <div className="relative overflow-hidden aspect-[3/4]">
            <img src={product.image} alt={product.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 md:group-hover:scale-110" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent opacity-60" />
            <div className="absolute bottom-0 left-0 right-0 p-2 md:p-3 flex justify-center opacity-100 translate-y-0 md:opacity-0 md:translate-y-6 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-300">
              <span className="h-10 md:h-11 px-4 md:px-6 text-xs md:text-sm flex items-center gap-2 rounded-xl font-heading font-semibold neon-button whitespace-nowrap">
                <Eye className="w-4 h-4" /> View Details
              </span>
            </div>
          </div>
          <div className="p-3 md:p-4">
            <h3 className="font-heading font-semibold text-xs md:text-sm text-foreground leading-snug line-clamp-2 min-h-[2.5rem] md:min-h-[1.25rem]">{product.title}</h3>
            <div className="flex items-center justify-between gap-2 mt-2.5">
              <span className="font-mono font-bold text-base md:text-lg text-primary shrink-0">৳{product.price}</span>
              {product.colors && product.colors.length > 0 && (
                <div className="flex gap-1 shrink-0">
                  {product.colors.slice(0, 4).map((c, i) => (
                    <div key={i} className="w-3 h-3 md:w-3.5 md:h-3.5 rounded-full border border-border" style={{ backgroundColor: c.code }} />
                  ))}
                </div>
              )}
            </div>
            <div className="mt-2 flex items-center gap-1.5 overflow-hidden">
              <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${product.stock > 10 ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              <span className="text-[10px] font-mono text-muted-foreground truncate">{product.stock > 10 ? 'In Stock' : `Only ${product.stock} left`}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
