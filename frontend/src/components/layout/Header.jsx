import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState, useCallback, memo } from "react";
import logoHeader from "../../assets/logo-final-header-cropped.png";
import RedesSociales from "../common/RedesSociales";
import Marquee from "react-fast-marquee";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { toast } from "react-toastify";
import CartButton from "../features/store/CartButton";
import { franjaMensaje, trackFranjaClick } from "../../services/api";

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
          contenido: "Adictos al Techno / Cultura underground / Noticias / Eventos",
        });
      }
    };

    loadFranja();
  }, []);

  const handleFranjaClick = useCallback(async (event) => {
    if (!franja?.url) return;
    event.preventDefault();
    try {
      if (franja?.id) await trackFranjaClick(franja.id);
    } catch (e) {
      console.error("Error al trackear la franja:", e);
    } finally {
      window.open(franja.url, "_blank", "noopener,noreferrer");
    }
  }, [franja]);

  const MarqueeText = memo(() => (
    <Marquee
      speed={45}
      className="py-2 text-white/70 uppercase tracking-[0.22em] text-[10px] font-bold"
    >
      {franja?.url ? (
        <a
          href={franja.url}
          onClick={handleFranjaClick}
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
      <header className="fixed top-0 w-full z-50 bg-black/92 backdrop-blur-md border-b border-white/8">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-5 lg:px-6 h-[82px] sm:h-[88px] md:h-[94px] flex items-center justify-between gap-2 md:gap-3">
          <div className="flex items-center gap-2 md:gap-4 min-w-0 flex-1 overflow-hidden">
            <button
              className="flex items-center min-w-0 flex-1 max-w-[86vw] sm:max-w-[82vw] md:max-w-[72vw] lg:max-w-none"
              onClick={() => navigate("/")}
              aria-label="Ir al inicio"
            >
              <img
                src={logoHeader}
                alt="Adictos al Techno"
                className="block h-3 sm:h-4 md:h-4 lg:h-5 xl:h-5 w-auto max-w-full object-contain opacity-95"
                loading="eager"
              />
            </button>

            <nav className="hidden lg:flex items-center gap-5 xl:gap-6 uppercase text-[11px] xl:text-[12px] font-bold tracking-[0.14em] text-white/82">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="hover:text-white transition-colors duration-300 whitespace-nowrap"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="hidden lg:flex items-center gap-4 lg:gap-5 text-white shrink-0">
            {user ? (
              <div className="flex items-center gap-3">
                <UserAvatar user={user} />
                <span className="text-[10px] uppercase tracking-[0.16em] text-white/70">
                  {user.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-[10px] uppercase tracking-[0.18em] border border-white/15 px-4 py-2 hover:bg-white hover:text-black transition-all duration-300"
                >
                  Salir
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-white text-black px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] hover:bg-white/90 transition-all duration-300"
              >
                Login
              </Link>
            )}
            <div className="pl-3 border-l border-white/10">
              <CartButton
                cart={cart}
                updateQuantity={updateQuantity}
                handleRemoveItem={handleRemoveItem}
              />
            </div>
          </div>

          <div className="flex items-center lg:hidden space-x-2 text-white shrink-0">
            <CartButton
              cart={cart}
              updateQuantity={updateQuantity}
              handleRemoveItem={handleRemoveItem}
            />
            <button
              className="focus:outline-none scale-110"
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
          className={`lg:hidden w-full bg-black transition-all duration-300 ease-in-out overflow-hidden ${
            isMenuOpen
              ? "max-h-screen opacity-100 border-t border-white/10"
              : "max-h-0 opacity-0"
          }`}
        >
          <ul className="flex flex-col py-3 uppercase tracking-[0.16em] text-[12px] text-white/85 font-bold">
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
      <div className="mt-[108px] sm:mt-[116px] md:mt-[124px] lg:mt-[136px]"></div>
    </>
  );
};

export default memo(Header);
