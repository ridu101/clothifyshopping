import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ArrowLeft, ShoppingBag, Heart, Minus, Plus, Check, Zap, Ruler } from "lucide-react";
import { useProducts } from "@/context/ProductContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import ProductCard from "@/components/ProductCard";
import SizeGuide from "@/components/SizeGuide";

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProductById, getProductsByCategory } = useProducts();
  const product = getProductById(id || "");
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { requireAuth, isAdmin } = useAuth();
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [qty, setQty] = useState(1);
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  // Scroll to top on product change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="text-center">
          <h1 className="font-heading text-2xl font-bold">Product not found</h1>
          <Link to="/shop" className="neon-button-outline px-6 py-2 mt-4 inline-block text-sm">Back to Shop</Link>
        </div>
      </div>
    );
  }

  const wishlisted = isInWishlist(product.id);
  const related = getProductsByCategory(product.category).filter(p => p.id !== product.id).slice(0, 4);
  const colors = product.colors || [];
  const displayImage = colors[selectedColorIdx]?.image || product.image;

  const handleAddToCart = () => {
    if (!requireAuth("add to cart")) return;
    if (!selectedSize) { toast.error("Please select a size"); return; }
    for (let i = 0; i < qty; i++) addItem(product, selectedSize);
  };

  const handleBuyNow = () => {
    if (!requireAuth("buy")) return;
    if (!selectedSize) { toast.error("Please select a size"); return; }
    for (let i = 0; i < qty; i++) addItem(product, selectedSize);
    navigate("/cart");
  };

  const handleWishlist = () => {
    if (!requireAuth("use wishlist")) return;
    toggleWishlist(product);
    toast.success(wishlisted ? "Removed from wishlist" : "Added to wishlist!");
  };

  return (
    <div className="min-h-screen pt-24 md:pt-28 px-4 md:px-6 max-w-7xl mx-auto overflow-x-hidden">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <Link to={`/${product.category}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-300 mb-6 md:mb-8">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 items-start">
          <div className="min-w-0">
            <div className="glass-card overflow-hidden rounded-2xl md:rounded-3xl">
              <div className="aspect-[3/4] overflow-hidden">
                <motion.img key={displayImage} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
                  src={displayImage} alt={product.title} className="w-full h-full object-cover" />
              </div>
            </div>
            {colors.length > 0 && (
              <div className="flex gap-2 mt-3 md:mt-4 overflow-x-auto pb-2">
                {colors.map((c, i) => (
                  <button key={i} onClick={() => setSelectedColorIdx(i)}
                    className={`flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden border-2 transition-all duration-300 ${selectedColorIdx === i ? "border-primary shadow-md" : "border-border hover:border-primary/30"}`}>
                    <img src={c.image || product.image} alt={c.name} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center min-w-0">
            <span className="text-xs font-mono text-primary uppercase tracking-widest mb-2">{product.category}</span>
            <h1 className="font-heading text-xl md:text-4xl font-bold text-foreground leading-tight break-words">{product.title}</h1>
            <p className="price-text text-2xl md:text-3xl mt-3 md:mt-4">৳{product.price}</p>
            <p className="text-sm text-muted-foreground mt-1 font-mono">Year: {product.year}</p>
            <p className="text-sm md:text-base text-muted-foreground mt-4 md:mt-6 leading-relaxed break-words">{product.description}</p>
            <div className="flex items-center gap-2 mt-5 md:mt-6">
              <Check className={`w-4 h-4 shrink-0 ${product.stock > 0 ? "text-primary" : "text-destructive"}`} />
              <span className={`text-sm font-mono ${product.stock > 0 ? "text-primary" : "text-destructive"}`}>
                {product.stock > 0 ? `${product.stock} in stock` : "Out of Stock"}
              </span>
            </div>

            {colors.length > 0 && (
              <div className="mt-5 md:mt-6">
                <p className="text-sm font-heading font-semibold mb-3">Color: {colors[selectedColorIdx]?.name}</p>
                <div className="flex gap-2 flex-wrap">
                  {colors.map((c, i) => (
                    <button key={i} onClick={() => setSelectedColorIdx(i)}
                      className={`w-8 h-8 rounded-full border-2 transition-all duration-300 ${selectedColorIdx === i ? "border-primary scale-110 shadow-md" : "border-border hover:scale-105"}`}
                      style={{ backgroundColor: c.code }} title={c.name} />
                  ))}
                </div>
              </div>
            )}

            <div className="mt-5 md:mt-6">
              <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
                <p className="text-sm font-heading font-semibold">Select Size</p>
                <button
                  type="button"
                  onClick={() => setSizeGuideOpen(true)}
                  className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-heading font-semibold text-primary glass-panel border border-primary/30 hover:border-primary/60 transition-all duration-300"
                  aria-label="Open size guide"
                >
                  <Ruler className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform duration-300" />
                  Size Guide
                </button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map(s => (
                  <button key={s} onClick={() => setSelectedSize(s)}
                    className={`h-10 px-4 rounded-xl font-mono text-xs md:text-sm transition-all duration-300 ${selectedSize === s ? "neon-button" : "glass-panel hover:border-primary/30"}`}>{s}</button>
                ))}
              </div>
            </div>

            <div className="mt-5 md:mt-6 flex items-center gap-3 md:gap-4 flex-wrap">
              <p className="text-sm font-heading font-semibold">Quantity</p>
              <div className="flex items-center gap-2 glass-panel rounded-xl px-3 py-1 h-10">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-1 hover:text-primary transition-colors duration-300"><Minus className="w-4 h-4" /></button>
                <span className="font-mono w-8 text-center text-sm">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="p-1 hover:text-primary transition-colors duration-300"><Plus className="w-4 h-4" /></button>
              </div>
            </div>

            {!isAdmin && (
              <div className="mt-6 md:mt-8">
                {product.stock > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-stretch">
                    <button onClick={handleAddToCart}
                      className="neon-button-outline h-10 md:h-14 px-4 md:px-8 flex items-center justify-center gap-2 text-xs md:text-sm rounded-xl md:rounded-2xl overflow-hidden">
                      <ShoppingBag className="w-4 h-4 md:w-5 md:h-5" /> Add To Cart
                    </button>
                    <button onClick={handleBuyNow}
                      className="neon-button h-10 md:h-14 px-4 md:px-8 flex items-center justify-center gap-2 text-xs md:text-sm rounded-xl md:rounded-2xl overflow-hidden">
                      <Zap className="w-4 h-4 md:w-5 md:h-5" /> Buy Now
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="glass-panel rounded-2xl p-4 md:p-5 border border-destructive/20 text-center">
                      <p className="font-heading font-bold text-destructive text-sm md:text-base">Currently Out of Stock</p>
                      <p className="text-xs text-muted-foreground mt-1">Save it to your wishlist and we'll let you know when it's back.</p>
                    </div>
                    <button onClick={handleWishlist}
                      className={`w-full h-12 md:h-14 rounded-2xl px-4 flex items-center justify-center gap-2 text-sm font-heading font-semibold transition-all duration-300 backdrop-blur-xl border ${wishlisted
                        ? "bg-primary/15 text-primary border-primary/40 shadow-[0_0_24px_rgba(59,130,246,0.25)]"
                        : "bg-white/55 text-foreground border-primary/20 hover:bg-primary/10 hover:border-primary/40 hover:shadow-[0_0_24px_rgba(59,130,246,0.25)]"}`}>
                      <Heart className={`w-5 h-5 ${wishlisted ? "fill-primary" : ""}`} />
                      {wishlisted ? "Saved — Notify Me When Back" : "Notify Me When Back"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-24">
            <h2 className="section-title text-foreground mb-8">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          </div>
        )}
      </motion.div>
      <SizeGuide open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} category={product.category} />
    </div>
  );
};

export default ProductPage;
