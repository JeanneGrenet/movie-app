import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

type WishlistContextType = {
  wishlist: number[];
  addToWishlist: (movieId: number) => void;
  removeFromWishlist: (movieId: number) => void;
  isInWishlist: (movieId: number) => boolean;
};

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlist, setWishlist] = useState<number[]>(() => {
    const saved = localStorage.getItem("movieWishlist");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("movieWishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (movieId: number) => {
    setWishlist((prev) => [...prev, movieId]);
  };

  const removeFromWishlist = (movieId: number) => {
    setWishlist((prev) => prev.filter((id) => id !== movieId));
  };

  const isInWishlist = (movieId: number) => {
    return wishlist.includes(movieId);
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return context;
};
