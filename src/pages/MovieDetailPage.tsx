import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import type {
  MovieDetail as MovieDetailType,
  Cast,
  VideosResponse,
} from "../types/movie";
import { Star, Clock, Calendar, Heart, Play, ArrowLeft, X } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";

export const MovieDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieDetailType | null>(null);
  const [cast, setCast] = useState<Cast[]>([]);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const inWishlist = movie ? isInWishlist(movie.id) : false;

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const [movieResponse, creditsResponse, videosResponse] =
          await Promise.all([
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
            fetch(
              `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${
                import.meta.env.VITE_MOVIE_API_KEY
              }&language=fr-FR`
            ),
          ]);

        const movieData = await movieResponse.json();
        const creditsData = await creditsResponse.json();
        const videosData: VideosResponse = await videosResponse.json();

        setMovie(movieData);
        setCast(creditsData.cast.slice(0, 10));

        // Chercher la bande-annonce FR, sinon EN
        const frTrailer = videosData.results.find(
          (video) =>
            video.type === "Trailer" &&
            video.site === "YouTube" &&
            video.iso_639_1 === "fr"
        );

        if (frTrailer) {
          setTrailerKey(frTrailer.key);
        } else {
          // Fallback vers EN si pas de FR
          const videosResponseEN = await fetch(
            `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${
              import.meta.env.VITE_MOVIE_API_KEY
            }&language=en-US`
          );
          const videosDataEN: VideosResponse = await videosResponseEN.json();
          const enTrailer = videosDataEN.results.find(
            (video) => video.type === "Trailer" && video.site === "YouTube"
          );
          if (enTrailer) {
            setTrailerKey(enTrailer.key);
          }
        }
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
      {showTrailer && trailerKey && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setShowTrailer(false)}
        >
          <div
            className="relative w-full max-w-5xl aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            <iframe
              className="w-full h-full rounded-lg"
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

      <div className="relative w-full h-[50vh] md:h-[70vh]">
        <div className="absolute inset-0">
          <img
            src={
              movie.backdrop_path
                ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
                : "https://via.placeholder.com/1920x1080?text=No+Image"
            }
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#141414] via-[#141414]/60 to-transparent"></div>
        </div>

        <div className="absolute top-4 left-4 md:top-8 md:left-8 z-10">
          <Link
            to="/"
            className="flex items-center gap-2 bg-black/70 hover:bg-black text-white px-4 py-2 rounded-lg transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Retour</span>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-32 md:-mt-48 relative z-10 pb-12 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="shrink-0">
            <img
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : "https://via.placeholder.com/500x750?text=No+Poster"
              }
              alt={movie.title}
              className="w-48 md:w-64 rounded-lg shadow-2xl mx-auto lg:mx-0"
            />
          </div>

          <div className="flex-1">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              {movie.title}
            </h1>

            {movie.tagline && (
              <p className="text-lg md:text-xl text-gray-400 italic mb-6">
                "{movie.tagline}"
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm md:text-base">
              <div className="flex items-center gap-2 text-yellow-400">
                <Star className="w-5 h-5 md:w-6 md:h-6 fill-current" />
                <span className="text-white font-semibold text-lg md:text-xl">
                  {movie.vote_average.toFixed(1)}
                </span>
                <span className="text-gray-400">
                  ({movie.vote_count} votes)
                </span>
              </div>

              {movie.release_date && (
                <div className="flex items-center gap-2 text-gray-300">
                  <Calendar className="w-4 h-4 md:w-5 md:h-5" />
                  <span>
                    {new Date(movie.release_date).toLocaleDateString("fr-FR", {
                      year: "numeric",
                    })}
                  </span>
                </div>
              )}

              {movie.runtime && (
                <div className="flex items-center gap-2 text-gray-300">
                  <Clock className="w-4 h-4 md:w-5 md:h-5" />
                  <span>
                    {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}min
                  </span>
                </div>
              )}
            </div>

            {movie.genres && movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="px-3 py-1 bg-[#2a2a2a] text-gray-300 rounded-full text-xs md:text-sm"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              {trailerKey ? (
                <button
                  onClick={() => setShowTrailer(true)}
                  className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
                >
                  <Play className="w-5 h-5 fill-current" />
                  Lecture
                </button>
              ) : (
                <button
                  disabled
                  className="flex items-center justify-center gap-2 bg-gray-700 text-gray-400 px-6 py-3 rounded-lg font-semibold cursor-not-allowed"
                >
                  <Play className="w-5 h-5" />
                  Bande-annonce indisponible
                </button>
              )}

              <button
                onClick={handleWishlistToggle}
                className="flex items-center justify-center gap-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white px-6 py-3 rounded-lg font-semibold transition-all"
              >
                <Heart
                  className={`w-5 h-5 ${
                    inWishlist ? "fill-current text-red-600" : ""
                  }`}
                />
                {inWishlist ? "Retirer de ma liste" : "Ajouter à ma liste"}
              </button>
            </div>

            <div className="mb-8">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-3">
                Synopsis
              </h2>
              <p className="text-sm md:text-base text-gray-300 leading-relaxed">
                {movie.overview || "Aucun synopsis disponible."}
              </p>
            </div>

            {cast.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-white mb-4">
                  Distribution
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {cast.map((actor) => (
                    <div key={actor.id} className="text-center">
                      <div className="aspect-square rounded-lg overflow-hidden bg-[#2a2a2a] mb-2">
                        <img
                          src={
                            actor.profile_path
                              ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                              : "https://via.placeholder.com/185x278?text=No+Photo"
                          }
                          alt={actor.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-xs md:text-sm text-white font-medium line-clamp-1">
                        {actor.name}
                      </p>
                      <p className="text-xs text-gray-400 line-clamp-1">
                        {actor.character}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 bg-[#2a2a2a] p-4 md:p-6 rounded-lg">
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
