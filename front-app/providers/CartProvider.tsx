import { useState, createContext, ReactNode, useEffect, useContext } from 'react';
import { saveCart, clearCart, loadCart, Cart } from '../storage/cartStorage';

type CartContextValue = {
  cart?: Cart;
  loading: boolean;
  push: (storeId: number, storeName: string, item: Cart['items'][number]) => Promise<void>;
  removeAt: (index: number) => Promise<void>;
  editAt: (index: number, item: Cart['items'][number]) => Promise<void>;
  clear: () => Promise<void>;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

type CartProviderProps = {
  children: ReactNode;
};

export function CartProvider({ children }: CartProviderProps) {
  const [cart, setCart] = useState<Cart | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        const saved = await loadCart();
        if (saved) setCart(saved);
      } catch (err) {
        setCart(undefined);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const push = async (storeId: number, storeName: string, item: Cart['items'][number]) => {
    const newItems: Array<Cart['items'][number]>
      = storeId == cart?.storeId ? [...cart.items] : []
    newItems.push(item);

    const newCart: Cart = {
      storeId: storeId,
      storeName: storeName,
      items: newItems,
    };

    setCart(newCart);
    await saveCart(newCart);
  };

  const removeAt = async (index: number) => {
    if (cart) {
      const newItems = [...cart.items];

      const newCart: Cart = {
        storeId: cart.storeId,
        storeName: cart.storeName,
        items: newItems.filter((_, i) => i !== index),
      };

      setCart(newCart);
      await saveCart(newCart);
    }
  };

  const editAt = async (index: number, newItem: Cart['items'][number]) => {
    if (cart) {
      const newItems = [...cart.items];
      newItems[index] = newItem;

      const newCart: Cart = {
        storeId: cart.storeId,
        storeName: cart.storeName,
        items: newItems,
      };

      setCart(newCart);
      await saveCart(newCart);
    }
  };

  const clear = async () => {
    setCart(undefined);
    await clearCart();
  };

  const value: CartContextValue = {
    cart,
    loading,
    push,
    removeAt,
    editAt,
    clear,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
