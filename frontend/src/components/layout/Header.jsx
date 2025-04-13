import { useNavigate, Link } from "react-router-dom";
import React, { useState, useCallback, memo, useEffect, useRef } from "react";
import logo from "../../assets/ADT logo.jpg";
import RedesSociales from "../common/RedesSociales";
import Marquee from "react-fast-marquee";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext"; // Asegúrate de importar tu CartContext
import { toast } from "react-toastify";

const menuItems = [
  { label: "Noticias", path: "/noticias" },
  { label: "Lanzamientos", path: "/lanzamientos" },
  { label: "Entrevistas", path: "/entrevistas" },
  { label: "Eventos", path: "/eventos" },
  { label: "Tienda", path: "/tienda" },
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
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { user, logout } = useAuth();
  const { cart, removeFromCart, updateQuantity, totalItems } = useCart();
  const cartRef = useRef(null);

  const calculateTotal = () => {
    return cart.reduce((sum, item) => {
      return sum + (item.precio || 0) * item.quantity;
    }, 0);
  };

  // Cerrar carrito al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setIsCartOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = useCallback(async () => {
    await logout();
    navigate("/");
    setIsMenuOpen(false);
  }, [logout, navigate]);

  const toggleMenu = useCallback(() => setIsMenuOpen((prev) => !prev), []);
  const toggleCart = useCallback(() => setIsCartOpen((prev) => !prev), []);

  const navigateAndClose = useCallback(
    (path) => {
      navigate(path);
      setIsMenuOpen(false);
      setIsCartOpen(false);
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

          <div className="flex items-center space-x-4">
            {/* Botón del carrito */}
            <div className="relative" ref={cartRef}>
              <button
                onClick={toggleCart}
                aria-label={`Carrito (${totalItems} items)`}
                aria-expanded={isCartOpen}
                className="p-2 relative group hover:text-purple-400 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>

                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Dropdown del carrito */}
              {isCartOpen && (
                <div
                  className={`
                  absolute right-0 mt-2 w-80 bg-gray-800 rounded-lg shadow-xl z-50 border border-gray-700
                  ${
                    window.innerWidth < 640
                      ? "fixed bottom-0 left-0 w-full max-h-[70vh] rounded-b-none overflow-y-auto"
                      : "max-h-[80vh] overflow-y-auto"
                  }
                `}
                >
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-white">
                        Tu Carrito ({totalItems})
                      </h3>
                      <button
                        onClick={toggleCart}
                        className="text-gray-400 hover:text-white"
                        aria-label="Cerrar carrito"
                      >
                        ✕
                      </button>
                    </div>

                    {cart.length === 0 ? (
                      <div className="py-8 text-center">
                        <p className="text-gray-400">Tu carrito está vacío</p>
                        <button
                          onClick={() => navigateAndClose("/tienda")}
                          className="mt-4 inline-block text-purple-400 hover:underline"
                        >
                          Ir a la tienda
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="divide-y divide-gray-700">
                          {cart.map((item) => (
                            <div key={`${item.id}`} className="py-4 flex">
                              <div className="flex-shrink-0 w-16 h-16">
                                <img
                                  src={
                                    item.imagen || "/placeholder-product.jpg"
                                  }
                                  alt={item.nombre}
                                  className="w-full h-full object-cover rounded"
                                />
                              </div>

                              <div className="ml-3 flex-1">
                                <h4 className="font-medium text-white">
                                  {item.nombre}
                                </h4>
                                <p className="text-sm text-gray-400">
                                  ${item.precio.toLocaleString("es-CL")} c/u
                                </p>

                                <div className="mt-1 flex items-center">
                                  <button
                                    onClick={() =>
                                      updateQuantity(item.id, item.quantity - 1)
                                    }
                                    disabled={item.quantity <= 1}
                                    className="w-6 h-6 flex items-center justify-center border border-gray-600 rounded text-gray-300 disabled:opacity-30 hover:bg-gray-700"
                                    aria-label="Reducir cantidad"
                                  >
                                    −
                                  </button>
                                  <span className="mx-2 text-sm text-white">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() =>
                                      updateQuantity(item.id, item.quantity + 1)
                                    }
                                    className="w-6 h-6 flex items-center justify-center border border-gray-600 rounded text-gray-300 hover:bg-gray-700"
                                    aria-label="Aumentar cantidad"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>

                              <div className="ml-2 flex flex-col items-end">
                                <span>
                                  $
                                  {(item.precio
                                    ? item.precio * item.quantity
                                    : 0
                                  ).toLocaleString("es-CL")}
                                </span>
                                <button
                                  onClick={() => handleRemoveItem(item.id)}
                                  className="mt-1 text-gray-400 hover:text-red-400"
                                  aria-label="Eliminar producto"
                                >
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="border-t border-gray-700 pt-4 mt-4">
                          <div className="flex justify-between font-semibold text-lg mb-4 text-white">
                            <span>Total:</span>
                            <span>
                              ${calculateTotal().toLocaleString("es-CL")}
                            </span>
                          </div>

                          <button
                            onClick={() => navigateAndClose("/carrito")}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md transition-colors"
                          >
                            Ver carrito completo
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Botón del menú móvil (mantén el que ya tienes) */}
            <button
              className="md:hidden text-white focus:outline-none hover:text-purple-400 transition-colors"
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

          {/* Menú desktop (mantén el que ya tienes) */}
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
          </nav>
        </div>

        {/* Menú móvil (mantén el que ya tienes) */}
        <div
          className={`absolute top-16 left-0 w-full bg-black md:hidden overflow-hidden transition-all duration-300 border-t border-gray-700 ${
            isMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
          aria-hidden={!isMenuOpen}
        >
          <ul className="flex flex-col py-3">
            {menuItems.map((item) => (
              <li key={item.path}>
                <button
                  onClick={() => navigateAndClose(item.path)}
                  className="w-full text-left py-2.5 px-4 text-white hover:bg-gray-800 hover:text-purple-400 transition-all duration-200"
                >
                  {item.label}
                </button>
              </li>
            ))}
            <li className="border-t border-gray-700 mt-1 pt-1">
              {user ? (
                <div className="flex flex-col px-4 py-2">
                  <div className="flex items-center gap-3 mb-3">
                    <UserAvatar user={user} />
                    <span className="font-medium text-white">
                      {user.username}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full py-2 text-white bg-neutral-900 hover:bg-neutral-800 rounded-md transition-all duration-200 active:scale-95"
                  >
                    Cerrar sesión
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => navigateAndClose("/login")}
                  className="w-full text-left py-2.5 px-4 text-white hover:bg-gray-800 hover:text-purple-400 transition-colors duration-200"
                >
                  Iniciar sesión
                </button>
              )}
            </li>
          </ul>
        </div>
      </header>

      {/* Barra de noticias (mantén el que ya tienes) */}
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
