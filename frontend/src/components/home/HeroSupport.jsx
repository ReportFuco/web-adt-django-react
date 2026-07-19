import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Media from "../ui/Media";
import Tag from "../ui/Tag";

/**
 * Apoyo del hero (DESIGN.md §9.5): 4 ítems numerados "También en portada".
 * Recibe historias ya resueltas (noticias/eventos/entrevistas destacados)
 * sin repetir la historia principal del Hero.
 */
function HeroSupport({ items }) {
  if (!items?.length) return null;

  return (
    <aside
      aria-label="Enlaces de apoyo a la historia principal"
      className="flex flex-col border border-line bg-surface px-4 pb-1 pt-4 animate-[adt-hero-fade-up_700ms_var(--adt-ease-standard)_120ms_both] sm:px-6 sm:pb-2 sm:pt-6"
    >
      <p className="mb-1 border-b border-line pb-3 text-xs font-bold uppercase tracking-[0.1em] text-text-muted">
        También en portada
      </p>
      {items.map((item, index) => (
        <Link
          key={item.id}
          to={item.href}
          className={`group items-start gap-4 border-b border-line py-3 last:border-b-0 sm:flex sm:py-4 ${
            index < 2 ? "flex" : "hidden"
          }`}
        >
          <span className="font-display min-w-[1.4ch] shrink-0 text-2xl font-extrabold leading-none text-text-muted">
            {String(index + 1).padStart(2, "0")}
          </span>
          <Media ratio="11" src={item.imagen} alt="" className="w-12 shrink-0 self-center rounded-adt sm:w-16" />
          <span className="min-w-0">
            <span className="block font-body text-[0.9375rem] font-semibold leading-snug group-hover:text-signal">
              {item.titulo}
            </span>
            <span className="mt-1.5 block">
              <Tag>{item.tag}</Tag>
            </span>
          </span>
        </Link>
      ))}
    </aside>
  );
}

HeroSupport.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      href: PropTypes.string.isRequired,
      titulo: PropTypes.string.isRequired,
      imagen: PropTypes.string,
      tag: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default HeroSupport;
