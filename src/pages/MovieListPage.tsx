import { useState, useEffect } from "react";
import { Link } from "react-router";
import type { Movie } from "../types/movie";
import { Search, Star, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import { useDebounce } from "../hooks/useDebounce";

type Category = "now_playing" | "popular" | "top_rated" | "upcoming";

export const MovieListPage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentCategory, setCurrentCategory] = useState<Category>("popular");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const categories = [
    { id: "now_playing" as Category, label: "En ce moment" },
    { id: "popular" as Category, label: "Populaires" },
    { id: "top_rated" as Category, label: "Les mieux notés" },
    { id: "upcoming" as Category, label: "À venir" },
  ];

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        let url = "";

        if (debouncedSearchQuery.trim()) {
          url = `https://api.themoviedb.org/3/search/movie?api_key=${
            import.meta.env.VITE_MOVIE_API_KEY
          }&language=fr-FR&query=${encodeURIComponent(
            debouncedSearchQuery
          )}&page=${currentPage}`;
        } else {
          url = `https://api.themoviedb.org/3/movie/${currentCategory}?api_key=${
            import.meta.env.VITE_MOVIE_API_KEY
          }&language=fr-FR&page=${currentPage}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        setMovies(data.results || []);
        setTotalPages(Math.min(data.total_pages || 1, 500));
      } catch (error) {
        console.error("Failed to fetch movies:", error);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [debouncedSearchQuery, currentCategory, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery, currentCategory]);

  const handleCategoryChange = (category: Category) => {
    setCurrentCategory(category);
    setSearchQuery("");
  };

  const handleWishlistToggle = (movieId: number) => {
    if (isInWishlist(movieId)) {
      removeFromWishlist(movieId);
    } else {
      addToWishlist(movieId);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#141414]">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Découvrez des films
          </h1>

          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Rechercher un film..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#2a2a2a] text-white pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              >
                ✕
              </button>
            )}
          </div>

          {!searchQuery && (
            <div className="flex flex-wrap gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`px-6 py-2 rounded-full font-medium transition-all ${
                    currentCategory === cat.id
                      ? "bg-red-600 text-white"
                      : "bg-[#2a2a2a] text-gray-300 hover:bg-[#3a3a3a]"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {searchQuery && (
          <div className="mb-4 text-gray-400">
            {loading ? (
              <p>Recherche en cours...</p>
            ) : (
              <p>
                {movies.length} résultat{movies.length > 1 ? "s" : ""} pour "
                {searchQuery}"
              </p>
            )}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600"></div>
          </div>
        ) : movies.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl">
              {searchQuery
                ? `Aucun film trouvé pour "${searchQuery}"`
                : "Aucun film disponible"}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {movies.map((movie) => (
                <div key={movie.id} className="group relative">
                  <Link to={`/movie/${movie.id}`}>
                    <div className="relative aspect-2/3 rounded-lg overflow-hidden bg-[#2a2a2a] cursor-pointer">
                      <img
                        src={
                          movie.poster_path
                            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                            : "https://via.placeholder.com/500x750?text=No+Poster"
                        }
                        alt={movie.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
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
                    onClick={() => handleWishlistToggle(movie.id)}
                    className="absolute top-2 right-2 bg-black/80 hover:bg-black text-white p-2 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 z-10"
                    title={
                      isInWishlist(movie.id)
                        ? "Retirer de ma liste"
                        : "Ajouter à ma liste"
                    }
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isInWishlist(movie.id)
                          ? "fill-current text-red-600"
                          : ""
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all w-full sm:w-auto ${
                  currentPage === 1
                    ? "bg-[#2a2a2a] text-gray-600 cursor-not-allowed"
                    : "bg-red-600 text-white hover:bg-red-700"
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
                Précédent
              </button>

              <div className="flex items-center gap-2 text-center">
                <span className="text-white font-medium">
                  Page {currentPage}
                </span>
                <span className="text-gray-500">sur</span>
                <span className="text-white font-medium">{totalPages}</span>
              </div>

              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all w-full sm:w-auto ${
                  currentPage === totalPages
                    ? "bg-[#2a2a2a] text-gray-600 cursor-not-allowed"
                    : "bg-red-600 text-white hover:bg-red-700"
                }`}
              >
                Suivant
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 text-center text-sm text-gray-400">
              Affichage de {movies.length} films sur cette page
            </div>
          </>
        )}
      </div>
    </div>
  );
};
