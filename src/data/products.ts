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
import pantBlack from "@/assets/pant-black.jpg";
import pantWhite from "@/assets/pant-white.jpg";
import pantBeige from "@/assets/pant-beige.jpg";
import pantCream from "@/assets/pant-cream.jpg";
import pantDarkgrey from "@/assets/pant-darkgrey.jpg";
import pantLightgrey from "@/assets/pant-lightgrey.jpg";
import pantNavy from "@/assets/pant-navy.jpg";
import pantOlive from "@/assets/pant-olive.jpg";
import pantBrown from "@/assets/pant-brown.jpg";
import pantKhaki from "@/assets/pant-khaki.jpg";
import hoodieBlack from "@/assets/hoodie-black.jpg";
import hoodieWhite from "@/assets/hoodie-white.jpg";
import hoodieOffwhite from "@/assets/hoodie-offwhite.jpg";
import hoodieDarkgrey from "@/assets/hoodie-darkgrey.jpg";
import hoodieLightgrey from "@/assets/hoodie-lightgrey.jpg";
import hoodieNavy from "@/assets/hoodie-navy.jpg";
import hoodieOlive from "@/assets/hoodie-olive.jpg";
import hoodieMaroon from "@/assets/hoodie-maroon.jpg";
import hoodieBrown from "@/assets/hoodie-brown.jpg";
import hoodieBottlegreen from "@/assets/hoodie-bottlegreen.jpg";
import jacketBlack from "@/assets/jacket-black.jpg";
import jacketWhite from "@/assets/jacket-white.jpg";
import jacketDarkgrey from "@/assets/jacket-darkgrey.jpg";
import jacketLightgrey from "@/assets/jacket-lightgrey.jpg";
import jacketNavy from "@/assets/jacket-navy.jpg";
import jacketOlive from "@/assets/jacket-olive.jpg";
import jacketMaroon from "@/assets/jacket-maroon.jpg";
import jacketBrown from "@/assets/jacket-brown.jpg";
import jacketBeige from "@/assets/jacket-beige.jpg";
import jacketBottlegreen from "@/assets/jacket-bottlegreen.jpg";

