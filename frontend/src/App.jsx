import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LoadingSpinner from "./components/common/LoadingSpinner";
import AppShell from "./components/layout/AppShell";

const Register = lazy(() => import("./pages/LoginPage/Register"));
const Login = lazy(() => import("./pages/LoginPage/Login"));
const MainPage = lazy(() => import("./pages/MainPage/MainPage"));
const NewsDetailPage = lazy(() => import("./pages/NewsPage/NewsDetailPage"));
const InterviewPage = lazy(() => import("./pages/InterviewPage/InterviewPage"));
const EventsPage = lazy(() => import("./pages/EventsPage/EventsPage"));
const NewsPage = lazy(() => import("./pages/NewsPage/NewsPage"));
const EventsDetailPage = lazy(() => import("./pages/EventsPage/EventsDetailPage"));
const InterviewDetailPage = lazy(() => import("./pages/InterviewPage/InterviewDetailPage"));
const ForgotPassword = lazy(() => import("./pages/LoginPage/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/LoginPage/ResetPassword"));
const CulturaPage = lazy(() => import("./pages/CulturaPage/CulturaPage"));
const SearchResultsPage = lazy(() => import("./pages/SearchPage/SearchResultsPage"));
const PoliticaEditorialPage = lazy(() => import("./pages/LegalPage/PoliticaEditorialPage"));
const CreditosFotograficosPage = lazy(() => import("./pages/LegalPage/CreditosFotograficosPage"));
// Harness de componentes de Fase 2 (docs/rediseño/PLAN.md) — solo dev, nunca en producción.
const ComponentKit = import.meta.env.DEV ? lazy(() => import("./dev/ComponentKit")) : null;

function App() {
  // Fase 3 (docs/rediseño/PLAN.md): el theme-toggle vive en el Header;
  // esto solo aplica el tema guardado antes del primer render para evitar
  // un flash del tema incorrecto.
  useEffect(() => {
    const savedTheme = localStorage.getItem("adt-theme") || "dark";
    document.documentElement.dataset.theme = savedTheme;
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route element={<AppShell />}>
              <Route path="/" element={<MainPage />} />
              <Route path="/noticias" element={<NewsPage />} />
              <Route path="/noticias/:id/:slug" element={<NewsDetailPage />} />
              <Route path="/eventos" element={<EventsPage />} />
              <Route path="/eventos/:id/:slug" element={<EventsDetailPage />} />
              <Route path="/entrevistas" element={<InterviewPage />} />
              <Route path="/entrevistas/:slug" element={<InterviewDetailPage />} />
              <Route path="/cultura" element={<CulturaPage />} />
              <Route path="/buscar" element={<SearchResultsPage />} />
              <Route path="/politica-editorial" element={<PoliticaEditorialPage />} />
              <Route path="/creditos-fotograficos" element={<CreditosFotograficosPage />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:uidb64/:token" element={<ResetPassword />} />
              {import.meta.env.DEV && <Route path="/__kit" element={<ComponentKit />} />}
            </Route>
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
