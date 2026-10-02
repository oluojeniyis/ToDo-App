"use client";

import { useEffect, useRef, useState } from "react";
import type { MeshPlacement, Product, ProductColor, ProductCustomization } from "../../types";
import { formatPriceNGN, MESH_PLACEMENT_LABELS } from "../../types";
import styles from "../shop.module.css";

type ProductCardProps = {
  product: Product;
  onAddToCart: (product: Product, customization: ProductCustomization) => void;
};

function GarmentIllustration({
  productId,
  color,
  meshPlacement,
}: {
  productId: string;
  color: ProductColor;
  meshPlacement: ProductCustomization["meshPlacement"];
}) {
  const patternId = `mesh-${productId}`;

  return (
    <svg className={styles.productArt} viewBox="0 0 240 190" role="img" aria-label={`${color.name} ${productId.replaceAll("-", " ")} preview`}>
      <defs>
        <pattern id={patternId} width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="0.8" fill="currentColor" opacity=".55" />
          <circle cx="4.5" cy="4.5" r="0.8" fill="currentColor" opacity=".55" />
        </pattern>
        <filter id={`shadow-${productId}`} x="-20%" y="-20%" width="140%" height="160%">
          <feDropShadow dx="0" dy="10" stdDeviation="8" floodColor="#18232c" floodOpacity=".13" />
        </filter>
      </defs>
      <ellipse cx="120" cy="163" rx="57" ry="8" fill="#202a33" opacity=".07" />
      <g filter={`url(#shadow-${productId})`}>
        {productId.includes("tote") ? (
          <>
            <path d="M79 67h82l9 78H70l9-78Z" fill={color.hex} stroke="#27333a" strokeOpacity=".24" strokeWidth="1.5" />
            <path d="M98 70V55a22 22 0 0 1 44 0v15" fill="none" stroke={color.hex} strokeWidth="9" />
            <path d="M92 86h56" stroke="#fff" strokeOpacity=".35" strokeWidth="1.5" />
          </>
        ) : (
          <>
            <path
              d="m82 32 22-14h32l22 14 29 14-17 30-18-9v74H74V67l-18 9-17-30 29-14 14-9Z"
              fill={color.hex}
              stroke="#27333a"
              strokeOpacity=".22"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path d="m104 18 5 9h22l5-9" fill="none" stroke="#fff" strokeOpacity=".45" strokeWidth="2" />
            <path d="m81 33 15 14m63-14-15 14" fill="none" stroke="#fff" strokeOpacity=".22" strokeWidth="1.5" />
            {productId.includes("polo") && <path d="m104 25 16 15 16-15-10 21h-12l-10-21Z" fill="#f4f2eb" opacity=".9" />}
            {meshPlacement === "side-ventilation" && (
              <path d="M75 67h16v67H75zm74 0h16v67h-16z" fill={`url(#${patternId})`} color="#fff" opacity=".72" />
            )}
            {meshPlacement === "full-back" && (
              <path d="M94 47h52v22H94z" fill={`url(#${patternId})`} color="#fff" opacity=".72" />
            )}
            {productId.includes("crop") && <path d="M75 117h90v19H75z" fill="#f8f7f3" opacity=".92" />}
            {productId.includes("singlet") && (
              <path d="M88 31 99 24l7 15-8 7m54-15-11-7-7 15 8 7" fill="none" stroke="#f8f7f3" strokeWidth="5" strokeLinecap="round" />
            )}
            <path d="M81 132h78" stroke="#fff" strokeOpacity=".28" strokeWidth="1" />
          </>
        )}
      </g>
    </svg>
  );
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [size, setSize] = useState(product.sizes.includes("M") ? "M" : product.sizes[0]);
  const [color, setColor] = useState(product.colors[0]);
  const [meshPlacement, setMeshPlacement] = useState<ProductCustomization["meshPlacement"]>("none");
  const [salesUnitId, setSalesUnitId] = useState(product.salesUnits[0].id);
  const [added, setAdded] = useState(false);
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const selectedSalesUnit = product.salesUnits.find((unit) => unit.id === salesUnitId) ?? product.salesUnits[0];

  useEffect(() => () => {
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
  }, []);

  function handleAdd() {
    onAddToCart(product, { size, colorId: color.id, meshPlacement, salesUnitId: selectedSalesUnit.id });
    setAdded(true);
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    feedbackTimer.current = setTimeout(() => setAdded(false), 1400);
  }

  return (
    <article className={styles.productCard}>
      <div className={styles.productVisual}>
        {product.badge && <span className={styles.productBadge}>{product.badge}</span>}
        <div className={styles.visualStage}>
          <GarmentIllustration productId={product.id} color={color} meshPlacement={meshPlacement} />
        </div>
        <span className={styles.visualCaption}>Designed to move</span>
      </div>
      <div className={styles.productInfo}>
        <div className={styles.productMeta}>
          <span>{product.categoryLabel}</span>
          <span className={styles.price}>{formatPriceNGN(selectedSalesUnit.price)}</span>
        </div>
        <p className={styles.priceUnit}>{selectedSalesUnit.quantity > 1 ? `${selectedSalesUnit.quantity} pieces per unit` : selectedSalesUnit.label}</p>
        <h3 className={styles.productName}>{product.name}</h3>
        <p className={styles.productDescription}>{product.description}</p>

        <div className={styles.options}>
          <div className={styles.optionHeading}>
            <span className={styles.optionLabel}>Basic color</span>
            <span className={styles.selectedColor}>{color.name}</span>
          </div>
          <div className={styles.swatches} role="group" aria-label={`${product.name} basic color`}>
            {product.colors.map((option) => (
              <button
                key={option.id}
                type="button"
                className={`${styles.swatch} ${color.id === option.id ? styles.swatchSelected : ""}`}
                style={{ "--swatch-color": option.hex } as React.CSSProperties}
                aria-label={option.name}
                aria-pressed={color.id === option.id}
                onClick={() => setColor(option)}
              />
            ))}
          </div>
        </div>

        <div className={styles.selectRow}>
          <label className={styles.selectField}>
            <span className={styles.optionLabel}>Size</span>
            <select
              className={styles.select}
              value={size}
              onChange={(event) => {
                if (product.sizes.includes(event.target.value)) setSize(event.target.value);
              }}
            >
              {product.sizes.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </label>
          <label className={styles.selectField}>
            <span className={styles.optionLabel}>Mesh panels</span>
            <select
              className={styles.select}
              value={meshPlacement}
              onChange={(event) => {
                const selection = event.target.value;
                if (product.meshPlacements.includes(selection as MeshPlacement)) setMeshPlacement(selection as MeshPlacement);
              }}
            >
              {product.meshPlacements.map((option) => (
                <option key={option} value={option}>{MESH_PLACEMENT_LABELS[option]}</option>
              ))}
            </select>
          </label>
        </div>

        {product.salesUnits.length > 1 && (
          <label className={styles.selectField}>
            <span className={styles.optionLabel}>Buy by</span>
            <select className={styles.select} value={salesUnitId} onChange={(event) => {
              if (product.salesUnits.some((unit) => unit.id === event.target.value)) setSalesUnitId(event.target.value);
            }}>
              {product.salesUnits.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.label} · {formatPriceNGN(unit.price)}
                </option>
              ))}
            </select>
          </label>
        )}

        <button type="button" className={styles.addButton} onClick={handleAdd} aria-label={`Add ${product.name} to bag`}>
          <span>{added ? "Added to bag" : "Add to bag"}</span>
          <span aria-hidden="true">{added ? "✓" : "+"}</span>
        </button>
      </div>
    </article>
  );
}
