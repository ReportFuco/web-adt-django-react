import { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import LoadingSpinner from "./components/common/LoadingSpinner";

const Register = lazy(() => import("./pages/LoginPage/Register"));
const Login = lazy(() => import("./pages/LoginPage/Login"));
const MainPage = lazy(() => import("./pages/MainPage/MainPage"));
const NewsDetailPage = lazy(() => import("./pages/NewsPage/NewsDetailPage"));
const InterviewPage = lazy(() => import("./pages/InterviewPage/InterviewPage"));
const EventsPage = lazy(() => import("./pages/EventsPage/EventsPage"));
const NewsPage = lazy(() => import("./pages/NewsPage/NewsPage"));
const EventsDetailPage = lazy(() => import("./pages/EventsPage/EventsDetailPage"));
const InterviewDetailPage = lazy(() => import("./pages/InterviewPage/InterviewDetailPage"));
const ProductDetailPage = lazy(() => import("./pages/store/ProductDetailPage"));
const StorePage = lazy(() => import("./pages/store/StorePage"));
const CartPage = lazy(() => import("./pages/store/CartPage"));
const PagoExitoso = lazy(() => import("./pages/store/Pagos/PagoExitoso"));
const PagoFallido = lazy(() => import("./pages/store/Pagos/PagoFallido"));
const PagoPendiente = lazy(() => import("./pages/store/Pagos/PagoPendiente"));
const ForgotPassword = lazy(() => import("./pages/LoginPage/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/LoginPage/ResetPassword"));

function ThemeToggle() {
  const [theme, setTheme] = useState(() => localStorage.getItem("adt-theme") || "dark");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("adt-theme", theme);
  }, [theme]);

  return (
    <button
      onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
      className="fixed bottom-5 right-5 z-[70] theme-panel-strong px-4 py-3 text-[10px] md:text-xs uppercase tracking-[0.24em] font-bold shadow-sm hover:opacity-90 transition"
      aria-label="Cambiar tema"
      title="Cambiar tema"
    >
      {theme === "dark" ? "Modo blanco" : "Modo negro"}
    </button>
  );
}

function App() {
  useEffect(() => {
    const savedTheme = localStorage.getItem("adt-theme") || "dark";
    document.documentElement.dataset.theme = savedTheme;
  }, []);

  return (
    <BrowserRouter>
      <CartProvider>
        <AuthProvider>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/noticias" element={<NewsPage />} />
              <Route path="/noticias/:id/:slug" element={<NewsDetailPage />} />
              <Route path="/eventos" element={<EventsPage />} />
              <Route path="/eventos/:id/:slug" element={<EventsDetailPage />} />
              <Route path="/entrevistas" element={<InterviewPage />} />
              <Route path="/entrevistas/:slug" element={<InterviewDetailPage />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:uidb64/:token" element={<ResetPassword />} />
              <Route path="/tienda" element={<StorePage />} />
              <Route path="/tienda/productos/:slug" element={<ProductDetailPage />} />
              <Route path="/carrito" element={<CartPage />} />
              <Route path="/pago/exitoso" element={<PagoExitoso />} />
              <Route path="/pago/fallido" element={<PagoFallido />} />
              <Route path="/pago/pendiente" element={<PagoPendiente />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
            <ThemeToggle />
          </Suspense>
        </AuthProvider>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
