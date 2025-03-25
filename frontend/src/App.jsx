import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MagazinePage from "./pages/MagazinePage";
import NewsPage from "./pages/NewsPage";
import { AuthProvider } from "./context/AuthContext";
import Interview from "./components/Interview";
import Login from "./pages/log/Login";
import Register from "./pages/log/register";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<MagazinePage />} />
          <Route path="/noticias/:id" element={<NewsPage />} />
          <Route path="/eventos" element={<Interview />} />
          <Route path="*" element={<Navigate to="/" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
