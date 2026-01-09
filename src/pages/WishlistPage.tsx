import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useWishlist } from "../context/WishlistContext";
import type { Movie } from "../types/movie";
import { Search, Trash2, Star, Heart, Film } from "lucide-react";

export const WishlistPage = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlistMovies = async () => {
      if (wishlist.length === 0) {
        setMovies([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const moviePromises = wishlist.map((id) =>
          fetch(
            `https://api.themoviedb.org/3/movie/${id}?api_key=${
              import.meta.env.VITE_MOVIE_API_KEY
            }&language=fr-FR`
          ).then((res) => res.json())
        );

        const moviesData = await Promise.all(moviePromises);
        setMovies(moviesData);
      } catch (error) {
        console.error("Failed to fetch wishlist movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistMovies();
  }, [wishlist]);

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#141414] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141414]">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Ma Liste</h1>
          <p className="text-gray-400">
            {wishlist.length === 0
              ? "Votre liste est vide"
              : `${wishlist.length} film${
                  wishlist.length > 1 ? "s" : ""
                } dans votre liste`}
          </p>
        </div>

        {wishlist.length > 0 && (
          <div className="mb-8">
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Rechercher dans ma liste..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[#2a2a2a] text-white rounded-md border border-gray-700 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/50 transition-all"
              />
            </div>
          </div>
        )}

        {wishlist.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="bg-[#2a2a2a] rounded-full p-8 mb-6">
              <Heart className="w-20 h-20 text-gray-600" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">
              Votre liste est vide
            </h2>
            <p className="text-gray-400 mb-8 text-center max-w-md">
              Explorez notre catalogue et ajoutez vos films préférés à votre
              liste pour les retrouver facilement !
            </p>
            <Link
              to="/"
              className="bg-red-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-red-700 transition-all flex items-center gap-2 group"
            >
              <Film className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Découvrir les films
            </Link>
          </div>
        )}

        {wishlist.length > 0 && filteredMovies.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <Search className="w-16 h-16 text-gray-600 mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">
              Aucun résultat trouvé
            </h2>
            <p className="text-gray-400">
              Essayez avec un autre terme de recherche
            </p>
          </div>
        )}

        {filteredMovies.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredMovies.map((movie) => (
              <div
                key={movie.id}
                className="group relative bg-[#2a2a2a] rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:z-10"
              >
                <Link to={`/movie/${movie.id}`} className="block">
                  <div className="relative aspect-2/3">
                    <img
                      src={
                        movie.poster_path
                          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                          : "https://via.placeholder.com/500x750?text=No+Image"
                      }
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                      <div className="p-4 w-full">
                        <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2">
                          {movie.title}
                        </h3>
                        <div className="flex items-center gap-2 text-xs">
                          <div className="flex items-center gap-1 text-yellow-400">
                            <Star className="w-3 h-3 fill-current" />
                            <span>{movie.vote_average.toFixed(1)}</span>
                          </div>
                          {movie.release_date && (
                            <span className="text-gray-400">
                              {new Date(movie.release_date).getFullYear()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>

                <button
                  onClick={() => removeFromWishlist(movie.id)}
                  className="absolute top-2 right-2 bg-black/80 hover:bg-red-600 text-white p-2 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 z-10"
                  title="Retirer de ma liste"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="absolute top-2 left-2 bg-red-600 text-white p-2 rounded-full">
                  <Heart className="w-4 h-4 fill-current" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
