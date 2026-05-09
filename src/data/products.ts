import { defaultCategoryImages } from "@/lib/categoryImages";
import shirtBlack from "@/assets/shirt-black.jpg";
import shirtWhite from "@/assets/shirt-white.jpg";
import shirtNavy from "@/assets/shirt-navy.jpg";
import shirtSkyblue from "@/assets/shirt-skyblue.jpg";
import shirtOlive from "@/assets/shirt-olive.jpg";
import shirtMaroon from "@/assets/shirt-maroon.jpg";
import shirtBeige from "@/assets/shirt-beige.jpg";
import shirtDarkgrey from "@/assets/shirt-darkgrey.jpg";
import shirtBottlegreen from "@/assets/shirt-bottlegreen.jpg";
import shirtBrown from "@/assets/shirt-brown.jpg";
import tshirtBlack from "@/assets/tshirt-black.jpg";
import tshirtWhite from "@/assets/tshirt-white.jpg";
import tshirtOffwhite from "@/assets/tshirt-offwhite.jpg";
import tshirtNavy from "@/assets/tshirt-navy.jpg";
import tshirtSkyblue from "@/assets/tshirt-skyblue.jpg";
import tshirtOlive from "@/assets/tshirt-olive.jpg";
import tshirtBeige from "@/assets/tshirt-beige.jpg";
import tshirtDarkgrey from "@/assets/tshirt-darkgrey.jpg";
import tshirtBrown from "@/assets/tshirt-brown.jpg";
import tshirtBottlegreen from "@/assets/tshirt-bottlegreen.jpg";
import panjabiOffwhite from "@/assets/panjabi-offwhite.jpg";
import panjabiBlack from "@/assets/panjabi-black.jpg";
import panjabiNavy from "@/assets/panjabi-navy.jpg";
import panjabiMaroon from "@/assets/panjabi-maroon.jpg";
import panjabiOlive from "@/assets/panjabi-olive.jpg";
import panjabiBeige from "@/assets/panjabi-beige.jpg";
import panjabiBrown from "@/assets/panjabi-brown.jpg";
import panjabiDarkgrey from "@/assets/panjabi-darkgrey.jpg";
import panjabiBottlegreen from "@/assets/panjabi-bottlegreen.jpg";
import panjabiSkyblue from "@/assets/panjabi-skyblue.jpg";
import poloBlack from "@/assets/polo-black.jpg";
import poloWhite from "@/assets/polo-white.jpg";
import poloNavy from "@/assets/polo-navy.jpg";
import poloSkyblue from "@/assets/polo-skyblue.jpg";
import poloOlive from "@/assets/polo-olive.jpg";
import poloMaroon from "@/assets/polo-maroon.jpg";
import poloBeige from "@/assets/polo-beige.jpg";
import poloDarkgrey from "@/assets/polo-darkgrey.jpg";
import poloBottlegreen from "@/assets/polo-bottlegreen.jpg";
import poloBrown from "@/assets/polo-brown.jpg";

const shirtCatalog: { name: string; image: string; color: { name: string; code: string } }[] = [
  { name: "Onyx Black Premium Shirt", image: shirtBlack, color: { name: "Black", code: "#1a1a1a" } },
  { name: "Pearl White Premium Shirt", image: shirtWhite, color: { name: "White", code: "#f8f9fa" } },
  { name: "Royal Navy Premium Shirt", image: shirtNavy, color: { name: "Navy Blue", code: "#0a2540" } },
  { name: "Sky Blue Premium Shirt", image: shirtSkyblue, color: { name: "Sky Blue", code: "#7ab8e6" } },
  { name: "Olive Green Premium Shirt", image: shirtOlive, color: { name: "Olive Green", code: "#556b2f" } },
  { name: "Maroon Premium Shirt", image: shirtMaroon, color: { name: "Maroon", code: "#6e1423" } },
  { name: "Beige Premium Shirt", image: shirtBeige, color: { name: "Beige", code: "#cdb393" } },
  { name: "Charcoal Grey Premium Shirt", image: shirtDarkgrey, color: { name: "Dark Grey", code: "#3a3a3a" } },
  { name: "Bottle Green Premium Shirt", image: shirtBottlegreen, color: { name: "Bottle Green", code: "#0b3d2e" } },
  { name: "Chocolate Brown Premium Shirt", image: shirtBrown, color: { name: "Chocolate Brown", code: "#3e1f0f" } },
];

