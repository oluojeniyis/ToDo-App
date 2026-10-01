"use client";

import { useEffect, useRef, useState } from "react";
import type { CartLine, Product } from "../../types";
import { formatPriceNGN, MESH_PLACEMENT_LABELS } from "../../types";
import styles from "../shop.module.css";

type CartDrawerProps = {
  products: Product[];
  items: CartLine[];
  loading: boolean;
  storageMessage: string;
  onChangeQuantity: (lineId: string, quantity: number) => void;
  onRemove: (lineId: string) => void;
};

export default function CartDrawer({
  products,
  items,
  loading,
  storageMessage,
  onChangeQuantity,
  onRemove,
}: CartDrawerProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const totalQuantity = items.reduce((sum, item) => {
    const unit = products.find((product) => product.id === item.productId)?.salesUnits.find((entry) => entry.id === item.customization.salesUnitId);
    return sum + item.quantity * (unit?.quantity ?? 1);
  }, 0);
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={styles.cartTrigger}
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`Open shopping bag, ${totalQuantity} ${totalQuantity === 1 ? "item" : "items"}`}
      >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M5 8h14l1 12H4L5 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M9 9V6a3 3 0 0 1 6 0v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span>Bag</span>
        <span className={styles.cartCount}>{totalQuantity}</span>
      </button>

      {open && (
        <div className={styles.drawerOverlay} onMouseDown={(event) => {
          if (event.target === event.currentTarget) {
            setOpen(false);
            triggerRef.current?.focus();
          }
        }}>
          <section
            className={styles.drawer}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
            onKeyDown={(event) => {
              if (event.key !== "Tab") return;
              const focusable = event.currentTarget.querySelectorAll<HTMLElement>(
                'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
              );
              const first = focusable[0];
              const last = focusable[focusable.length - 1];
              if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last?.focus();
              } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first?.focus();
              }
            }}
          >
            <div className={styles.drawerHeader}>
              <div>
                <p className={styles.drawerEyebrow}>YOUR SELECTION</p>
                <h2 className={styles.drawerTitle} id="cart-title">Shopping bag <span>({totalQuantity})</span></h2>
              </div>
              <button
                ref={closeRef}
                type="button"
                className={styles.closeButton}
                onClick={() => {
                  setOpen(false);
                  triggerRef.current?.focus();
                }}
                aria-label="Close shopping bag"
              >
                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>
              </button>
            </div>

            {storageMessage && <p className={styles.cartNotice} role="status">{storageMessage}</p>}

            {loading ? (
              <div className={styles.loadingState} role="status" aria-live="polite">
                <span className={styles.loadingMark} aria-hidden="true" />
                <p>Loading your bag…</p>
              </div>
            ) : items.length === 0 ? (
              <div className={styles.emptyCart}>
                <span className={styles.emptyBag} aria-hidden="true">
                  <svg viewBox="0 0 48 48" fill="none"><path d="M11 17h26l2 24H9l2-24Z" stroke="currentColor" strokeWidth="1.5" /><path d="M18 18v-4a6 6 0 0 1 12 0v4" stroke="currentColor" strokeWidth="1.5" /></svg>
                </span>
                <h3>Your bag is taking a breather.</h3>
                <p>Find a piece that feels like you, then come back here to check out your selection.</p>
                <button type="button" className={styles.continueButton} onClick={() => setOpen(false)}>Explore the collection</button>
              </div>
            ) : (
              <>
                <div className={styles.cartItems}>
                  {items.map((item) => {
                    const product = products.find((entry) => entry.id === item.productId);
                    if (!product) return null;
                    const color = product.colors.find((entry) => entry.id === item.customization.colorId);
                    const salesUnit = product.salesUnits.find((entry) => entry.id === item.customization.salesUnitId);
                    if (!salesUnit) return null;
                    return (
                      <article className={styles.cartItem} key={item.id}>
                        <div className={styles.cartItemVisual} style={{ backgroundColor: color?.hex ?? "#d9ddd9" }}>
                          <svg viewBox="0 0 64 64" aria-hidden="true">
                            <path d="m22 13 7-4h7l7 4 10 5-6 10-6-3v24H20V25l-6 3-6-10 10-5 4 2Z" fill="currentColor" />
                          </svg>
                        </div>
                        <div className={styles.cartItemContent}>
                          <div className={styles.cartItemTop}>
                            <div>
                            <h3>{product.name}</h3>
                            <p>{item.customization.size} · {color?.name ?? "Color"} · {MESH_PLACEMENT_LABELS[item.customization.meshPlacement]} · {salesUnit.label}</p>
                            </div>
                            <strong>{formatPriceNGN(item.unitPrice * item.quantity)}</strong>
                          </div>
                          <div className={styles.cartItemBottom}>
                            <div className={styles.quantityControl} aria-label={`Quantity for ${product.name}`}>
                              <button type="button" className={styles.quantityButton} onClick={() => onChangeQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= salesUnit.minimumOrderQuantity} aria-label={`Decrease ${product.name} quantity`}>−</button>
                              <span className={styles.quantityValue} aria-live="polite">{item.quantity}</span>
                              <button type="button" className={styles.quantityButton} onClick={() => onChangeQuantity(item.id, item.quantity + 1)} disabled={item.quantity >= 99} aria-label={`Increase ${product.name} quantity`}>+</button>
                            </div>
                            <button type="button" className={styles.removeButton} onClick={() => onRemove(item.id)}>Remove</button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
                <div className={styles.cartSummary}>
                  <div className={styles.subtotalRow}><span>Subtotal</span><strong>{formatPriceNGN(subtotal)}</strong></div>
                  <p>Shipping and taxes are calculated at checkout.</p>
                  <button type="button" className={styles.checkoutButton} disabled aria-disabled="true">Checkout coming soon</button>
                </div>
              </>
            )}
          </section>
        </div>
      )}
    </>
  );
}
