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
import InterviewDetailPage from "./pages/InterviewPage/InterviewDetailPage";
import ProductDetailPage from "./pages/store/ProductDetailPage";
import StorePage from "./pages/store/StorePage";
import { CartProvider } from "./context/CartContext";
import CartPage from "./pages/store/CartPage";
import PagoExitoso from "./pages/store/Pagos/PagoExitoso"
import PagoFallido from "./pages/store/Pagos/PagoFallido"
import PagoPendiente from "./pages/store/Pagos/PagoPendiente"

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<MainPage />} />
            {/* Noticias */}
            <Route path="/noticias" element={<NewsPage />} />
            <Route path="/noticias/:id/:slug" element={<NewsDetailPage />} />
            {/* Eventos */}
            <Route path="/eventos" element={<EventsPage />} />
            <Route path="/eventos/:id/:slug" element={<EventsDetailPage />} />
            {/* Entrevistas */}
            <Route path="/entrevistas" element={<InterviewPage />} />
            <Route
              path="/entrevistas/:slug"
              element={<InterviewDetailPage />}
            />
            {/* Login y Register */}
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            {/* Tienda */}
            <Route path="/tienda" element={<StorePage />} />
            <Route
              path="/tienda/productos/:slug"
              element={<ProductDetailPage />}
            />

            <Route path="/carrito" element={<CartPage />} />

            {/* Pagos */}
            <Route path="/pago/exitoso" element={<PagoExitoso />} />
            <Route path="/pago/fallido" element={<PagoFallido />} />
            <Route path="/pago/pendiente" element={<PagoPendiente />} />
            {/* Errores */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </AuthProvider>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
