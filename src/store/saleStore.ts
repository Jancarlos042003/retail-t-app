import { create } from 'zustand';

import { PaymentMethodType, ProductBarcodeType } from '@/types';

export interface SaleItem {
  product: ProductBarcodeType;
  quantity: number;
  subtotal: number;
}

interface LastSale {
  total: number;
  paymentMethodName: string;
}

interface SaleState {
  items: SaleItem[];
  paymentMethod: PaymentMethodType | null;
  amountPaid: number;
  lastSale: LastSale | null;

  addProduct: (product: ProductBarcodeType) => void;
  removeProduct: (productId: string) => void;
  changeQuantity: (productId: string, delta: number) => void;
  setPaymentMethod: (method: PaymentMethodType) => void;
  setAmountPaid: (amount: number) => void;
  setLastSale: (data: LastSale) => void;
  clearSale: () => void;
}

const getSubtotal = (product: ProductBarcodeType, quantity: number) =>
  (product.selling_price ?? 0) * quantity;

export const useSaleStore = create<SaleState>((set) => ({
  items: [],
  paymentMethod: null,
  amountPaid: 0,
  lastSale: null,

  addProduct: (product) =>
    set((state) => {
      const existing = state.items.find((item) => item.product.id === product.id);
      if (existing) {
        return {
          items: state.items.map((item) =>
            item.product.id === product.id
              ? {
                  ...item,
                  quantity: item.quantity + 1,
                  subtotal: getSubtotal(item.product, item.quantity + 1),
                }
              : item
          ),
        };
      }
      return {
        items: [
          ...state.items,
          { product, quantity: 1, subtotal: getSubtotal(product, 1) },
        ],
      };
    }),

  removeProduct: (productId) =>
    set((state) => ({
      items: state.items.filter((item) => item.product.id !== productId),
    })),

  changeQuantity: (productId, delta) =>
    set((state) => ({
      items: state.items.map((item) => {
        if (item.product.id !== productId) return item;
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty, subtotal: getSubtotal(item.product, newQty) };
      }),
    })),

  setPaymentMethod: (method) => set({ paymentMethod: method }),

  setAmountPaid: (amount) => set({ amountPaid: amount }),

  setLastSale: (data) => set({ lastSale: data }),

  clearSale: () => set({ items: [], paymentMethod: null, amountPaid: 0 }),
}));