const shirtCatalog: CatalogItem[] = [
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

const tshirtCatalog: CatalogItem[] = [
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

const panjabiCatalog: CatalogItem[] = [
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

const poloCatalog: CatalogItem[] = [
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

const pantCatalog: CatalogItem[] = [
  { name: "Onyx Black Tailored Pant", image: pantBlack, color: { name: "Black", code: "#111111" } },
  { name: "Pure White Tailored Pant", image: pantWhite, color: { name: "White", code: "#f8f9fa" } },
  { name: "Beige Tailored Pant", image: pantBeige, color: { name: "Beige", code: "#c9a574" } },
  { name: "Cream Tailored Pant", image: pantCream, color: { name: "Cream", code: "#f1ead8" } },
  { name: "Charcoal Grey Tailored Pant", image: pantDarkgrey, color: { name: "Dark Grey", code: "#3d4148" } },
  { name: "Light Grey Tailored Pant", image: pantLightgrey, color: { name: "Light Grey", code: "#bfc4c7" } },
  { name: "Navy Blue Tailored Pant", image: pantNavy, color: { name: "Navy Blue", code: "#132a57" } },
  { name: "Olive Green Tailored Pant", image: pantOlive, color: { name: "Olive Green", code: "#4f5d2f" } },
  { name: "Chocolate Brown Tailored Pant", image: pantBrown, color: { name: "Chocolate Brown", code: "#4a2c21" } },
  { name: "Khaki Tailored Pant", image: pantKhaki, color: { name: "Khaki", code: "#b3925a" } },
];

const hoodieCatalog: CatalogItem[] = [
  { name: "Onyx Black Premium Hoodie", image: hoodieBlack, color: { name: "Black", code: "#111111" } },
  { name: "Pure White Premium Hoodie", image: hoodieWhite, color: { name: "White", code: "#f8f9fa" } },
  { name: "Off White Premium Hoodie", image: hoodieOffwhite, color: { name: "Off White", code: "#ede3d0" } },
  { name: "Charcoal Grey Premium Hoodie", image: hoodieDarkgrey, color: { name: "Dark Grey", code: "#474747" } },
  { name: "Light Grey Premium Hoodie", image: hoodieLightgrey, color: { name: "Light Grey", code: "#cacfd3" } },
  { name: "Navy Blue Premium Hoodie", image: hoodieNavy, color: { name: "Navy Blue", code: "#132a57" } },
  { name: "Olive Green Premium Hoodie", image: hoodieOlive, color: { name: "Olive Green", code: "#5d6d37" } },
  { name: "Maroon Premium Hoodie", image: hoodieMaroon, color: { name: "Maroon", code: "#6f1d2b" } },
  { name: "Chocolate Brown Premium Hoodie", image: hoodieBrown, color: { name: "Chocolate Brown", code: "#4f2c20" } },
  { name: "Bottle Green Premium Hoodie", image: hoodieBottlegreen, color: { name: "Bottle Green", code: "#0c4b3d" } },
];

const jacketCatalog: CatalogItem[] = [
  { name: "Onyx Black Winter Jacket", image: jacketBlack, color: { name: "Black", code: "#151515" } },
  { name: "Arctic White Winter Jacket", image: jacketWhite, color: { name: "White", code: "#f5f7fa" } },
  { name: "Charcoal Grey Winter Jacket", image: jacketDarkgrey, color: { name: "Dark Grey", code: "#46484d" } },
  { name: "Light Grey Winter Jacket", image: jacketLightgrey, color: { name: "Light Grey", code: "#c9ccd1" } },
  { name: "Navy Blue Winter Jacket", image: jacketNavy, color: { name: "Navy Blue", code: "#193255" } },
  { name: "Olive Green Winter Jacket", image: jacketOlive, color: { name: "Olive Green", code: "#5a623d" } },
  { name: "Maroon Winter Jacket", image: jacketMaroon, color: { name: "Maroon", code: "#6d2230" } },
  { name: "Chocolate Brown Winter Jacket", image: jacketBrown, color: { name: "Chocolate Brown", code: "#55392d" } },
  { name: "Beige Winter Jacket", image: jacketBeige, color: { name: "Beige", code: "#c8a57e" } },
  { name: "Bottle Green Winter Jacket", image: jacketBottlegreen, color: { name: "Bottle Green", code: "#214332" } },
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

type CatalogItem = {
  name: string;
  image: string;
  color: { name: string; code: string };
};

export const categories: Category[] = [
  { slug: "panjabi", name: "Panjabi", image: defaultCategoryImages.panjabi },
  { slug: "shirt", name: "Shirt", image: defaultCategoryImages.shirt },
  { slug: "pant", name: "Pant", image: defaultCategoryImages.pant },
  { slug: "tshirt", name: "T-Shirt", image: defaultCategoryImages.tshirt },
  { slug: "polo", name: "Polo Shirt", image: defaultCategoryImages.polo },
  { slug: "hoodie", name: "Hoodie", image: defaultCategoryImages.hoodie },
  { slug: "jacket", name: "Winter Jacket", image: defaultCategoryImages.jacket },
];

const colorSets: ProductColor[][] = [
  [
    { name: "Black", code: "#1a1a2e", image: defaultCategoryImages.shirt },
    { name: "Navy", code: "#16213e", image: defaultCategoryImages.shirt },
    { name: "White", code: "#f8f9fa", image: defaultCategoryImages.shirt },
    { name: "Grey", code: "#6c757d", image: defaultCategoryImages.shirt },
  ],
  [
    { name: "Maroon", code: "#800020", image: defaultCategoryImages.shirt },
    { name: "Olive", code: "#556b2f", image: defaultCategoryImages.shirt },
    { name: "Beige", code: "#d4b896", image: defaultCategoryImages.shirt },
  ],
  [
    { name: "Blue", code: "#0077b6", image: defaultCategoryImages.shirt },
    { name: "Charcoal", code: "#36454f", image: defaultCategoryImages.shirt },
    { name: "Cream", code: "#fffdd0", image: defaultCategoryImages.shirt },
    { name: "Forest", code: "#228b22", image: defaultCategoryImages.shirt },
    { name: "Sand", code: "#c2b280", image: defaultCategoryImages.shirt },
  ],
];

const generateProducts = (): Product[] => {
  const products: Product[] = [];

  const namesByCategory: Record<string, string[]> = {
    panjabi: panjabiCatalog.map((item) => item.name),
    shirt: ["Oxford Button Down", "Slim Fit Formal", "Linen Casual Shirt", "Denim Shirt", "Printed Casual Shirt", "White Classic Shirt", "Striped Office Shirt", "Mandarin Collar Shirt", "Flannel Check Shirt", "Satin Evening Shirt"],
    pant: pantCatalog.map((item) => item.name),
    tshirt: tshirtCatalog.map((item) => item.name),
    polo: poloCatalog.map((item) => item.name),
    hoodie: hoodieCatalog.map((item) => item.name),
    jacket: jacketCatalog.map((item) => item.name),
  };

  const priceRanges: Record<string, [number, number]> = {
    panjabi: [1200, 4500],
    shirt: [800, 2500],
    pant: [1200, 3200],
    tshirt: [450, 1500],
    polo: [600, 1800],
    hoodie: [1800, 3800],
    jacket: [2600, 6500],
  };

  const sizeOptions: Record<string, string[]> = {
    panjabi: ["S", "M", "L", "XL", "XXL"],
    shirt: ["S", "M", "L", "XL"],
    pant: ["28", "30", "32", "34", "36", "38"],
    tshirt: ["S", "M", "L", "XL", "XXL"],
    polo: ["S", "M", "L", "XL", "XXL"],
    hoodie: ["S", "M", "L", "XL", "XXL"],
    jacket: ["S", "M", "L", "XL", "XXL"],
  };

  const premiumCatalogMap: Partial<Record<string, CatalogItem[]>> = {
    shirt: shirtCatalog,
    tshirt: tshirtCatalog,
    panjabi: panjabiCatalog,
    polo: poloCatalog,
    pant: pantCatalog,
    hoodie: hoodieCatalog,
    jacket: jacketCatalog,
  };

  let id = 1;
  for (const cat of categories) {
    const names = namesByCategory[cat.slug] || [];
    const [minP, maxP] = priceRanges[cat.slug] || [500, 2000];
    const baseImage = defaultCategoryImages[cat.slug] || cat.image;

    for (let i = 0; i < 10; i++) {
      const price = Math.round((minP + Math.random() * (maxP - minP)) / 10) * 10;
      const seasonal = cat.slug === "jacket" || cat.slug === "hoodie" ? "winter" : i < 2 ? "eid" : i < 6 ? "summer" : undefined;
      const costPrice = Math.round(price * (0.4 + Math.random() * 0.2));
      const premiumItem = premiumCatalogMap[cat.slug]?.[i];
      const productImage = premiumItem ? premiumItem.image : baseImage;
      const productTitle = premiumItem ? premiumItem.name : names[i] || `${cat.name} Item ${i + 1}`;
      const colors = premiumItem
        ? [{ name: premiumItem.color.name, code: premiumItem.color.code, image: premiumItem.image }]
        : colorSets[i % colorSets.length].map((c) => ({ ...c, image: baseImage }));

      products.push({
        id: `p${id++}`,
        title: productTitle,
        price,
        costPrice,
        category: cat.slug,
        year: 2024 + (i % 2),
        sizes: sizeOptions[cat.slug] || ["S", "M", "L", "XL"],
        stock: Math.floor(Math.random() * 50) + 5,
        description: `Premium quality ${cat.name.toLowerCase()} crafted with refined materials, modern tailoring, and a polished luxury finish for elevated everyday wear.`,
        image: productImage,
        colors,
        trending: i < 3,
        featured: i < 2,
        seasonal,
      });
    }
  }

  return products;
};

export const products = generateProducts();

export const getProductsByCategory = (slug: string) => products.filter((p) => p.category === slug);
export const getTrendingProducts = () => products.filter((p) => p.trending);
export const getFeaturedProducts = () => products.filter((p) => p.featured);
export const getSeasonalProducts = (season: string) => products.filter((p) => p.seasonal === season);
export const getProductById = (id: string) => products.find((p) => p.id === id);
export const searchProducts = (query: string) => {
  const q = query.toLowerCase();
  return products.filter((p) => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
};