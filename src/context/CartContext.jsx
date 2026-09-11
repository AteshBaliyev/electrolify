'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

const FREE_SHIPPING_THRESHOLD = 50; // 50 AZN və yuxarı sifarişlərə pulsuz çatdırılma

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // localStorage-dən ilkin məlumatları yüklə (SSR hydration xətası olmadan)
  useEffect(() => {
    setIsMounted(true);
    try {
      const savedCart = localStorage.getItem('electrolify_cart');
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      } else {
        setItems([]);
      }
    } catch (e) {
      console.warn('localStorage oxuma xətası:', e);
    }
  }, []);

  // Səbət dəyişdikdə localStorage-ə yaz
  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem('electrolify_cart', JSON.stringify(items));
    } catch (e) {
      console.warn('localStorage yazma xətası:', e);
    }
  }, [items, isMounted]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  /**
   * Məhsulu səbətə əlavə edir (openDrawer = true olduqda səbət panelini açır)
   */
  const addToCart = (product, variant, quantity = 1, openDrawer = true) => {
    const variantId = variant?.id || product?.variants?.edges?.[0]?.node?.id || product?.id;
    const variantTitle = variant?.title || 'Standart';
    const price = parseFloat(
      variant?.price?.amount || product?.priceRange?.minVariantPrice?.amount || 0
    );
    const compareAtPrice = parseFloat(
      variant?.compareAtPrice?.amount ||
        product?.compareAtPriceRange?.minVariantPrice?.amount ||
        price
    );
    const image =
      product?.images?.edges?.[0]?.node?.url ||
      product?.image ||
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80';

    const lineId = `${product.id || product.handle}-${variantId}`;

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.lineId === lineId);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prevItems,
          {
            lineId,
            productId: product.id,
            title: product.title,
            handle: product.handle,
            variantId,
            variantTitle,
            price,
            compareAtPrice,
            image,
            quantity,
          },
        ];
      }
    });

    // Səbət panelini şərtə görə aç
    if (openDrawer) {
      setIsCartOpen(true);
    }
  };

  /**
   * Cross-sell məhsulunu tək kliklə səbətə əlavə edir
   */
  const addCrossSellItem = (crossProduct) => {
    const lineId = `cross-${crossProduct.id}`;
    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.lineId === lineId);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += 1;
        return updated;
      } else {
        return [
          ...prevItems,
          {
            lineId,
            productId: crossProduct.id,
            title: crossProduct.title,
            handle: crossProduct.handle,
            variantId: `variant-${crossProduct.id}`,
            variantTitle: 'Standart',
            price: crossProduct.price,
            compareAtPrice: crossProduct.compareAtPrice,
            image: crossProduct.image,
            quantity: 1,
          },
        ];
      }
    });
    setIsCartOpen(true);
  };

  /**
   * Məhsulu səbətdən silir
   */
  const removeFromCart = (lineId) => {
    setItems((prev) => prev.filter((item) => item.lineId !== lineId));
  };

  /**
   * Səbətdəki məhsulun sayını yeniləyir
   */
  const updateQuantity = (lineId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(lineId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.lineId === lineId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setItems([]);

  // Hesablamalar
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalCount = items.reduce((acc, item) => acc + item.quantity, 0);
  // 50 AZN və yuxarı VƏ YA bir məhsuldan 2 ədəd (və ya cəmi 2+ məhsul) sifariş edildikdə Karqo TAM PULSUZDUR!
  const hasTwoOrMoreItems = totalCount >= 2 || items.some((item) => item.quantity >= 2);
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD || hasTwoOrMoreItems;
  const remainingForFreeShipping = isFreeShipping ? 0 : Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingPercentage = isFreeShipping
    ? 100
    : Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  return (
    <CartContext.Provider
      value={{
        items,
        isCartOpen,
        openCart,
        closeCart,
        addToCart,
        addCrossSellItem,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal: subtotal.toFixed(2),
        subtotalNumber: subtotal,
        totalCount,
        hasTwoOrMoreItems,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        isFreeShipping,
        remainingForFreeShipping,
        remainingForFreeShippingText: remainingForFreeShipping.toFixed(2),
        freeShippingPercentage,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart hook-u mütləq CartProvider daxilində istifadə olunmalıdır.');
  }
  return context;
}
