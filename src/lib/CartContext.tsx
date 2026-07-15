'use client';

/* ============================================================
   CART CONTEXT — the single cart for the whole site.

   Mounted once in app/layout.tsx, so it survives route changes:
   Homepage, ShopPage and SiteShell (CategoryPage + ProductDetail)
   all read the same bag. Before this, each of those three held its
   own useState cart and a navigation silently emptied it.

   The bag is backed by localStorage so it also survives a reload.
   localStorage is an external store, so it is read through
   useSyncExternalStore rather than copied into state inside an
   effect — that keeps the server render (an empty bag) and the
   hydration render in agreement, and gives cross-tab sync for free.
   ============================================================ */

import React, {
  createContext, useContext, useState, useCallback, useMemo,
  useSyncExternalStore,
  type Dispatch, type SetStateAction,
} from 'react';
import type { ProductItem, CartItem } from './siteData';

const CART_KEY     = 'hunarkar:cart';
const CURRENCY_KEY = 'hunarkar:currency';

export type Currency = 'USD' | 'PKR';

interface Snapshot {
  cart: CartItem[];
  currency: Currency;
}

/* ============================================================
   STORE — localStorage-backed, framework-free
   ============================================================ */

/* What the server renders, and what the client renders while hydrating.
   Must be a stable reference: useSyncExternalStore compares by identity. */
const EMPTY: Snapshot = { cart: [], currency: 'PKR' };

/* Storage can hold anything a previous version — or a user — put there.
   Anything that is not a well-formed line item is dropped rather than
   allowed to reach the render and blow up on `item.usdPrice.toFixed`. */
function parseCart(raw: string | null): CartItem[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((i: unknown): i is CartItem => {
      if (!i || typeof i !== 'object') return false;
      const c = i as Record<string, unknown>;
      return (
        typeof c.id === 'string' &&
        typeof c.name === 'string' &&
        typeof c.img === 'string' &&
        typeof c.usdPrice === 'number' &&
        typeof c.pkrPrice === 'number' &&
        typeof c.quantity === 'number' &&
        c.quantity > 0
      );
    });
  } catch {
    return [];
  }
}

function parseCurrency(raw: string | null): Currency {
  return raw === 'USD' || raw === 'PKR' ? raw : 'PKR';
}

function readStorage(): Snapshot {
  return {
    cart: parseCart(localStorage.getItem(CART_KEY)),
    currency: parseCurrency(localStorage.getItem(CURRENCY_KEY)),
  };
}

/* getSnapshot is called on every render and compared by identity, so it must
   return a cached object — re-reading and re-parsing localStorage each time
   would hand React a new reference every render and spin forever. */
let cached: Snapshot | null = null;
const listeners = new Set<() => void>();

function getSnapshot(): Snapshot {
  if (cached === null) cached = readStorage();
  return cached;
}

function getServerSnapshot(): Snapshot {
  return EMPTY;
}

function emit() {
  for (const l of listeners) l();
}

/* A write from another tab leaves this one stale. */
function onStorage(e: StorageEvent) {
  if (e.key === CART_KEY || e.key === CURRENCY_KEY || e.key === null) {
    cached = readStorage();
    emit();
  }
}

function subscribe(cb: () => void): () => void {
  if (listeners.size === 0) window.addEventListener('storage', onStorage);
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
    if (listeners.size === 0) window.removeEventListener('storage', onStorage);
  };
}

function commit(next: Snapshot) {
  cached = next;
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(next.cart));
    localStorage.setItem(CURRENCY_KEY, next.currency);
  } catch {
    /* private mode / quota — keep the in-memory bag working regardless */
  }
  emit();
}

function setCartItems(updater: (prev: CartItem[]) => CartItem[]) {
  const prev = getSnapshot();
  commit({ ...prev, cart: updater(prev.cart) });
}

/* ============================================================
   CONTEXT
   ============================================================ */

interface CartContextType {
  cart: CartItem[];
  addToCart: (p: ProductItem, qty?: number) => void;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  cartCount: number;

  cartOpen: boolean;
  setCartOpen: Dispatch<SetStateAction<boolean>>;

  currency: Currency;
  setCurrency: Dispatch<SetStateAction<Currency>>;
  formatPrice: (usd: number, pkr: number) => string;
  getSubtotal: () => string;
}

const CartContext = createContext<CartContextType | null>(null);

export function useCart(): CartContextType {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { cart, currency } = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  /* Drawer visibility is per-session UI, not part of the persisted bag. */
  const [cartOpen, setCartOpen] = useState(false);

  /* ---------- mutations ---------- */
  const addToCart = useCallback((product: ProductItem, qty = 1) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i =>
          i.id === product.id ? { ...i, quantity: i.quantity + qty } : i,
        );
      }
      return [...prev, { ...product, quantity: qty }];
    });
    setCartOpen(true);
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCartItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const updateQty = useCallback((id: string, qty: number) => {
    setCartItems(prev =>
      qty <= 0
        ? prev.filter(i => i.id !== id)
        : prev.map(i => (i.id === id ? { ...i, quantity: qty } : i)),
    );
  }, []);

  const clearCart = useCallback(() => setCartItems(() => []), []);

  const setCurrency = useCallback<Dispatch<SetStateAction<Currency>>>(next => {
    const prev = getSnapshot();
    commit({
      ...prev,
      currency: typeof next === 'function' ? next(prev.currency) : next,
    });
  }, []);

  /* ---------- derived ---------- */
  const cartCount = useMemo(
    () => cart.reduce((s, i) => s + i.quantity, 0),
    [cart],
  );

  const formatPrice = useCallback(
    (usd: number, pkr: number) =>
      currency === 'USD'
        ? `$${usd.toFixed(2)}`
        : `Rs ${pkr.toLocaleString('en-US')}`,
    [currency],
  );

  const getSubtotal = useCallback(
    () =>
      currency === 'USD'
        ? `$${cart.reduce((s, i) => s + i.usdPrice * i.quantity, 0).toFixed(2)}`
        : `Rs ${cart.reduce((s, i) => s + i.pkrPrice * i.quantity, 0).toLocaleString('en-US')}`,
    [cart, currency],
  );

  const value = useMemo<CartContextType>(
    () => ({
      cart, addToCart, removeFromCart, updateQty, clearCart, cartCount,
      cartOpen, setCartOpen,
      currency, setCurrency, formatPrice, getSubtotal,
    }),
    [
      cart, addToCart, removeFromCart, updateQty, clearCart, cartCount,
      cartOpen, currency, setCurrency, formatPrice, getSubtotal,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
