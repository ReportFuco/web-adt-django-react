import { useCallback, useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Menu, Moon, Search, Sun, User, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "../../context/AuthContext";
import { franjaMensaje, getNoticias, trackFranjaClick } from "../../services/api";
import LinkGlyph from "../ui/LinkGlyph";
import Ticker from "../ui/Ticker";
import { SOCIAL_LINKS } from "../ui/SocialIcons";

const NAV_ITEMS = [
  { label: "Noticias", to: "/noticias" },
  { label: "Eventos", to: "/eventos" },
  { label: "Entrevistas", to: "/entrevistas" },
  { label: "Cultura", to: "/cultura" },
];

function useTheme() {
  const [theme, setTheme] = useState(() => localStorage.getItem("adt-theme") || "dark");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("adt-theme", theme);
  }, [theme]);

  return [theme, () => setTheme((prev) => (prev === "dark" ? "light" : "dark"))];
}

function useTickerItems() {
  const [items, setItems] = useState([]);
  const [franja, setFranja] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const [franjaRes, noticiasRes] = await Promise.all([
        franjaMensaje().catch(() => null),
        getNoticias(),
      ]);
      if (cancelled) return;

      setFranja(franjaRes || null);
      const headlineItems = (noticiasRes.results || []).slice(0, 4).map((noticia) => ({
        id: `noticia-${noticia.id}`,
        label: noticia.titulo,
        href: `/noticias/${noticia.id}/${noticia.slug}`,
      }));

      const franjaItem = franjaRes?.contenido
        ? [{ id: `franja-${franjaRes.id}`, label: franjaRes.contenido, href: franjaRes.url || undefined, franjaId: franjaRes.id }]
        : [];

      setItems([...franjaItem, ...headlineItems]);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleItemClick = useCallback(
    (item) => {
      if (item.franjaId) trackFranjaClick(item.franjaId);
    },
    []
  );

  return { items, handleItemClick, franja };
}

function useMobileNav() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);
  const toggleRef = useRef(null);
  const location = useLocation();

  const close = useCallback(() => {
    setOpen(false);
    toggleRef.current?.focus();
  }, []);

  // Cierra al navegar (DESIGN §9.4).
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Cierra al cruzar el breakpoint de escritorio y con Escape; bloquea scroll
  // y gestiona el foco mientras el panel está abierto.
  useEffect(() => {
    if (!open) return undefined;

    const mql = window.matchMedia("(min-width: 860px)");
    const handleResize = (event) => {
      if (event.matches) setOpen(false);
    };
    mql.addEventListener("change", handleResize);

    const handleKeydown = (event) => {
      if (event.key === "Escape") {
        close();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll(
        'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleKeydown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector("a, button")?.focus();

    return () => {
      mql.removeEventListener("change", handleResize);
      document.removeEventListener("keydown", handleKeydown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, close]);

  return { open, setOpen, close, panelRef, toggleRef };
}

function HeaderSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!query.trim()) return;
    navigate(`/buscar?q=${encodeURIComponent(query.trim())}`);
    setOpen(false);
    setQuery("");
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Buscar en el sitio"
        className="flex h-11 w-11 items-center justify-center rounded-adt text-text transition-colors hover:border-line hover:bg-surface"
      >
        <Search className="h-[19px] w-[19px]" strokeWidth={2} />
      </button>
    );
  }

  return (
    <form role="search" onSubmit={handleSubmit} className="flex items-center gap-1">
      <label htmlFor="header-search-input" className="sr-only">
        Buscar noticias, eventos y entrevistas
      </label>
      <input
        id="header-search-input"
        ref={inputRef}
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Buscar…"
        className="h-11 w-32 rounded-adt border border-control-line bg-surface px-3 text-sm text-text focus:border-signal focus:outline-none sm:w-44"
      />
      <button
        type="button"
        onClick={() => setOpen(false)}
        aria-label="Cerrar búsqueda"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-adt text-text-muted hover:text-text"
      >
        <X className="h-[18px] w-[18px]" strokeWidth={2} />
      </button>
    </form>
  );
}

