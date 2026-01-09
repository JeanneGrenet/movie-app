import { useEffect, useState } from "react";

export const MovieList = () => {
  const [movieList, setMovieList] = useState([]);
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
    <div>
      <h2>Films Populaires : </h2>
      {isLoading && <p>Chargement en cours</p>}
      {movieList.map((movie) => (
        <p key={movie.id}>{movie.title}</p>
      ))}
    </div>
  );
};