const tshirtCatalog: { name: string; image: string; color: { name: string; code: string } }[] = [
  { name: "Onyx Black Oversized T-Shirt", image: tshirtBlack, color: { name: "Black", code: "#1a1a1a" } },
  { name: "Pure White Oversized T-Shirt", image: tshirtWhite, color: { name: "White", code: "#f8f9fa" } },
  { name: "Off White Oversized T-Shirt", image: tshirtOffwhite, color: { name: "Off White", code: "#f2eedf" } },
  { name: "Navy Blue Oversized T-Shirt", image: tshirtNavy, color: { name: "Navy Blue", code: "#0f2347" } },
  { name: "Sky Blue Oversized T-Shirt", image: tshirtSkyblue, color: { name: "Sky Blue", code: "#9ecff0" } },
  { name: "Olive Green Oversized T-Shirt", image: tshirtOlive, color: { name: "Olive Green", code: "#556b2f" } },
  { name: "Beige Oversized T-Shirt", image: tshirtBeige, color: { name: "Beige", code: "#c9ab83" } },
  { name: "Dark Grey Oversized T-Shirt", image: tshirtDarkgrey, color: { name: "Dark Grey", code: "#4a4a4a" } },
  { name: "Chocolate Brown Oversized T-Shirt", image: tshirtBrown, color: { name: "Chocolate Brown", code: "#4a2a1b" } },
  { name: "Bottle Green Oversized T-Shirt", image: tshirtBottlegreen, color: { name: "Bottle Green", code: "#0b4a3f" } },
];

const panjabiCatalog: { name: string; image: string; color: { name: string; code: string } }[] = [
  { name: "Eid Off White Premium Panjabi", image: panjabiOffwhite, color: { name: "Off White", code: "#f3ead8" } },
  { name: "Eid Black Premium Panjabi", image: panjabiBlack, color: { name: "Black", code: "#181818" } },
  { name: "Eid Navy Blue Premium Panjabi", image: panjabiNavy, color: { name: "Navy Blue", code: "#132a57" } },
  { name: "Eid Maroon Premium Panjabi", image: panjabiMaroon, color: { name: "Maroon", code: "#6f1d2b" } },
  { name: "Eid Olive Green Premium Panjabi", image: panjabiOlive, color: { name: "Olive Green", code: "#6d7d33" } },
  { name: "Eid Beige Premium Panjabi", image: panjabiBeige, color: { name: "Beige", code: "#c9aa7a" } },
  { name: "Eid Chocolate Brown Premium Panjabi", image: panjabiBrown, color: { name: "Chocolate Brown", code: "#5a3421" } },
  { name: "Eid Dark Grey Premium Panjabi", image: panjabiDarkgrey, color: { name: "Dark Grey", code: "#575757" } },
  { name: "Eid Bottle Green Premium Panjabi", image: panjabiBottlegreen, color: { name: "Bottle Green", code: "#0b4a3a" } },
  { name: "Eid Sky Blue Premium Panjabi", image: panjabiSkyblue, color: { name: "Sky Blue", code: "#a9d7f3" } },
];

const poloCatalog: { name: string; image: string; color: { name: string; code: string } }[] = [
  { name: "Black Luxury Polo Shirt", image: poloBlack, color: { name: "Black", code: "#111111" } },
  { name: "White Luxury Polo Shirt", image: poloWhite, color: { name: "White", code: "#f8f9fa" } },
  { name: "Navy Blue Luxury Polo Shirt", image: poloNavy, color: { name: "Navy Blue", code: "#10284d" } },
  { name: "Sky Blue Luxury Polo Shirt", image: poloSkyblue, color: { name: "Sky Blue", code: "#add8f0" } },
  { name: "Olive Green Luxury Polo Shirt", image: poloOlive, color: { name: "Olive Green", code: "#708238" } },
  { name: "Maroon Luxury Polo Shirt", image: poloMaroon, color: { name: "Maroon", code: "#7a1f33" } },
  { name: "Beige Luxury Polo Shirt", image: poloBeige, color: { name: "Beige", code: "#ceb084" } },
  { name: "Dark Grey Luxury Polo Shirt", image: poloDarkgrey, color: { name: "Dark Grey", code: "#4a4f55" } },
  { name: "Bottle Green Luxury Polo Shirt", image: poloBottlegreen, color: { name: "Bottle Green", code: "#0f5a45" } },
  { name: "Chocolate Brown Luxury Polo Shirt", image: poloBrown, color: { name: "Chocolate Brown", code: "#5b3728" } },
];

