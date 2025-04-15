import { useNavigate, Link } from "react-router-dom";
import React, { useState, useCallback, memo, useEffect } from "react";
import logo from "../../assets/ADT logo.jpg";
import RedesSociales from "../common/RedesSociales";
import Marquee from "react-fast-marquee";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { toast } from "react-toastify";
import CartButton from "../features/store/CartButton";

const menuItems = [
  { label: "Noticias", path: "/noticias" },
  { label: "Lanzamientos", path: "/lanzamientos" },
  { label: "Entrevistas", path: "/entrevistas" },
  { label: "Eventos", path: "/eventos" },
];

const MarqueeText = memo(() => (
  <Marquee speed={75} className="py-1.5 text-white">
    🔥 Ultimas novedades: Nuevo evento de musica techno en santiago •••
    Descuento del 20% en productos seleccionados ••• 🎶 Nueva playlist
    disponible ••• Noticias en el mundo del techno •••
  </Marquee>
));

const UserAvatar = memo(({ user }) => (
  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-900 text-white font-bold group-hover:bg-purple-700 transition-colors">
    {user.username.charAt(0).toUpperCase()}
  </div>
));

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { cart, removeFromCart, updateQuantity } = useCart();

  const handleLogout = useCallback(async () => {
    await logout();
    navigate("/");
    setIsMenuOpen(false);
  }, [logout, navigate]);

  const toggleMenu = useCallback(() => setIsMenuOpen((prev) => !prev), []);

  const navigateAndClose = useCallback(
    (path) => {
      navigate(path);
      setIsMenuOpen(false);
    },
    [navigate]
  );

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
    toast.success("Producto eliminado del carrito");
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-black text-white p-2 z-50 h-16 shadow-lg">
        <div className="container mx-auto flex justify-between items-center h-full px-4">
          <div className="flex items-center">
            <img
              src={logo}
              alt="Logo"
              className="h-12 cursor-pointer transition-transform hover:scale-105"
              onClick={() => navigate("/")}
              loading="lazy"
            />
          </div>

          {/* Menú desktop */}
          <nav className="hidden md:flex space-x-4">
            <ul className="flex space-x-4 items-center">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="px-3 py-1.5 rounded-md font-medium text-white hover:text-purple-400 hover:bg-gray-900 transition-all duration-200 active:scale-95"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}

              {user ? (
                <li className="relative group">
                  <div className="flex items-center gap-2 pl-4">
                    <UserAvatar user={user} />
                    <span className="font-medium text-gray-200 group-hover:text-purple-300 transition-colors">
                      {user.username}
                    </span>
                    <button
                      onClick={handleLogout}
                      className="ml-2 px-3 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-purple-900 rounded-md transition-all duration-200 active:scale-95"
                    >
                      Salir
                    </button>
                  </div>
                </li>
              ) : (
                <li>
                  <Link
                    to="/login"
                    className="px-3 py-1.5 rounded-md font-medium text-white hover:text-purple-400 hover:bg-gray-900 transition-all duration-200 active:scale-95"
                  >
                    Iniciar sesión
                  </Link>
                </li>
              )}
            </ul>
            <CartButton
              cart={cart}
              updateQuantity={updateQuantity}
              handleRemoveItem={handleRemoveItem}
            />
          </nav>

          {/* Botón del menú móvil */}
          <div className="flex items-center md:hidden space-x-4">
            {/* Botón del carrito para móvil (sin versión móvil especial) */}
            <CartButton
              cart={cart}
              updateQuantity={updateQuantity}
              handleRemoveItem={handleRemoveItem}
            />

            {/* Botón del menú móvil */}
            <button
              className="text-white focus:outline-none hover:text-purple-400 transition-colors"
              onClick={toggleMenu}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              <svg
                className={`w-6 h-6 transition-transform duration-300 ${
                  isMenuOpen ? "rotate-90" : "rotate-0"
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Menú móvil desplegable (sin el carrito dentro) */}
        <div
          className={`md:hidden absolute top-full left-0 w-full bg-black transition-all duration-300 ease-in-out overflow-hidden ${
            isMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          }`}
          style={{ zIndex: 49 }}
        >
          <ul className="flex flex-col py-3 border-t border-gray-700">
            {menuItems.map((item) => (
              <li key={item.path}>
                <button
                  onClick={() => navigateAndClose(item.path)}
                  className="w-full text-left py-3 px-4 text-white hover:bg-gray-800 hover:text-purple-400 transition-colors"
                >
                  {item.label}
                </button>
              </li>
            ))}

            <li className="border-t border-gray-700">
              {user ? (
                <div className="flex flex-col px-4 py-3">
                  <div className="flex items-center gap-3 mb-3">
                    <UserAvatar user={user} />
                    <span className="font-medium text-white">
                      {user.username}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full py-2 text-white bg-neutral-900 hover:bg-neutral-800 rounded-md transition-colors"
                  >
                    Cerrar sesión
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => navigateAndClose("/login")}
                  className="w-full text-left py-3 px-4 text-white hover:bg-gray-800 hover:text-purple-400 transition-colors"
                >
                  Iniciar sesión
                </button>
              )}
            </li>
          </ul>
        </div>
      </header>

      {/* Barra de noticias */}
      <div className="fixed top-16 left-0 w-full bg-gray-900 text-white text-sm flex justify-between items-center z-40 shadow-md">
        <div className="flex-1 overflow-hidden bg-neutral-900">
          <MarqueeText />
        </div>
        <div className="hidden sm:flex space-x-3 items-center bg-black px-4 py-1.5 h-full">
          <RedesSociales />
        </div>
      </div>

      <div className="mt-28"></div>
    </>
  );
};

export default memo(Header);
