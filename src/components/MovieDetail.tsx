import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import type { MovieDetail as MovieDetailType, Cast } from "../types/movie";
import { Star, Clock, Calendar, Heart, Play, ArrowLeft } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";

export const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieDetailType | null>(null);
  const [cast, setCast] = useState<Cast[]>([]);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const inWishlist = movie ? isInWishlist(movie.id) : false;

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const [movieResponse, creditsResponse] = await Promise.all([
          fetch(
            `https://api.themoviedb.org/3/movie/${id}?api_key=${
              import.meta.env.VITE_MOVIE_API_KEY
            }&language=fr-FR`
          ),
          fetch(
            `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${
              import.meta.env.VITE_MOVIE_API_KEY
            }&language=fr-FR`
          ),
        ]);

        const movieData = await movieResponse.json();
        const creditsData = await creditsResponse.json();

        setMovie(movieData);
        setCast(creditsData.cast.slice(0, 10));
      } catch (error) {
        console.error("Failed to fetch movie details:", error);
      }
    };

    if (id) {
      fetchMovieDetails();
    }
  }, [id]);

  const handleWishlistToggle = () => {
    if (movie) {
      if (inWishlist) {
        removeFromWishlist(movie.id);
      } else {
        addToWishlist(movie.id);
      }
    }
  };

  if (!movie) {
    return (
      <div className="min-h-screen bg-[#141414] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141414]">
      <div className="relative h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh]">
        <img
          src={
            movie.backdrop_path
              ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
              : "https://via.placeholder.com/1920x1080?text=No+Backdrop"
          }
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#141414] via-[#141414]/60 to-transparent" />

        <Link
          to="/"
          className="absolute top-4 left-4 sm:top-6 sm:left-6 bg-black/70 hover:bg-black text-white p-2 sm:p-3 rounded-full transition-all z-10 backdrop-blur-sm"
        >
          <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </Link>

        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 lg:p-12">
          <div className="container mx-auto max-w-7xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 sm:mb-4 drop-shadow-lg">
              {movie.title}
            </h1>

            {movie.tagline && (
              <p className="text-sm sm:text-base md:text-lg text-gray-300 italic mb-3 sm:mb-4 drop-shadow-lg">
                "{movie.tagline}"
              </p>
            )}

            <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4 sm:mb-6 text-sm sm:text-base">
              <div className="flex items-center gap-1 sm:gap-2 bg-yellow-400 text-black px-2 sm:px-3 py-1 rounded-md font-bold">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                <span>{movie.vote_average.toFixed(1)}</span>
              </div>

              {movie.release_date && (
                <div className="flex items-center gap-1 sm:gap-2 text-gray-300">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>{new Date(movie.release_date).getFullYear()}</span>
                </div>
              )}

              {movie.runtime && (
                <div className="flex items-center gap-1 sm:gap-2 text-gray-300">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>
                    {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}min
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button className="bg-white hover:bg-gray-200 text-black px-6 sm:px-8 py-2 sm:py-3 rounded-md font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 group">
                <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current group-hover:scale-110 transition-transform" />
                Lecture
              </button>

              <button
                onClick={handleWishlistToggle}
                className={`${
                  inWishlist
                    ? "bg-gray-800 hover:bg-gray-700"
                    : "bg-gray-800/80 hover:bg-gray-700"
                } text-white px-6 sm:px-8 py-2 sm:py-3 rounded-md font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 group backdrop-blur-sm`}
              >
                <Heart
                  className={`w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform ${
                    inWishlist ? "fill-current text-red-600" : ""
                  }`}
                />
                {inWishlist ? "Dans ma liste" : "Ma liste"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-12 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
                Synopsis
              </h2>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                {movie.overview || "Aucun synopsis disponible"}
              </p>
            </div>

            {cast.length > 0 && (
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">
                  Distribution
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                  {cast.map((actor) => (
                    <div key={actor.id} className="group cursor-pointer">
                      <div className="aspect-2/3 rounded-lg overflow-hidden mb-2 bg-[#2a2a2a]">
                        <img
                          src={
                            actor.profile_path
                              ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                              : "https://via.placeholder.com/200x300?text=No+Image"
                          }
                          alt={actor.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <h3 className="text-white font-semibold text-xs sm:text-sm truncate">
                        {actor.name}
                      </h3>
                      <p className="text-gray-400 text-xs truncate">
                        {actor.character}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4 sm:space-y-6">
            {movie.genres.length > 0 && (
              <div className="bg-[#2a2a2a] p-4 sm:p-6 rounded-lg">
                <h3 className="text-base sm:text-lg font-bold text-white mb-3">
                  Genres
                </h3>
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="bg-red-600 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-medium"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-[#2a2a2a] p-4 sm:p-6 rounded-lg space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4">
                Informations
              </h3>

              <div>
                <p className="text-xs sm:text-sm text-gray-400 mb-1">
                  Date de sortie
                </p>
                <p className="text-sm sm:text-base text-white font-medium">
                  {movie.release_date
                    ? new Date(movie.release_date).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : "N/A"}
                </p>
              </div>

              <div>
                <p className="text-xs sm:text-sm text-gray-400 mb-1">Durée</p>
                <p className="text-sm sm:text-base text-white font-medium">
                  {movie.runtime
                    ? `${Math.floor(movie.runtime / 60)}h ${
                        movie.runtime % 60
                      }min`
                    : "N/A"}
                </p>
              </div>

              <div>
                <p className="text-xs sm:text-sm text-gray-400 mb-1">Note</p>
                <p className="text-sm sm:text-base text-white font-medium">
                  {movie.vote_average.toFixed(1)}/10 ({movie.vote_count} votes)
                </p>
              </div>

              {movie.status && (
                <div>
                  <p className="text-xs sm:text-sm text-gray-400 mb-1">
                    Statut
                  </p>
                  <p className="text-sm sm:text-base text-white font-medium">
                    {movie.status}
                  </p>
                </div>
              )}

              <div>
                <p className="text-xs sm:text-sm text-gray-400 mb-1">
                  Langue originale
                </p>
                <p className="text-sm sm:text-base text-white font-medium uppercase">
                  {movie.original_language}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
