import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/data/products";
import { useAuth } from "@/context/AuthContext";
import { useProducts } from "@/context/ProductContext";

export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
}

interface StoredLine {
  productId: string;
  size: string;
  quantity: number;
}

const GUEST_KEY = "as_cart_lines";

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, size: string) => void;
  removeItem: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const loadGuestLines = (): StoredLine[] => {
  try {
    const raw = localStorage.getItem(GUEST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};
const saveGuestLines = (lines: StoredLine[]) => {
  try { localStorage.setItem(GUEST_KEY, JSON.stringify(lines)); } catch { /* noop */ }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { products } = useProducts();
  const [lines, setLines] = useState<StoredLine[]>(() => loadGuestLines());
  const [isCartOpen, setIsCartOpen] = useState(false);
  const mergedRef = useRef<string | null>(null);

  // Sync from DB on login, merging any guest lines
  useEffect(() => {
    if (!user) {
      setLines(loadGuestLines());
      return;
    }

    let active = true;

    const sync = async () => {
      const guest = loadGuestLines();

      if (mergedRef.current !== user.id && guest.length > 0) {
        mergedRef.current = user.id;
        const rows = guest.map((l) => ({
          user_id: user.id,
          product_id: l.productId,
          size: l.size,
          quantity: l.quantity,
        }));
        await supabase
          .from("cart_items")
          .upsert(rows, { onConflict: "user_id,product_id,size" });
        saveGuestLines([]);
      }

      const { data, error } = await supabase
        .from("cart_items")
        .select("product_id, size, quantity")
        .eq("user_id", user.id);
      if (error) {
        console.error("[Cart] load:", error.message);
        return;
      }
      if (!active) return;
      setLines((data || []).map((r: any) => ({ productId: r.product_id, size: r.size, quantity: r.quantity })));
    };

    sync();

    const channel = supabase
      .channel(`cart-${user.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "cart_items", filter: `user_id=eq.${user.id}` },
        () => { sync(); },
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Persist guest cart
  useEffect(() => {
    if (!user) saveGuestLines(lines);
  }, [lines, user]);

  const persistLine = useCallback(
    async (line: StoredLine) => {
      if (!user) return;
      await supabase
        .from("cart_items")
        .upsert(
          { user_id: user.id, product_id: line.productId, size: line.size, quantity: line.quantity },
          { onConflict: "user_id,product_id,size" },
        );
    },
    [user],
  );

  const removeLine = useCallback(
    async (productId: string, size: string) => {
      if (!user) return;
      await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", productId)
        .eq("size", size);
    },
    [user],
  );

  const addItem = useCallback(
    (product: Product, size: string) => {
      setLines((prev) => {
        const existing = prev.find((l) => l.productId === product.id && l.size === size);
        const next = existing
          ? prev.map((l) =>
              l.productId === product.id && l.size === size ? { ...l, quantity: l.quantity + 1 } : l,
            )
          : [...prev, { productId: product.id, size, quantity: 1 }];
        const updated = next.find((l) => l.productId === product.id && l.size === size)!;
        persistLine(updated);
        return next;
      });
      setIsCartOpen(true);
      if (typeof window !== "undefined") {
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
      }
    },
    [persistLine],
  );

  const removeItem = useCallback(
    (productId: string, size: string) => {
      setLines((prev) => prev.filter((l) => !(l.productId === productId && l.size === size)));
      removeLine(productId, size);
    },
    [removeLine],
  );

  const updateQuantity = useCallback(
    (productId: string, size: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(productId, size);
        return;
      }
      setLines((prev) => {
        const next = prev.map((l) =>
          l.productId === productId && l.size === size ? { ...l, quantity } : l,
        );
        const updated = next.find((l) => l.productId === productId && l.size === size);
        if (updated) persistLine(updated);
        return next;
      });
    },
    [removeItem, persistLine],
  );

  const clearCart = useCallback(() => {
    setLines([]);
    if (user) {
      supabase.from("cart_items").delete().eq("user_id", user.id).then(({ error }) => {
        if (error) console.error("[Cart] clear:", error.message);
      });
    }
  }, [user]);

  const items: CartItem[] = lines
    .map((l) => {
      const product = products.find((p) => p.id === l.productId);
      if (!product) return null;
      return { product, size: l.size, quantity: l.quantity };
    })
    .filter((x): x is CartItem => !!x);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice, isCartOpen, setIsCartOpen }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
