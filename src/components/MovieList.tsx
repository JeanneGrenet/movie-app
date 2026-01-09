import { useEffect, useState } from "react";
import type { Movie } from "../types/movie";
import { Star } from "lucide-react";

export const MovieList = () => {
  const [movieList, setMovieList] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPopularMovies = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/popular?api_key=${
            import.meta.env.VITE_MOVIE_API_KEY
          }`
        );
        const data = await response.json();
        setMovieList(data.results);
        setIsLoading(true);
      } catch (e) {
        console.error("Failed to load movies: ", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPopularMovies();
  }, []);
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Films Populaires
      </h2>

      {isLoading && (
        <p className="text-center text-gray-600">Chargement en cours...</p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {movieList.map((movie) => (
          <div
            key={movie.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl"
          >
            <div className="relative aspect-2/3">
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="w-full h-full object-cover"
              />

              <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded-md flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-sm font-semibold">
                  {movie.vote_average.toFixed(1)}
                </span>
              </div>
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-gray-800 line-clamp-2 text-sm md:text-base">
                {movie.title}
              </h3>
              <p className="text-gray-500 text-xs mt-1">
                {new Date(movie.release_date).getFullYear()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
