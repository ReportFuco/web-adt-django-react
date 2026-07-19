import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Calendar, Clock } from "lucide-react";
import LinkGlyph from "../ui/LinkGlyph";
import Cta from "../ui/Cta";
import { MetaRow, MetaItem } from "../ui/MetaRow";
import { formatShortDate } from "../../utils/formatDate";
import { excerpt, readingTimeMinutes } from "../../utils/textExcerpt";

/**
 * Historia principal del home (DESIGN.md §9.5): foto a sangre + velo +
 * overline/título/bajada/CTA sobre la foto. Único hero de la página,
 * reemplaza el carrusel de destacados.
 */
function Hero({ noticia }) {
  if (!noticia) return null;

  const href = `/noticias/${noticia.id}/${noticia.slug}`;
  const dek = noticia.contenido ? excerpt(noticia.contenido, 180) : "";
  const minutes = noticia.contenido ? readingTimeMinutes(noticia.contenido) : null;

  return (
    <article
      className={`relative flex min-h-[clamp(440px,66vh,660px)] flex-col justify-end overflow-hidden border border-line
        animate-[adt-hero-fade-up_700ms_var(--adt-ease-standard)_both]
        before:absolute before:left-[-1px] before:top-[-1px] before:z-[3] before:h-[22px] before:w-[22px] before:border-l-2 before:border-t-2 before:border-signal before:content-['']
        after:absolute after:bottom-[-1px] after:right-[-1px] after:z-[3] after:h-[22px] after:w-[22px] after:border-b-2 after:border-r-2 after:border-signal after:content-['']`}
    >
      {noticia.imagen && (
        <img
          src={noticia.imagen}
          alt=""
          loading="eager"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <div className="relative z-[2] bg-gradient-to-t from-black/95 via-black/70 to-transparent px-5 pb-8 pt-16 sm:px-8 sm:pb-10 sm:pt-24">
        <span className="mb-2 inline-flex items-center gap-2 text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-signal">
          <LinkGlyph size={15} />
          Historia destacada
        </span>
        <h1 className="mb-3 text-on-photo text-[clamp(2.1rem,1.2vw+1.9rem,3.9rem)]">
          <Link to={href} className="block hover:text-signal">
            {noticia.titulo}
          </Link>
        </h1>
        {dek && <p className="mb-4 max-w-[52ch] text-[1.0625rem] text-on-photo/82">{dek}</p>}
        <MetaRow className="mb-6 text-on-photo/62">
          {minutes && <MetaItem icon={Clock}>{minutes} MIN DE LECTURA</MetaItem>}
          {noticia.fecha_publicacion && (
            <MetaItem icon={Calendar}>{formatShortDate(noticia.fecha_publicacion)}</MetaItem>
          )}
        </MetaRow>
        <Cta to={href} variant="primary" className="bg-[#f3f1eb] text-[#0a0a0a] hover:bg-signal hover:text-on-signal">
          Leer noticia
        </Cta>
      </div>
    </article>
  );
}

Hero.propTypes = {
  noticia: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    slug: PropTypes.string.isRequired,
    titulo: PropTypes.string.isRequired,
    contenido: PropTypes.string,
    imagen: PropTypes.string,
    fecha_publicacion: PropTypes.string,
  }),
};

export default Hero;
