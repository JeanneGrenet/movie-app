import { Route, Routes } from "react-router";
import { MoviesPage } from "./pages/Movies";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<MoviesPage />} />
      </Routes>
    </>
  );
}

export default App;
