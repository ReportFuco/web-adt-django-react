import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState, useCallback, memo } from "react";
import logo from "../../assets/logo-adt.png";
import logoWordmark from "../../assets/IMG_0467.png";
import RedesSociales from "../common/RedesSociales";
import Marquee from "react-fast-marquee";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { toast } from "react-toastify";
import CartButton from "../features/store/CartButton";
import { franjaMensaje } from "../../services/api";

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { cart, removeFromCart, updateQuantity } = useCart();
  const [franja, setFranja] = useState(null);

  const menuItems = [
    { label: "Eventos", path: "/eventos" },
    { label: "Noticias", path: "/noticias" },
    { label: "Entrevistas", path: "/entrevistas" },
    { label: "Tienda", path: "/tienda" },
  ];

  const UserAvatar = memo(({ user }) => (
    <div className="flex items-center justify-center w-8 h-8 border border-white/20 bg-white text-black font-bold">
      {user.username.charAt(0).toUpperCase()}
    </div>
  ));

  useEffect(() => {
    const loadFranja = async () => {
      try {
        const res = await franjaMensaje();
        if (res) setFranja(res);
      } catch (e) {
        console.error("Error al obtener la franja:", e);
        setFranja({
          contenido:
            "Adictos al Techno / Cultura underground / Noticias / Eventos",
        });
      }
    };

    loadFranja();
  }, []);

  const MarqueeText = memo(() => (
    <Marquee
      speed={45}
      className="py-2 text-white/70 uppercase tracking-[0.22em] text-[10px] font-bold"
    >
      {franja?.url ? (
        <a
          href={franja.url}
          target="_blank"
          rel="noopener noreferrer"
          className="no-underline px-6 hover:text-white transition-colors"
        >
          {franja?.contenido || "Cargando..."}
        </a>
      ) : (
        <span className="px-6">{franja?.contenido || "Cargando..."}</span>
      )}
    </Marquee>
  ));

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
    [navigate],
  );

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
    toast.success("Producto eliminado del carrito");
  };

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 md:h-24 flex items-center justify-between gap-6">
          <div className="flex items-center gap-8 md:gap-10 shrink-0">
            <button
              className="flex items-center gap-4 shrink-0"
              onClick={() => navigate("/")}
              aria-label="Ir al inicio"
            >
              <img
                src={logo}
                alt="ADT"
                className="h-10 md:h-11 w-auto object-contain brightness-0 invert shrink-0"
                loading="eager"
              />

              <div className="hidden md:flex items-center border-l border-white/15 pl-5 ml-1 min-w-[260px] lg:min-w-[340px]">
                <img
                  src={logoWordmark}
                  alt="Adictos al Techno"
                  className="w-[220px] lg:w-[300px] h-auto object-contain opacity-95 brightness-[1.9] contrast-[1.2]"
                  loading="eager"
                />
              </div>
            </button>

            <nav className="hidden md:flex items-center gap-5 lg:gap-6 uppercase text-[11px] font-bold tracking-[0.18em] text-white/75">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="hover:text-white transition-colors whitespace-nowrap"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="hidden md:flex items-center gap-5 text-white shrink-0">
            {user ? (
              <div className="flex items-center gap-3">
                <UserAvatar user={user} />
                <span className="text-[11px] uppercase tracking-[0.18em] text-white/70">
                  {user.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-[10px] uppercase tracking-[0.22em] border border-white/20 px-4 py-2 hover:bg-white hover:text-black transition-all"
                >
                  Salir
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-white text-black px-4 py-2 text-[10px] font-bold uppercase tracking-[0.22em] hover:bg-white/90 transition-all"
              >
                Login
              </Link>
            )}
            <CartButton
              cart={cart}
              updateQuantity={updateQuantity}
              handleRemoveItem={handleRemoveItem}
            />
          </div>

          <div className="flex items-center md:hidden space-x-3 text-white">
            <CartButton
              cart={cart}
              updateQuantity={updateQuantity}
              handleRemoveItem={handleRemoveItem}
            />
            <button
              className="focus:outline-none"
              onClick={toggleMenu}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              <svg
                className={`w-6 h-6 transition-transform duration-300 ${isMenuOpen ? "rotate-90" : "rotate-0"}`}
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

        <div className="border-t border-white/10 bg-black/95">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-4 md:px-6">
            <div className="flex-1 overflow-hidden">
              <MarqueeText />
            </div>
            <div className="hidden sm:flex items-center gap-3 border-l border-white/10 pl-4 py-2">
              <RedesSociales classNameDiseño="" dark />
            </div>
          </div>
        </div>

        <div
          className={`md:hidden w-full bg-black transition-all duration-300 ease-in-out overflow-hidden ${
            isMenuOpen
              ? "max-h-screen opacity-100 border-t border-white/10"
              : "max-h-0 opacity-0"
          }`}
        >
          <ul className="flex flex-col py-3 uppercase tracking-[0.18em] text-[11px] text-white/80 font-bold">
            {menuItems.map((item) => (
              <li key={item.path}>
                <button
                  onClick={() => navigateAndClose(item.path)}
                  className="w-full text-left py-3 px-5 hover:bg-white hover:text-black transition-colors"
                >
                  {item.label}
                </button>
              </li>
            ))}

            <li className="border-t border-white/10 mt-2">
              {user ? (
                <div className="flex flex-col px-5 py-4 gap-3">
                  <div className="flex items-center gap-3">
                    <UserAvatar user={user} />
                    <span className="text-white">{user.username}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full py-2 text-black bg-white hover:bg-white/90 transition-colors"
                  >
                    Cerrar sesión
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => navigateAndClose("/login")}
                  className="w-full text-left py-3 px-5 hover:bg-white hover:text-black transition-colors"
                >
                  Login
                </button>
              )}
            </li>
          </ul>
        </div>
      </header>
      <div className="mt-28 md:mt-32"></div>
    </>
  );
};

export default memo(Header);
