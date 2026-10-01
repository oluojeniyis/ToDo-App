export type ApparelCategory = "wholesale-blanks" | "retail-polos" | "bespoke-mesh" | "accessories";

export type ProductSalesUnit = {
  id: string;
  label: string;
  quantity: number;
  price: number;
  minimumOrderQuantity: number;
};

export type ProductColor = {
  id: string;
  name: string;
  hex: string;
};

export type MeshPlacement = "none" | "side-ventilation" | "full-back";

export type ProductCustomization = {
  size: string;
  colorId: string;
  meshPlacement: MeshPlacement;
  salesUnitId: string;
};

export type Product = {
  id: string;
  name: string;
  category: ApparelCategory;
  categoryLabel: string;
  description: string;
  salesUnits: ProductSalesUnit[];
  badge?: string;
  colors: ProductColor[];
  sizes: string[];
  meshPlacements: MeshPlacement[];
};

export type CartLine = {
  id: string;
  productId: string;
  customization: ProductCustomization;
  quantity: number;
  unitPrice: number;
};

export const MESH_PLACEMENT_LABELS: Record<MeshPlacement, string> = {
  none: "No mesh",
  "side-ventilation": "Side ventilation",
  "full-back": "Full back mesh",
};

export function formatPriceNGN(amount: number): string {
  return `₦${new Intl.NumberFormat("en-NG", { maximumFractionDigits: 0 }).format(amount)}`;
}
