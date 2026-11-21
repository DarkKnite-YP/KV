import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  weight_kg: number | null;
  mango_count: number | null;
  min_weight_g: number;
  is_bagged: boolean;
  image_url: string | null;
  stock_quantity: number;
}

export interface CartLine {
  product: CartProduct;
  quantity: number;
}

interface CartState {
  lines: CartLine[];
  isOpen: boolean;

  // Actions
  addItem: (product: CartProduct, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setCartOpen: (open: boolean) => void;

  // Computed
  totalItems: () => number;
  subtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      isOpen: false,

      addItem: (product, quantity = 1) => {
        set((state) => {
          const existing = state.lines.find(
            (line) => line.product.id === product.id
          );

          if (existing) {
            const newQty = Math.min(
              existing.quantity + quantity,
              product.stock_quantity
            );
            return {
              lines: state.lines.map((line) =>
                line.product.id === product.id
                  ? { ...line, quantity: newQty }
                  : line
              ),
            };
          }

          return {
            lines: [
              ...state.lines,
              { product, quantity: Math.min(quantity, product.stock_quantity) },
            ],
          };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          lines: state.lines.filter((line) => line.product.id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          lines: state.lines.map((line) =>
            line.product.id === productId
              ? {
                  ...line,
                  quantity: Math.min(quantity, line.product.stock_quantity),
                }
              : line
          ),
        }));
      },

      clearCart: () => set({ lines: [] }),

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      setCartOpen: (open) => set({ isOpen: open }),

      totalItems: () =>
        get().lines.reduce((sum, line) => sum + line.quantity, 0),

      subtotal: () =>
        get().lines.reduce(
          (sum, line) => sum + line.product.price * line.quantity,
          0
        ),
    }),
    {
      name: 'kesari-van-cart',
      partialize: (state) => ({ lines: state.lines }),
    }
  )
);

