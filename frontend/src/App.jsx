import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MagazinePage from "./pages/MagazinePage";
import NewsPage from "./pages/NewsPage";
import LoginPage from "./pages/LoginPage";
import ContactPage from "./pages/ContactPage";
import Register from "./pages/Register";
import NewsGrid from "./pages/NewsGrid";
import Header from "./components/Header";
import SpotifyPlaylist from "./components/SpotifyPlaylist";
import Footer from "./components/Footer";

function App() {
  return (
    <BrowserRouter>
      <Header title={"ADT"} />
      <Routes>
        <Route path="/" element={<MagazinePage />} />
        <Route path="/login/" element={<LoginPage />} />
        <Route path="/register/" element={<Register />} />
        <Route path="/contacto/" element={<ContactPage />} />
        <Route path="/Pruebados" element={<NewsGrid />} />
        <Route path="/noticias/:id" element={<NewsPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <div className="w-full mt-10">
        <SpotifyPlaylist />
      </div>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
