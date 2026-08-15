import { useState, useEffect, useCallback } from 'react';

const WISHLIST_KEY = 'xafor_wishlist';

export function useWishlist() {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const stored = localStorage.getItem(WISHLIST_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = useCallback((product) => {
    setWishlist(prev => {
      if (prev.some(item => item.id === product.id)) return prev;
      return [...prev, { ...product }];
    });
  }, []);

  const removeFromWishlist = useCallback((productId) => {
    setWishlist(prev => prev.filter(item => item.id !== productId));
  }, []);

  const moveToCart = useCallback((product) => {
    // Will be connected to cart hook in component
    removeFromWishlist(product.id);
  }, [removeFromWishlist]);

  const wishlistTotal = wishlist.reduce((sum, item) => sum + item.price, 0);

  return {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    moveToCart,
    wishlistTotal,
  };
}
