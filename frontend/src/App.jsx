import { Suspense, useEffect, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { AuthProvider } from "./context/AuthContext";
import RouteProgressOverlay from "./components/common/RouteProgressOverlay";
import AppShell from "./components/layout/AppShell";
import { lazyWithProgress } from "./utils/lazyWithProgress";

const ReactQueryDevtools = import.meta.env.DEV
  ? lazy(() =>
      import("@tanstack/react-query-devtools").then((mod) => ({
        default: mod.ReactQueryDevtools,
      })),
    )
  : null;

const Register = lazyWithProgress(() => import("./pages/LoginPage/Register"));
const Login = lazyWithProgress(() => import("./pages/LoginPage/Login"));
const MainPage = lazyWithProgress(() => import("./pages/MainPage/MainPage"));
const NewsDetailPage = lazyWithProgress(() => import("./pages/NewsPage/NewsDetailPage"));
const InterviewPage = lazyWithProgress(() => import("./pages/InterviewPage/InterviewPage"));
const EventsPage = lazyWithProgress(() => import("./pages/EventsPage/EventsPage"));
const NewsPage = lazyWithProgress(() => import("./pages/NewsPage/NewsPage"));
const EventsDetailPage = lazyWithProgress(() => import("./pages/EventsPage/EventsDetailPage"));
const InterviewDetailPage = lazyWithProgress(() => import("./pages/InterviewPage/InterviewDetailPage"));
const ForgotPassword = lazyWithProgress(() => import("./pages/LoginPage/ForgotPassword"));
const ResetPassword = lazyWithProgress(() => import("./pages/LoginPage/ResetPassword"));
const CulturaPage = lazyWithProgress(() => import("./pages/CulturaPage/CulturaPage"));
const SearchResultsPage = lazyWithProgress(() => import("./pages/SearchPage/SearchResultsPage"));
const PoliticaEditorialPage = lazyWithProgress(() => import("./pages/LegalPage/PoliticaEditorialPage"));
const CreditosFotograficosPage = lazyWithProgress(() => import("./pages/LegalPage/CreditosFotograficosPage"));
const PoliticaDePrivacidadPage = lazyWithProgress(() => import("./pages/LegalPage/PoliticaDePrivacidadPage"));
// Harness de componentes de Fase 2 (docs/rediseño/PLAN.md) — solo dev, nunca en producción.
const ComponentKit = import.meta.env.DEV ? lazyWithProgress(() => import("./dev/ComponentKit")) : null;

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
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouteProgressOverlay />
          <Suspense fallback={null}>
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
                <Route path="/politica-de-privacidad" element={<PoliticaDePrivacidadPage />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:uidb64/:token" element={<ResetPassword />} />
                {import.meta.env.DEV && <Route path="/__kit" element={<ComponentKit />} />}
              </Route>
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Suspense>
          {ReactQueryDevtools && (
            <Suspense fallback={null}>
              <ReactQueryDevtools initialIsOpen={false} />
            </Suspense>
          )}
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
