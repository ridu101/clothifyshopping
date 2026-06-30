import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Product, ProductColor } from "@/data/products";
import { toast } from "sonner";

interface ProductContextType {
  products: Product[];
  loading: boolean;
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  getProductsByCategory: (slug: string) => Product[];
  getTrendingProducts: () => Product[];
  getFeaturedProducts: () => Product[];
  getSeasonalProducts: (season: string) => Product[];
  getProductById: (id: string) => Product | undefined;
  searchProducts: (query: string) => Product[];
  decrementStock: (entries: { id: string; quantity: number }[]) => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

// Map snake_case DB row → camelCase Product
const fromRow = (r: any): Product => ({
  id: r.id,
  title: r.title,
  price: r.price,
  costPrice: r.cost_price,
  category: r.category,
  year: r.year,
  sizes: Array.isArray(r.sizes) ? r.sizes : [],
  stock: r.stock,
  description: r.description ?? "",
  image: r.image ?? "",
  colors: Array.isArray(r.colors) ? (r.colors as ProductColor[]) : [],
  trending: !!r.trending,
  featured: !!r.featured,
  seasonal: r.seasonal ?? undefined,
});

const toRow = (p: Partial<Product>) => {
  const row: Record<string, any> = {};
  if (p.title !== undefined) row.title = p.title;
  if (p.price !== undefined) row.price = p.price;
  if (p.costPrice !== undefined) row.cost_price = p.costPrice;
  if (p.category !== undefined) row.category = p.category;
  if (p.year !== undefined) row.year = p.year;
  if (p.sizes !== undefined) row.sizes = p.sizes;
  if (p.stock !== undefined) row.stock = p.stock;
  if (p.description !== undefined) row.description = p.description;
  if (p.image !== undefined) row.image = p.image;
  if (p.colors !== undefined) row.colors = p.colors;
  if (p.trending !== undefined) row.trending = p.trending;
  if (p.featured !== undefined) row.featured = p.featured;
  if (p.seasonal !== undefined) row.seasonal = p.seasonal ?? null;
  return row;
};

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const mounted = useRef(true);

  const refetch = useCallback(async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("[Products] fetch:", error.message);
      return;
    }
    if (!mounted.current) return;
    setProducts((data || []).map(fromRow));
  }, []);

  useEffect(() => {
    mounted.current = true;
    refetch().finally(() => setLoading(false));

    const channel = supabase
      .channel("products-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, (payload) => {
        setProducts((prev) => {
          if (payload.eventType === "INSERT") {
            const row = fromRow(payload.new);
            if (prev.some((p) => p.id === row.id)) return prev;
            return [row, ...prev];
          }
          if (payload.eventType === "UPDATE") {
            const row = fromRow(payload.new);
            return prev.map((p) => (p.id === row.id ? row : p));
          }
          if (payload.eventType === "DELETE") {
            const id = (payload.old as any)?.id;
            return prev.filter((p) => p.id !== id);
          }
          return prev;
        });
      })
      .subscribe();

    return () => {
      mounted.current = false;
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  const addProduct = useCallback(async (product: Product) => {
    const row = toRow(product);
    const { error } = await supabase.from("products").insert([row as any]);
    if (error) {
      toast.error("Failed to add product");
      console.error("[Products] insert:", error.message);
    }
  }, []);

  const updateProduct = useCallback(async (product: Product) => {
    const row = toRow(product);
    const { error } = await supabase.from("products").update(row).eq("id", product.id);
    if (error) {
      toast.error("Failed to update product");
      console.error("[Products] update:", error.message);
    }
  }, []);

  const deleteProduct = useCallback(async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete product");
      console.error("[Products] delete:", error.message);
    }
  }, []);

  const decrementStock = useCallback(
    async (entries: { id: string; quantity: number }[]) => {
      // Optimistic local update first
      setProducts((prev) =>
        prev.map((p) => {
          const e = entries.find((x) => x.id === p.id);
          if (!e) return p;
          return { ...p, stock: Math.max(0, (p.stock || 0) - e.quantity) };
        }),
      );
      // Persist (best-effort; admin policies will block guests — that's OK,
      // the eventual admin/edge function handles authoritative stock).
      for (const e of entries) {
        const current = products.find((p) => p.id === e.id);
        if (!current) continue;
        const next = Math.max(0, (current.stock || 0) - e.quantity);
        await supabase.from("products").update({ stock: next }).eq("id", e.id);
      }
    },
    [products],
  );

  const getProductsByCategory = useCallback((slug: string) => products.filter((p) => p.category === slug), [products]);
  const getTrendingProducts = useCallback(() => products.filter((p) => p.trending), [products]);
  const getFeaturedProducts = useCallback(() => products.filter((p) => p.featured), [products]);
  const getSeasonalProducts = useCallback((season: string) => products.filter((p) => p.seasonal === season), [products]);
  const getProductById = useCallback((id: string) => products.find((p) => p.id === id), [products]);
  const searchProducts = useCallback(
    (query: string) => {
      const q = query.toLowerCase();
      return products.filter(
        (p) => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q),
      );
    },
    [products],
  );

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductsByCategory,
        getTrendingProducts,
        getFeaturedProducts,
        getSeasonalProducts,
        getProductById,
        searchProducts,
        decrementStock,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error("useProducts must be used within ProductProvider");
  return ctx;
};
