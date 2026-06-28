import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();
const CART_KEY = "cart_items";
const SAVED_KEY = "saved_for_later_items";

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    const stored = localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  const [savedForLater, setSavedForLater] = useState(() => {
    const stored = localStorage.getItem(SAVED_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem(SAVED_KEY, JSON.stringify(savedForLater));
  }, [savedForLater]);

  const addToCart = (product, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i._id === product._id);
      if (existing) {
        return prev.map((i) =>
          i._id === product._id ? { ...i, qty: i.qty + qty } : i
        );
      }
      return [...prev, { ...product, qty }];
    });
  };

  const removeFromCart = (id) => {
    setItems((prev) => prev.filter((i) => i._id !== id));
  };

  const updateQty = (id, qty) => {
    setItems((prev) =>
      prev.map((i) => (i._id === id ? { ...i, qty: Math.max(1, qty) } : i))
    );
  };

  const clearCart = () => setItems([]);

  // Move an item from the cart into "Saved for later"
  const saveForLater = (id) => {
    setItems((prev) => {
      const item = prev.find((i) => i._id === id);
      if (!item) return prev;
      setSavedForLater((savedPrev) => {
        if (savedPrev.some((s) => s._id === id)) return savedPrev;
        return [...savedPrev, item];
      });
      return prev.filter((i) => i._id !== id);
    });
  };

  // Move an item from "Saved for later" back into the cart
  const moveToCart = (id) => {
    setSavedForLater((prev) => {
      const item = prev.find((i) => i._id === id);
      if (!item) return prev;
      addToCart(item, item.qty || 1);
      return prev.filter((i) => i._id !== id);
    });
  };

  const removeFromSaved = (id) => {
    setSavedForLater((prev) => prev.filter((i) => i._id !== id));
  };

  const totalPrice = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const totalCount = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        totalPrice,
        totalCount,
        savedForLater,
        saveForLater,
        moveToCart,
        removeFromSaved,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
