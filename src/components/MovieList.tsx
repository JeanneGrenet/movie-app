import { useEffect, useState } from "react";
import { Link } from "react-router";
import type { Movie } from "../types/movie";
import { Star, Search, TrendingUp, Film, Award, Clock } from "lucide-react";

type Category = "now_playing" | "popular" | "top_rated" | "upcoming";

const categories: { key: Category; label: string; icon: typeof Film }[] = [
  { key: "now_playing", label: "En ce moment", icon: Clock },
  { key: "popular", label: "Populaires", icon: TrendingUp },
  { key: "top_rated", label: "Mieux notés", icon: Award },
  { key: "upcoming", label: "À venir", icon: Film },
];

export const MovieList = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category>("popular");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${selectedCategory}?api_key=${
            import.meta.env.VITE_MOVIE_API_KEY
          }&language=fr-FR&page=1`
        );
        const data = await response.json();
        setMovies(data.results);
        setFilteredMovies(data.results);
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [selectedCategory]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredMovies(movies);
    } else {
      const filtered = movies.filter((movie) =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMovies(filtered);
    }
  }, [searchQuery, movies]);

  return (
    <div className="min-h-screen bg-[#141414] pb-12">
      <div className="bg-linear-to-b from-black/60 to-transparent pt-8 pb-12">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher un titre, un genre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-[#1c1c1c] border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.key}
                  onClick={() => setSelectedCategory(category.key)}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-md font-medium transition-all ${
                    selectedCategory === category.key
                      ? "bg-red-600 text-white shadow-lg shadow-red-600/50"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6">
        {searchQuery && (
          <h2 className="text-2xl font-bold text-white mb-8">
            {filteredMovies.length > 0
              ? `${filteredMovies.length} résultat${
                  filteredMovies.length > 1 ? "s" : ""
                } pour "${searchQuery}"`
              : `Aucun résultat pour "${searchQuery}"`}
          </h2>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center py-32">
            <div className="relative">
              <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-red-600"></div>
              <Film className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-red-600" />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredMovies.map((movie) => (
              <Link
                key={movie.id}
                to={`/movie/${movie.id}`}
                className="group cursor-pointer"
              >
                <div className="relative aspect-2/3 rounded-md overflow-hidden bg-gray-800 shadow-lg">
                  <img
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : "https://via.placeholder.com/500x750?text=No+Image"
                    }
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />

                  <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white font-bold text-sm mb-2 line-clamp-2">
                        {movie.title}
                      </h3>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-300">
                          {movie.release_date
                            ? new Date(movie.release_date).getFullYear()
                            : "N/A"}
                        </span>
                        <div className="flex items-center gap-1 bg-yellow-500 text-black px-2 py-0.5 rounded font-bold">
                          <Star className="w-3 h-3 fill-current" />
                          <span>{movie.vote_average.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm text-white px-2 py-1 rounded flex items-center gap-1 group-hover:opacity-0 transition-opacity">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs font-bold">
                      {movie.vote_average.toFixed(1)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
