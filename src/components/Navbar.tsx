import { Link, useLocation } from "react-router";
import { Film, Heart } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";

export const Navbar = () => {
  const { wishlist } = useWishlist();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-[#141414] border-b border-gray-800 sticky top-0 z-50 backdrop-blur-md bg-opacity-95">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            className="flex items-center gap-2 text-red-600 font-bold text-2xl hover:text-red-500 transition-colors"
          >
            <Film className="w-8 h-8" />
            <span className="hidden sm:block">MOVIEFLIX</span>
          </Link>

          <div className="flex items-center gap-6">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${
                isActive("/")
                  ? "text-white"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              Accueil
            </Link>

            <Link
              to="/wishlist"
              className={`flex items-center gap-2 text-sm font-medium transition-colors relative ${
                isActive("/wishlist")
                  ? "text-white"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              <Heart
                className={`w-5 h-5 ${
                  wishlist.length > 0 ? "fill-red-600 text-red-600" : ""
                }`}
              />
              <span className="hidden sm:block">Ma Liste</span>
              {wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
