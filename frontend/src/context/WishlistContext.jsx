import React, { createContext, useState, useContext, useEffect } from "react";

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const localData = localStorage.getItem("wishlistItems");
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      console.error("Could not parse wishlist items from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("wishlistItems", JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const addToWishlist = (product) => {
    setWishlistItems((prevItems) => {
      const exists = prevItems.find((item) => item._id === product._id);
      if (exists) {
        return prevItems; // Already in wishlist
      }
      return [
        ...prevItems,
        {
          _id: product._id,
          name: product.name,
          price: product.price,
          discountedPrice: product.discountedPrice,
          image: product.mainImage?.url || "",
          material: product.material,
          sizes: product.sizes,
          ratings: product.ratings,
        },
      ];
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems((prevItems) =>
      prevItems.filter((item) => item._id !== productId)
    );
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item._id === productId);
  };

  const toggleWishlist = (product) => {
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  const clearWishlist = () => {
    setWishlistItems([]);
  };

  const value = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
    clearWishlist,
    wishlistCount: wishlistItems.length,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
