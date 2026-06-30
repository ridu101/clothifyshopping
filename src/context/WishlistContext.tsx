import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/data/products";
import { useAuth } from "@/context/AuthContext";
import { useProducts } from "@/context/ProductContext";

const GUEST_KEY = "as_wishlist_ids";

interface WishlistContextType {
  items: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Product) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const loadGuestIds = (): string[] => {
  try {
    const raw = localStorage.getItem(GUEST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveGuestIds = (ids: string[]) => {
  try {
    localStorage.setItem(GUEST_KEY, JSON.stringify(ids));
  } catch {
    /* noop */
  }
};

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { products } = useProducts();
  const [ids, setIds] = useState<string[]>(() => loadGuestIds());
  const mergedRef = useRef<string | null>(null);

  // Load + realtime subscribe whenever auth changes
  useEffect(() => {
    if (!user) {
      setIds(loadGuestIds());
      return;
    }

    let active = true;

    const merge = async () => {
      const guestIds = loadGuestIds();
      if (mergedRef.current !== user.id && guestIds.length > 0) {
        mergedRef.current = user.id;
        const rows = guestIds.map((pid) => ({ user_id: user.id, product_id: pid }));
        await supabase.from("wishlist").upsert(rows, { onConflict: "user_id,product_id", ignoreDuplicates: true });
        saveGuestIds([]);
      }
    };

    const load = async () => {
      await merge();
      const { data, error } = await supabase
        .from("wishlist")
        .select("product_id")
        .eq("user_id", user.id);
      if (error) {
        console.error("[Wishlist] load:", error.message);
        return;
      }
      if (!active) return;
      setIds((data || []).map((r: any) => r.product_id));
    };

    load();

    const channel = supabase
      .channel(`wishlist-${user.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "wishlist", filter: `user_id=eq.${user.id}` },
        () => { load(); },
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Persist guest list
  useEffect(() => {
    if (!user) saveGuestIds(ids);
  }, [ids, user]);

  const addToWishlist = useCallback(
    (product: Product) => {
      setIds((prev) => (prev.includes(product.id) ? prev : [...prev, product.id]));
      if (user) {
        supabase
          .from("wishlist")
          .insert({ user_id: user.id, product_id: product.id })
          .then(({ error }) => {
            if (error && !error.message.includes("duplicate")) {
              console.error("[Wishlist] insert:", error.message);
            }
          });
      }
    },
    [user],
  );

  const removeFromWishlist = useCallback(
    (productId: string) => {
      setIds((prev) => prev.filter((id) => id !== productId));
      if (user) {
        supabase
          .from("wishlist")
          .delete()
          .eq("user_id", user.id)
          .eq("product_id", productId)
          .then(({ error }) => {
            if (error) console.error("[Wishlist] delete:", error.message);
          });
      }
    },
    [user],
  );

  const isInWishlist = useCallback((productId: string) => ids.includes(productId), [ids]);

  const toggleWishlist = useCallback(
    (product: Product) => {
      if (ids.includes(product.id)) removeFromWishlist(product.id);
      else addToWishlist(product);
    },
    [ids, addToWishlist, removeFromWishlist],
  );

  const items: Product[] = ids
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => !!p);

  return (
    <WishlistContext.Provider value={{ items, addToWishlist, removeFromWishlist, isInWishlist, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
};
