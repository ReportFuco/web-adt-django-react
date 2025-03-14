import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MagazinePage from "./pages/MagazinePage";
import NewsPage from "./pages/NewsPage";
import LoginPage from "./pages/LoginPage";
import Register from "./pages/Register";
import NewsGrid from "./pages/NewsGrid";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { AuthProvider } from "./context/AuthContext";
import Interview from "./components/Interview";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Header />
        <Routes>
          <Route path="/" element={<MagazinePage />} />
          <Route path="/login/" element={<LoginPage />} />
          <Route path="/register/" element={<Register />} />
          <Route path="/Pruebados" element={<NewsGrid />} />
          <Route path="/noticias/:id" element={<NewsPage />} />
          <Route path="*" element={<Navigate to="/" />} />
          <Route path="/eventos" element={<Interview />} />
        </Routes>
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
