import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      selectedCity: null,

      setCity: (city) => set({ selectedCity: city }),

      addItem: (product) => {
        const items = get().items;
        const existing = items.find((i) => i.id === product.id);
        if (existing) {
          set({ items: items.map((i) => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i) });
        } else {
          set({ items: [...items, { ...product, quantity: 1 }] });
        }
      },

      removeItem: (productId) =>
        set({ items: get().items.filter((i) => i.id !== productId) }),

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          set({ items: get().items.filter((i) => i.id !== productId) });
        } else {
          set({ items: get().items.map((i) => i.id === productId ? { ...i, quantity } : i) });
        }
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => get().items.reduce((acc, i) => acc + i.quantity, 0),

      // Groupe les articles par vendeur pour le checkout WhatsApp
      getItemsByVendor: () => {
        const items = get().items;
        return items.reduce((acc, item) => {
          const key = item.vendorId;
          if (!acc[key]) acc[key] = { vendor: { id: item.vendorId, name: item.vendorName, whatsapp: item.vendorWhatsapp }, items: [] };
          acc[key].items.push(item);
          return acc;
        }, {});
      },
    }),
    { name: 'vestyle-cart' }
  )
);
