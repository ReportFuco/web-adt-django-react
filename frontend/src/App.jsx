import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MagazinePage from "./pages/MagazinePage";
import NewsPage from "./pages/NewsPage";
import { AuthProvider } from "./context/AuthContext";
import Interview from "./components/Interview";
import Login from "./pages/log/Login";
import Register from "./pages/log/register";
import EventsPage from "./pages/EventsPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<MagazinePage />} />
          <Route path="/noticias/:id" element={<NewsPage />} />
          <Route path="/eventos" element={<EventsPage />} />
          <Route path="/entrevistas" element={<Interview />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
