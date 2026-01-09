import { Route, Routes } from "react-router";

import { WishlistPage } from "./pages/WishlistPage";
import { Navbar } from "./components/Navbar";
import { MoviesPage } from "./pages/MovieListPage";
import { MovieDetailPage } from "./pages/MovieDetailPage";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<MoviesPage />} />
        <Route path="/movie/:id" element={<MovieDetailPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
      </Routes>
    </div>
  );
}

export default App;
