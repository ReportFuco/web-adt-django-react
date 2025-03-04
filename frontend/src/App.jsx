import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MagazinePage from "./pages/MagazinePage";
import NewsPage from "./pages/NewsPage";
import LoginPage from "./pages/LoginPage";
import ContactPage from "./pages/ContactPage";
import Register from "./pages/Register";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MagazinePage />} />
        <Route path="/eventos/" element={<NewsPage />} />
        <Route path="/login/" element={<LoginPage />} />
        <Route path="/register/" element={<Register/>} />
        <Route path="/contacto/" element={<ContactPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