function AccountControl() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  if (!user) {
    return (
      <Link
        to="/login"
        className="flex h-11 items-center gap-2 rounded-adt px-3 text-xs font-bold uppercase tracking-[0.08em] text-text hover:bg-surface"
      >
        <User className="h-[18px] w-[18px]" strokeWidth={2} />
        <span className="hidden sm:inline">Login</span>
      </Link>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Cuenta de ${user.username}`}
        className="flex h-11 w-11 items-center justify-center rounded-adt text-text hover:bg-surface"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-adt bg-text text-xs font-bold text-bg">
          {user.username?.charAt(0).toUpperCase()}
        </span>
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 min-w-[160px] rounded-adt border border-line bg-surface py-2 shadow-lg"
        >
          <p className="truncate px-4 py-1 text-xs uppercase tracking-[0.06em] text-text-muted">{user.username}</p>
          <button
            type="button"
            role="menuitem"
            onClick={async () => {
              await logout();
              setOpen(false);
              navigate("/");
            }}
            className="w-full px-4 py-2 text-left text-sm font-semibold uppercase tracking-[0.04em] hover:bg-surface-raised hover:text-signal"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}

function Header() {
  const [theme, toggleTheme] = useTheme();
  const { items: tickerItems, handleItemClick } = useTickerItems();
  const mobileNav = useMobileNav();

  const navLinkClass = useCallback(
    ({ isActive }) =>
      cn(
        "relative py-2 text-sm font-semibold uppercase tracking-[0.06em] after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:bg-signal after:transition-transform after:duration-[var(--adt-dur-fast)] after:content-['']",
        isActive ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100"
      ),
    []
  );

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg">
      <div className="wrap flex items-center justify-between gap-6 py-4">
        <div className="flex min-w-0 items-center gap-12">
          <Link
            to="/"
            aria-label="Adictos al Techno — inicio"
            className="flex shrink-0 items-center gap-2.5 font-display text-[clamp(1.05rem,4.4vw,1.35rem)] font-extrabold tracking-[0.02em]"
          >
            <LinkGlyph size={26} className="shrink-0 text-signal" />
            <span className="hidden min-[421px]:inline">ADICTOS AL TECHNO</span>
            <span className="min-[421px]:hidden" aria-hidden="true">ADT</span>
          </Link>

          <nav aria-label="Navegación principal" className="hidden items-center gap-6 min-[861px]:flex">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.to} to={item.to} className={navLinkClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-0.5">
          <div
            aria-label="Redes sociales de Adictos al Techno"
            className="hidden items-center gap-0.5 min-[761px]:flex"
          >
            {SOCIAL_LINKS.map(({ key, label, href, Icon }) => (
              <a
                key={key}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                title={label}
                className="flex h-[38px] w-[38px] items-center justify-center rounded-adt text-text-soft transition-colors hover:border hover:border-line hover:bg-surface hover:text-signal"
              >
                <Icon width={17} height={17} />
              </a>
            ))}
          </div>
          <span aria-hidden="true" className="mx-1.5 hidden h-6 w-px bg-line min-[761px]:block" />

          <HeaderSearch />

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            aria-pressed={theme === "light"}
            className="flex h-11 w-11 items-center justify-center rounded-adt text-text hover:bg-surface"
          >
            {theme === "dark" ? <Sun className="h-[19px] w-[19px]" strokeWidth={2} /> : <Moon className="h-[19px] w-[19px]" strokeWidth={2} />}
          </button>

          <AccountControl />

          <button
            ref={mobileNav.toggleRef}
            type="button"
            onClick={() => mobileNav.setOpen(true)}
            aria-label="Abrir menú"
            aria-expanded={mobileNav.open}
            aria-controls="mobile-nav"
            className="flex h-11 w-11 items-center justify-center rounded-adt text-text hover:bg-surface min-[861px]:hidden"
          >
            <Menu className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>
      </div>

      <Ticker items={tickerItems} onItemClick={handleItemClick} />

      {mobileNav.open && (
        <div
          id="mobile-nav"
          ref={mobileNav.panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menú de navegación"
          className="fixed inset-0 z-50 flex flex-col bg-bg min-[861px]:hidden"
        >
          <div className="wrap flex items-center justify-between py-4">
            <span className="font-display text-lg font-extrabold uppercase">Menú</span>
            <button
              type="button"
              onClick={mobileNav.close}
              aria-label="Cerrar menú"
              className="flex h-11 w-11 items-center justify-center rounded-adt text-text hover:bg-surface"
            >
              <X className="h-5 w-5" strokeWidth={2} />
            </button>
          </div>
          <nav aria-label="Navegación principal" className="wrap flex flex-1 flex-col gap-1 py-4">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "border-b border-line py-4 text-lg font-bold uppercase tracking-[0.04em]",
                    isActive && "text-signal"
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="wrap flex items-center gap-2 border-t border-line py-4">
            {SOCIAL_LINKS.map(({ key, label, href, Icon }) => (
              <a
                key={key}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-11 w-11 items-center justify-center rounded-adt border border-line text-text-soft hover:border-signal hover:text-signal"
              >
                <Icon width={17} height={17} />
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
