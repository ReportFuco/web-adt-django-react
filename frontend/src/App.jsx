import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Register from "./pages/LoginPage/Register";
import Login from "./pages/LoginPage/Login";
import MainPage from "./pages/MainPage/MainPage";
import NewsDetailPage from "./pages/NewsPage/NewsDetailPage";
import InterviewPage from "./pages/InterviewPage/InterviewPage";
import EventsPage from "./pages/EventsPage/EventsPage";
import NewsPage from "./pages/NewsPage/NewsPage";
import EventsDetailPage from "./pages/EventsPage/EventsDetailPage";
import InterviewDetailPage from "./pages/InterviewPage/InterviewDetailPage"

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<MainPage />} />
          {/* Noticias */}
          <Route path="/noticias" element={<NewsPage />} />
          <Route path="/noticias/:id" element={<NewsDetailPage />} />
          {/* Eventos */}
          <Route path="/eventos" element={<EventsPage />} />
          <Route path="/eventos/:id" element={<EventsDetailPage />} />
          {/* Entrevistas */}
          <Route path="/entrevistas" element={<InterviewPage />} />
          <Route path="/entrevistas/:id" element={<InterviewDetailPage />} />
          {/* Login y Register */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          {/* Errores */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
