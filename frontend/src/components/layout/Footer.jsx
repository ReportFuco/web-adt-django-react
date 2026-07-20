import { Link } from "react-router-dom";
import logoFooter from "../../assets/logo-final-header-cropped.png";
import { ICONS_BY_RED } from "../ui/SocialIcons";
import useRedesSociales from "../../hooks/useRedesSociales";

const NAV_LINKS = [
  { label: "Noticias", to: "/noticias" },
  { label: "Eventos", to: "/eventos" },
  { label: "Entrevistas", to: "/entrevistas" },
  { label: "Cultura", to: "/cultura" },
];

// DECISIONES.md #13: páginas legales estáticas simples, sin newsletter
// (no hay proveedor integrado todavía).
const SITE_LINKS = [
  { label: "Contacto", to: "/#contacto" },
  { label: "Política editorial", to: "/politica-editorial" },
  { label: "Créditos fotográficos", to: "/creditos-fotograficos" },
];

/** Footer global del sitio (DESIGN.md §9.8). */
function Footer() {
  const { redes } = useRedesSociales();

  return (
    <footer className="border-t border-line bg-bg-soft py-12">
      <div className="wrap">
        <div className="mb-8 grid grid-cols-1 gap-8 border-b border-line pb-12 min-[521px]:grid-cols-2 min-[861px]:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <img src={logoFooter} alt="Adictos al Techno" className="brand-logo h-6 w-auto" />
            <span className="mt-3 block text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-text-muted">
              Noticias · Eventos · Cultura · Comunidad
            </span>
          </div>

          <div>
            <h3 className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.1em] text-text-muted">
              Navegación
            </h3>
            <ul className="flex flex-col gap-2.5">
              {NAV_LINKS.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="text-[0.9375rem] hover:text-signal">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.1em] text-text-muted">Sitio</h3>
            <ul className="flex flex-col gap-2.5">
              {SITE_LINKS.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="text-[0.9375rem] hover:text-signal">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.1em] text-text-muted">Comunidad</h3>
            <ul className="flex flex-col gap-2.5">
              {redes.map(({ id, label, url }) => (
                <li key={id}>
                  <a href={url} target="_blank" rel="noopener noreferrer" className="text-[0.9375rem] hover:text-signal">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-text-muted">
          <p>&copy; {new Date().getFullYear()} Adictos al Techno. Todos los derechos reservados.</p>
          <div className="flex gap-2">
            {redes.map(({ id, red, label, url }) => {
              const Icon = ICONS_BY_RED[red];
              return (
                <a
                  key={id}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-adt border border-line transition-[transform,border-color,color] duration-[var(--adt-dur-fast)] hover:-translate-y-0.5 hover:border-signal hover:text-signal focus-visible:-translate-y-0.5 focus-visible:border-signal focus-visible:text-signal"
                >
                  <Icon width={16} height={16} />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