export interface ProductColor {
  name: string;
  code: string;
  image: string;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  costPrice?: number;
  category: string;
  year: number;
  sizes: string[];
  stock: number;
  description: string;
  image: string;
  colors?: ProductColor[];
  trending?: boolean;
  featured?: boolean;
  seasonal?: string;
}

export type Category = {
  slug: string;
  name: string;
  image: string;
};

export const categories: Category[] = [
  { slug: "panjabi", name: "Panjabi", image: defaultCategoryImages.panjabi },
  { slug: "shirt", name: "Shirt", image: defaultCategoryImages.shirt },
  { slug: "pant", name: "Pant", image: defaultCategoryImages.pant },
  { slug: "katua", name: "Katua", image: defaultCategoryImages.katua },
  { slug: "tshirt", name: "T-Shirt", image: defaultCategoryImages.tshirt },
  { slug: "polo", name: "Polo Shirt", image: defaultCategoryImages.polo },
  { slug: "hoodie", name: "Hoodie", image: defaultCategoryImages.hoodie },
  { slug: "jacket", name: "Winter Jacket", image: defaultCategoryImages.jacket },
];

const colorSets: ProductColor[][] = [
  [
    { name: "Black", code: "#1a1a2e", image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&h=500&fit=crop" },
    { name: "Navy", code: "#16213e", image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&h=500&fit=crop" },
    { name: "White", code: "#f8f9fa", image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop" },
    { name: "Grey", code: "#6c757d", image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=500&fit=crop" },
  ],
  [
    { name: "Maroon", code: "#800020", image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=500&fit=crop" },
    { name: "Olive", code: "#556b2f", image: "https://images.unsplash.com/photo-1588359348347-9bc6cbbb689e?w=400&h=500&fit=crop" },
    { name: "Beige", code: "#d4b896", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop" },
  ],
  [
    { name: "Blue", code: "#0077b6", image: "https://images.unsplash.com/photo-1625910513413-5fc42f006596?w=400&h=500&fit=crop" },
    { name: "Charcoal", code: "#36454f", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=500&fit=crop" },
    { name: "Cream", code: "#fffdd0", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop" },
    { name: "Forest", code: "#228b22", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=500&fit=crop" },
    { name: "Sand", code: "#c2b280", image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=500&fit=crop" },
  ],
];

const generateProducts = (): Product[] => {
  const products: Product[] = [];
  const sizeSets = [["S", "M", "L", "XL"], ["M", "L", "XL", "XXL"], ["S", "M", "L"]];

  const namesByCategory: Record<string, string[]> = {
    panjabi: panjabiCatalog.map((item) => item.name),
    shirt: ["Oxford Button Down", "Slim Fit Formal", "Linen Casual Shirt", "Denim Shirt", "Printed Casual Shirt", "White Classic Shirt", "Striped Office Shirt", "Mandarin Collar Shirt", "Flannel Check Shirt", "Satin Evening Shirt"],
    pant: ["Slim Fit Chinos", "Classic Formal Trouser", "Jogger Pants", "Cargo Pants", "Skinny Jeans", "Straight Cut Denim", "Linen Trousers", "Track Pants", "Pleated Pants", "Tapered Fit Pants"],
    katua: ["Premium Katua Set", "Casual Katua", "Festive Katua", "Embroidered Katua", "Cotton Katua", "Designer Katua", "Traditional Katua", "Modern Katua", "Silk Blend Katua", "Printed Katua"],
    tshirt: tshirtCatalog.map((item) => item.name),
    polo: poloCatalog.map((item) => item.name),
    hoodie: ["Pullover Hoodie", "Zip-Up Hoodie", "Oversized Hoodie", "Fleece Hoodie", "Graphic Hoodie", "Tech Hoodie", "Cropped Hoodie", "Essential Hoodie", "Acid Wash Hoodie", "Embroidered Hoodie"],
    jacket: ["Puffer Jacket", "Bomber Jacket", "Windbreaker", "Quilted Jacket", "Leather Jacket", "Denim Jacket", "Parka Coat", "Fleece Jacket", "Down Jacket", "Utility Jacket"],
  };

  const priceRanges: Record<string, [number, number]> = {
    panjabi: [1200, 4500], shirt: [800, 2500], pant: [900, 3000], katua: [1000, 3500],
    tshirt: [450, 1500], polo: [600, 1800], hoodie: [1200, 3500], jacket: [2000, 6000],
  };

  const images: Record<string, string[]> = {
    panjabi: ["https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&h=500&fit=crop", "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&h=500&fit=crop", "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop"],
    shirt: ["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop", "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=500&fit=crop", "https://images.unsplash.com/photo-1588359348347-9bc6cbbb689e?w=400&h=500&fit=crop"],
    pant: ["https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=500&fit=crop", "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=500&fit=crop", "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=500&fit=crop"],
    katua: ["https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=500&fit=crop", "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&h=500&fit=crop", "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&h=500&fit=crop"],
    tshirt: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop", "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&h=500&fit=crop", "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=500&fit=crop"],
    polo: ["https://images.unsplash.com/photo-1625910513413-5fc42f006596?w=400&h=500&fit=crop", "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=400&h=500&fit=crop", "https://images.unsplash.com/photo-1588359348347-9bc6cbbb689e?w=400&h=500&fit=crop"],
    hoodie: ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=500&fit=crop", "https://images.unsplash.com/photo-1509942774463-acf339cf87d5?w=400&h=500&fit=crop", "https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=400&h=500&fit=crop"],
    jacket: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop", "https://images.unsplash.com/photo-1544923246-77307dd270b5?w=400&h=500&fit=crop", "https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?w=400&h=500&fit=crop"],
  };

  let id = 1;
  for (const cat of categories) {
    const names = namesByCategory[cat.slug] || [];
    const [minP, maxP] = priceRanges[cat.slug] || [500, 2000];
    // Always use the verified category fallback image — no mixed visuals across categories
    const baseImage = defaultCategoryImages[cat.slug] || cat.image;

    for (let i = 0; i < 10; i++) {
      const price = Math.round((minP + Math.random() * (maxP - minP)) / 10) * 10;
      const seasonal = i < 2 ? "eid" : i < 4 ? "winter" : i < 6 ? "summer" : undefined;
      const costPrice = Math.round(price * (0.4 + Math.random() * 0.2));

      const premiumCatalogMap: Partial<Record<string, { name: string; image: string; color: { name: string; code: string } }[]>> = {
        shirt: shirtCatalog,
        tshirt: tshirtCatalog,
        panjabi: panjabiCatalog,
        polo: poloCatalog,
      };

      const premiumItem = premiumCatalogMap[cat.slug]?.[i];
      const productImage = premiumItem ? premiumItem.image : baseImage;
      const productTitle = premiumItem ? premiumItem.name : (names[i] || `${cat.name} Item ${i + 1}`);
      const colors = premiumItem
        ? [{ name: premiumItem.color.name, code: premiumItem.color.code, image: premiumItem.image }]
        : colorSets[i % colorSets.length].map(c => ({ ...c, image: baseImage }));

      products.push({
        id: `p${id++}`,
        title: productTitle,
        price, costPrice,
        category: cat.slug, year: 2024 + (i % 2),
        sizes: sizeSets[i % sizeSets.length],
        stock: Math.floor(Math.random() * 50) + 5,
        description: `Premium quality ${cat.name.toLowerCase()} crafted with the finest materials. Perfect for any occasion with a modern fit and contemporary design.`,
        image: productImage,
        colors,
        trending: i < 3, featured: i < 2, seasonal,
      });
    }
  }
  return products;
};

export const products = generateProducts();

export const getProductsByCategory = (slug: string) => products.filter(p => p.category === slug);
export const getTrendingProducts = () => products.filter(p => p.trending);
export const getFeaturedProducts = () => products.filter(p => p.featured);
export const getSeasonalProducts = (season: string) => products.filter(p => p.seasonal === season);
export const getProductById = (id: string) => products.find(p => p.id === id);
export const searchProducts = (query: string) => {
  const q = query.toLowerCase();
  return products.filter(p => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
};
