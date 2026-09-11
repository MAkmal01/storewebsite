import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CartContext = createContext(null);

const FREE_SHIPPING_THRESHOLD = Infinity;
const SHIPPING_FEE = 300;

const COUPON_CODES = {
  DN10: { type: 'percent', value: 10, label: 'DN10 — 10% OFF' },
  WELCOME: { type: 'fixed', value: 500, label: 'WELCOME — Rs. 500 OFF' },
  FREESHIP: { type: 'shipping', value: 0, label: 'FREESHIP — Free Shipping' },
};

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem('dn_cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  useEffect(() => {
    localStorage.setItem('dn_cart', JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((product, selectedSize = '', selectedColor = '', quantity = 1) => {
    setItems((prev) => {
      const key = `${product._id}-${selectedSize}-${selectedColor}`;
      const existing = prev.find(
        (i) => i._id === product._id && i.selectedSize === selectedSize && i.selectedColor === selectedColor
      );
      if (existing) {
        return prev.map((i) =>
          i._id === product._id && i.selectedSize === selectedSize && i.selectedColor === selectedColor
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [
        ...prev,
        {
          _id: product._id,
          title: product.title,
          price: product.price,
          image: product.images?.[0] || '',
          selectedSize,
          selectedColor,
          quantity,
          slug: product.slug,
        },
      ];
    });
    setIsCartOpen(true);
  }, []);

  const removeItem = useCallback((productId, selectedSize, selectedColor) => {
    setItems((prev) =>
      prev.filter(
        (i) => !(i._id === productId && i.selectedSize === selectedSize && i.selectedColor === selectedColor)
      )
    );
  }, []);

  const updateQuantity = useCallback((productId, selectedSize, selectedColor, delta) => {
    setItems((prev) =>
      prev
        .map((i) =>
          i._id === productId && i.selectedSize === selectedSize && i.selectedColor === selectedColor
            ? { ...i, quantity: Math.max(0, i.quantity + delta) }
            : i
        )
        .filter((i) => i.quantity > 0)
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setAppliedCoupon(null);
    setCouponCode('');
  }, []);

  const applyCoupon = useCallback((code) => {
    const upper = code.trim().toUpperCase();
    const found = COUPON_CODES[upper];
    if (found) {
      setAppliedCoupon({ code: upper, ...found });
      return { success: true, label: found.label };
    }
    return { success: false, message: 'Invalid coupon code' };
  }, []);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  let shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  let discount = 0;

  if (appliedCoupon) {
    if (appliedCoupon.type === 'percent') {
      discount = Math.round(subtotal * (appliedCoupon.value / 100));
    } else if (appliedCoupon.type === 'fixed') {
      discount = Math.min(appliedCoupon.value, subtotal);
    } else if (appliedCoupon.type === 'shipping') {
      shippingFee = 0;
    }
  }

  const total = Math.max(0, subtotal + shippingFee - discount);
  const freeShippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        subtotal,
        shippingFee,
        discount,
        total,
        freeShippingProgress,
        amountToFreeShipping,
        isCartOpen,
        setIsCartOpen,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        couponCode,
        setCouponCode,
        appliedCoupon,
        applyCoupon,
        FREE_SHIPPING_THRESHOLD,
        SHIPPING_FEE,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
