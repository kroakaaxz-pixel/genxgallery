import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';

const WishlistContext = createContext(null);
const STORAGE_KEY = 'gxg_wishlist';

function loadWishlist() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }) {
  const [ids, setIds] = useState(loadWishlist);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  }, [ids]);

  const toggle = useCallback((productId) => {
    setIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  }, []);

  const has = useCallback(
    (productId) => ids.includes(productId),
    [ids]
  );

  const count = ids.length;

  const value = useMemo(
    () => ({ ids, toggle, has, count }),
    [ids, toggle, has, count]
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
