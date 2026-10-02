"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import CartDrawer from "./components/CartDrawer";
import ProductCard from "./components/ProductCard";
import styles from "./shop.module.css";
import { products } from "../productsData";
import type { ApparelCategory, CartLine, Product, ProductCustomization } from "../types";

const CART_STORAGE_KEY = "teestale.cart.v1";
const categories: { id: ApparelCategory | "all"; label: string }[] = [
  { id: "all", label: "All pieces" },
  { id: "wholesale-blanks", label: "Wholesale Blanks" },
  { id: "retail-polos", label: "Retail Polos" },
  { id: "bespoke-mesh", label: "Bespoke / Custom Mesh" },
  { id: "accessories", label: "Accessories" },
];

function lineId(productId: string, customization: ProductCustomization): string {
  return [
    productId,
    customization.salesUnitId,
    customization.size,
    customization.colorId,
    customization.meshPlacement,
  ].join(":");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function restoreCart(value: unknown): { items: CartLine[]; hadInvalidItems: boolean } {
  if (!Array.isArray(value)) return { items: [], hadInvalidItems: true };
  const restored: CartLine[] = [];
  let hadInvalidItems = false;

  for (const entry of value) {
    if (!isRecord(entry) || typeof entry.productId !== "string" || !isRecord(entry.customization)) {
      hadInvalidItems = true;
      continue;
    }
    const product = products.find((item) => item.id === entry.productId);
    const customization = entry.customization;
    const salesUnit = product?.salesUnits.find((unit) => unit.id === customization.salesUnitId);
    if (
      !product ||
      typeof customization.size !== "string" ||
      !product.sizes.includes(customization.size) ||
      typeof customization.colorId !== "string" ||
      !product.colors.some((color) => color.id === customization.colorId) ||
      typeof customization.meshPlacement !== "string" ||
      !product.meshPlacements.includes(customization.meshPlacement as ProductCustomization["meshPlacement"]) ||
      !salesUnit ||
      typeof entry.quantity !== "number" ||
      !Number.isInteger(entry.quantity) ||
      entry.quantity < salesUnit.minimumOrderQuantity ||
      entry.quantity > 9999
    ) {
      hadInvalidItems = true;
      continue;
    }

    const savedCustomization: ProductCustomization = {
      size: customization.size,
      colorId: customization.colorId,
      meshPlacement: customization.meshPlacement as ProductCustomization["meshPlacement"],
      salesUnitId: salesUnit.id,
    };
    const id = lineId(product.id, savedCustomization);
    const existing = restored.find((line) => line.id === id);
    if (existing) {
      existing.quantity = Math.min(existing.quantity + entry.quantity, 9999);
    } else {
      restored.push({ id, productId: product.id, customization: savedCustomization, quantity: entry.quantity, unitPrice: salesUnit.price });
    }
  }
  return { items: restored, hadInvalidItems };
}

export default function Home() {
  const [cartItems, setCartItems] = useState<CartLine[]>([]);
  const [cartLoading, setCartLoading] = useState(true);
  const [canPersist, setCanPersist] = useState(false);
  const [storageMessage, setStorageMessage] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ApparelCategory | "all">("all");
  const [search, setSearch] = useState("");
  const storageWritesDisabled = useRef(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const savedCart = window.localStorage.getItem(CART_STORAGE_KEY);
        if (savedCart === null) {
          setCartItems([]);
        } else {
          const result = restoreCart(JSON.parse(savedCart) as unknown);
          setCartItems(result.items);
          if (result.hadInvalidItems) {
            setStorageMessage("Some saved bag items were no longer available and were not restored.");
          }
        }
        setCanPersist(true);
      } catch {
        setStorageMessage("Your saved bag could not be loaded. Changes may not persist in this browser.");
      } finally {
        setCartLoading(false);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (cartLoading || !canPersist || storageWritesDisabled.current) return;
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      storageWritesDisabled.current = true;
      window.setTimeout(() => {
        setStorageMessage("Your bag is available for this visit, but browser storage is unavailable.");
      }, 0);
    }
  }, [cartItems, cartLoading, canPersist, storageWritesDisabled]);

  const visibleProducts = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    return products.filter((product) => {
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
      const matchesQuery = !query || `${product.name} ${product.description} ${product.categoryLabel}`.toLocaleLowerCase().includes(query);
      return matchesCategory && matchesQuery;
    });
  }, [search, selectedCategory]);

  function addToCart(product: Product, customization: ProductCustomization) {
    const salesUnit = product.salesUnits.find((unit) => unit.id === customization.salesUnitId);
    if (!salesUnit) return;
    const id = lineId(product.id, customization);
    setCartItems((current) => {
      const existing = current.find((item) => item.id === id);
      if (existing) {
        return current.map((item) => item.id === id
          ? { ...item, quantity: Math.min(item.quantity + salesUnit.minimumOrderQuantity, 9999) }
          : item);
      }
      return [...current, {
        id,
        productId: product.id,
        customization,
        quantity: salesUnit.minimumOrderQuantity,
        unitPrice: salesUnit.price,
      }];
    });
  }

  function changeQuantity(id: string, quantity: number) {
    setCartItems((current) => current.map((item) => {
      if (item.id !== id) return item;
      const product = products.find((entry) => entry.id === item.productId);
      const salesUnit = product?.salesUnits.find((entry) => entry.id === item.customization.salesUnitId);
      const minimum = salesUnit?.minimumOrderQuantity ?? 1;
      return { ...item, quantity: Math.max(minimum, Math.min(quantity, 9999)) };
    }));
  }

  const categoryGroups = categories
    .filter((category) => category.id !== "all")
    .map((category) => ({
      id: category.id as ApparelCategory,
      label: category.label,
      items: visibleProducts.filter((product) => product.category === category.id),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <div className={styles.shopPage}>
      <div className={styles.announcement}>
        <span>Made for the everyday hustle</span>
        <span className={styles.announcementDivider} aria-hidden="true">/</span>
        <span>Wholesale and retail, all in one place</span>
      </div>
      <div className={styles.shell}>
        <header className={styles.header}>
          <Link className={styles.brand} href="/" aria-label="TeesTale home">
            <span className={styles.brandMark} aria-hidden="true">
              <svg viewBox="0 0 32 32" fill="none"><path d="M7 10 13 7h6l6 3 4 2-3 6-4-2v9H10v-9l-4 2-3-6 4-2Z" fill="currentColor" /><path d="M13 7c0 2 1 3 3 3s3-1 3-3" stroke="#f8f8f5" strokeWidth="1.5" /></svg>
            </span>
            <span className={styles.brandName}>TeesTale<span>®</span></span>
          </Link>
          <nav className={styles.headerNav} aria-label="Main navigation">
            <a href="#collection">Shop</a>
            <a href="#wholesale">Wholesale</a>
            <a href="#footer">Our story</a>
          </nav>
          <CartDrawer
            products={products}
            items={cartItems}
            loading={cartLoading}
            storageMessage={storageMessage}
            onChangeQuantity={changeQuantity}
            onRemove={(id) => setCartItems((items) => items.filter((item) => item.id !== id))}
          />
        </header>

        <main>
          <section className={styles.hero} aria-labelledby="hero-title">
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}><span /> CLOTHING FOR THE WAY YOU MOVE</p>
              <h1 id="hero-title">Good things<br />start with <em>the basics.</em></h1>
              <p className={styles.heroIntro}>Thoughtful tees, polos, and custom mesh made for your brand, your team, and your every day.</p>
              <a className={styles.heroButton} href="#collection">Explore the collection <span aria-hidden="true">↘</span></a>
            </div>
            <div className={styles.heroArt} aria-hidden="true">
              <span className={styles.heroArtLabel}>THE EVERYDAY EDIT<br /><strong>VOL. 01 / 2026</strong></span>
              <svg viewBox="0 0 440 330" fill="none">
                <circle cx="239" cy="165" r="131" fill="#ebe8df" />
                <path d="m147 77 39-27h57l39 27 50 23-29 53-31-16v112H157V137l-31 16-29-53 50-23Z" fill="#a4b3a2" />
                <path d="m186 50 16 23h26l15-23m-85 28 36 28m67-28-35 28" stroke="#f3f3ed" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M157 215h115" stroke="#8b9b89" strokeWidth="2" />
                <path d="M325 57c16 18 25 42 25 67m-243 96c-8-18-12-37-12-57" stroke="#bf775e" strokeWidth="2" strokeDasharray="3 7" />
                <circle cx="351" cy="126" r="6" fill="#bf775e" />
                <circle cx="96" cy="163" r="4" fill="#bf775e" />
              </svg>
              <span className={styles.heroArtCaption}>EVERYDAY, REIMAGINED.</span>
            </div>
          </section>

          <section className={styles.collection} id="collection" aria-labelledby="collection-title">
            <div className={styles.collectionIntro}>
              <div>
                <p className={styles.eyebrow}>THE TEESTALE COLLECTION</p>
                <h2 id="collection-title">Find your fit.</h2>
              </div>
              <p>Good fabric. Great fit. Ready for whatever you have in mind.</p>
            </div>

            <div className={styles.catalogToolbar}>
              <div className={styles.categoryFilters} role="group" aria-label="Filter by apparel category">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    className={`${styles.categoryButton} ${selectedCategory === category.id ? styles.categoryButtonActive : ""}`}
                    aria-pressed={selectedCategory === category.id}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
              <label className={styles.searchField}>
                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="8.8" cy="8.8" r="5.8" stroke="currentColor" strokeWidth="1.5" /><path d="m13.2 13.2 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                <span className={styles.srOnly}>Search the collection</span>
                <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search pieces" />
                {search && <button type="button" aria-label="Clear search" onClick={() => setSearch("")}>×</button>}
              </label>
            </div>

            <div className={styles.resultsLine} aria-live="polite">
              <span>{visibleProducts.length} {visibleProducts.length === 1 ? "piece" : "pieces"}</span>
              <span>Prices shown in NGN · ₦</span>
            </div>

            {visibleProducts.length === 0 ? (
              <div className={styles.noResults}>
                <h3>No pieces found.</h3>
                <p>Try a different search or browse another category.</p>
                <button type="button" onClick={() => { setSearch(""); setSelectedCategory("all"); }}>Clear filters</button>
              </div>
            ) : categoryGroups.map((group) => (
              <section className={styles.categorySection} key={group.id} id={group.id === "wholesale-blanks" ? "wholesale" : undefined} aria-labelledby={`category-${group.id}`}>
                <div className={styles.categoryHeading}>
                  <h3 id={`category-${group.id}`}>{group.label}</h3>
                  <span>{String(group.items.length).padStart(2, "0")} {group.items.length === 1 ? "style" : "styles"}</span>
                </div>
                <div className={styles.productGrid}>
                  {group.items.map((product) => (
                    <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
                  ))}
                </div>
              </section>
            ))}
          </section>

          <section className={styles.wholesaleBanner}>
            <div>
              <p className={styles.eyebrow}>MADE TO ORDER, MADE FOR YOU</p>
              <h2>Building a brand or outfitting a team?</h2>
              <p>Shop blank tees by the piece, pack, or bale. Set your size, color, and mesh details before adding to your bag.</p>
            </div>
            <a href="#collection">Shop wholesale blanks <span aria-hidden="true">↗</span></a>
          </section>
        </main>

        <footer className={styles.footer} id="footer">
          <Link className={styles.brand} href="/" aria-label="TeesTale home">
            <span className={styles.brandMark} aria-hidden="true">
              <svg viewBox="0 0 32 32" fill="none"><path d="M7 10 13 7h6l6 3 4 2-3 6-4-2v9H10v-9l-4 2-3-6 4-2Z" fill="currentColor" /></svg>
            </span>
            <span className={styles.brandName}>TeesTale<span>®</span></span>
          </Link>
          <p>Good clothes. Good stories. Made to move.</p>
          <span>© 2026 TeesTale · Prices in ₦ NGN</span>
        </footer>
      </div>
    </div>
  );
}
