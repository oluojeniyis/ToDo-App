import type { Product } from "./types";

const baseColors = [
  { id: "black", name: "Black", hex: "#202a33" },
  { id: "white", name: "White", hex: "#f2f0ea" },
  { id: "navy", name: "Navy", hex: "#334d68" },
  { id: "stone", name: "Stone", hex: "#cbbda7" },
];

const wholesaleUnits = (price: number, minimumOrderQuantity = 50) => [
  { id: "piece", label: `Per piece (min. ${minimumOrderQuantity})`, quantity: 1, price, minimumOrderQuantity },
  { id: "pack-50", label: "Pack of 50", quantity: 50, price: price * 50, minimumOrderQuantity: 1 },
  { id: "bale-100", label: "Bale of 100", quantity: 100, price: price * 100, minimumOrderQuantity: 1 },
];

export const products: Product[] = [
  {
    id: "premium-heavyweight-cotton-tee",
    name: "Premium Heavyweight Cotton Tee",
    category: "wholesale-blanks",
    categoryLabel: "Wholesale Blanks",
    description: "A substantial 240 GSM cotton blank, ready for your next print run.",
    salesUnits: wholesaleUnits(3500),
    badge: "240 GSM cotton",
    colors: baseColors,
    sizes: ["S", "M", "L", "XL", "XXL"],
    meshPlacements: ["none"],
  },
  {
    id: "vintage-distressed-boxy-tee",
    name: "Vintage Distressed Boxy Tee",
    category: "wholesale-blanks",
    categoryLabel: "Wholesale Blanks",
    description: "Washed-down texture and an easy oversized fit for standout merch.",
    salesUnits: [
      { id: "piece", label: "Per piece (minimum 20)", quantity: 1, price: 4500, minimumOrderQuantity: 20 },
      { id: "pack-50", label: "Pack of 50", quantity: 50, price: 225000, minimumOrderQuantity: 1 },
      { id: "bale-100", label: "Bale of 100", quantity: 100, price: 450000, minimumOrderQuantity: 1 },
    ],
    badge: "Vintage wash",
    colors: [
      { id: "washed-black", name: "Washed black", hex: "#55534e" },
      { id: "bone", name: "Bone", hex: "#e4ded1" },
      { id: "washed-blue", name: "Washed blue", hex: "#778b9b" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    meshPlacements: ["none"],
  },
  {
    id: "classic-pique-polo-shirt",
    name: "Classic Pique Polo Shirt",
    category: "retail-polos",
    categoryLabel: "Retail Polos",
    description: "A polished cotton-pique staple with a structured, comfortable collar.",
    salesUnits: [{ id: "piece", label: "Per piece", quantity: 1, price: 6500, minimumOrderQuantity: 1 }],
    badge: "Retail favorite",
    colors: [
      { id: "white", name: "White", hex: "#f2f0ea" },
      { id: "navy", name: "Navy", hex: "#334d68" },
      { id: "forest", name: "Forest", hex: "#536957" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    meshPlacements: ["none"],
  },
  {
    id: "athletic-mesh-panel-custom-jersey",
    name: "Athletic Mesh Panel Custom Jersey",
    category: "bespoke-mesh",
    categoryLabel: "Bespoke / Custom Mesh",
    description: "A made-to-order performance jersey with breathable panel options.",
    salesUnits: [{ id: "piece", label: "Per piece (minimum 10)", quantity: 1, price: 8500, minimumOrderQuantity: 10 }],
    badge: "Made to order",
    colors: [
      { id: "black", name: "Black", hex: "#202a33" },
      { id: "royal", name: "Royal blue", hex: "#315f9d" },
      { id: "white", name: "White", hex: "#f2f0ea" },
      { id: "red", name: "Red", hex: "#ad5149" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    meshPlacements: ["none", "side-ventilation", "full-back"],
  },
  {
    id: "everyday-canvas-tote",
    name: "Everyday Canvas Tote",
    category: "accessories",
    categoryLabel: "Accessories",
    description: "A sturdy cotton-canvas carryall for samples, kit, and daily essentials.",
    salesUnits: [{ id: "piece", label: "Per piece", quantity: 1, price: 5500, minimumOrderQuantity: 1 }],
    colors: [
      { id: "natural", name: "Natural", hex: "#d7c9ae" },
      { id: "black", name: "Black", hex: "#202a33" },
    ],
    sizes: ["One size"],
    meshPlacements: ["none"],
  },
];
