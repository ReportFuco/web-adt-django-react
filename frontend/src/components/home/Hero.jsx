import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Calendar, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import LinkGlyph from "../ui/LinkGlyph";
import Cta from "../ui/Cta";
import { MetaRow, MetaItem } from "../ui/MetaRow";
import { formatShortDate } from "../../utils/formatDate";
import { excerpt, readingTimeMinutes } from "../../utils/textExcerpt";

const AUTOPLAY_MS = 7000;

const noticiaShape = PropTypes.shape({
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  slug: PropTypes.string.isRequired,
  titulo: PropTypes.string.isRequired,
  contenido: PropTypes.string,
  imagen: PropTypes.string,
  fecha_publicacion: PropTypes.string,
});

/** Una foto del carrusel; solo monta el <img> si `primed` (ver Hero). */
function HeroSlide({ noticia, active, primed }) {
  const href = `/noticias/${noticia.id}/${noticia.slug}`;
  const dek = noticia.contenido ? excerpt(noticia.contenido, 180) : "";
  const minutes = noticia.contenido ? readingTimeMinutes(noticia.contenido) : null;

  return (
    <article
      aria-hidden={!active}
      className={`absolute inset-0 transition-opacity duration-500 ease-[var(--adt-ease-standard)] ${
        active ? "z-[1] opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      {noticia.imagen && primed && (
        <img
          src={noticia.imagen}
          alt=""
          loading="eager"
          fetchPriority={active ? "high" : "low"}
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <div className="relative z-[2] flex h-full flex-col justify-end bg-gradient-to-t from-black/95 via-black/70 to-transparent px-5 pb-6 pt-10 sm:px-8 sm:pb-10 sm:pt-24">
        <span className="mb-2 inline-flex items-center gap-2 text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-signal">
          <LinkGlyph size={15} />
          Historia destacada
        </span>
        <h1 className="mb-3 line-clamp-2 text-on-photo text-[clamp(1.75rem,5.5vw,2.25rem)] sm:line-clamp-none sm:text-[clamp(2.1rem,1.2vw+1.9rem,3.9rem)]">
          <Link to={href} className="block hover:text-signal" tabIndex={active ? 0 : -1}>
            {noticia.titulo}
          </Link>
        </h1>
        {dek && (
          <p className="mb-4 hidden max-w-[52ch] text-[1.0625rem] text-on-photo/82 sm:block">{dek}</p>
        )}
        <MetaRow className="mb-6 text-on-photo/62">
          {minutes && <MetaItem icon={Clock}>{minutes} MIN DE LECTURA</MetaItem>}
          {noticia.fecha_publicacion && (
            <MetaItem icon={Calendar}>{formatShortDate(noticia.fecha_publicacion)}</MetaItem>
          )}
        </MetaRow>
        <Cta
          to={href}
          variant="primary"
          tabIndex={active ? 0 : -1}
          className="w-max bg-[#f3f1eb] text-[#0a0a0a] hover:bg-signal hover:text-on-signal"
        >
          Leer noticia
        </Cta>
      </div>
    </article>
  );
}

HeroSlide.propTypes = {
  noticia: noticiaShape.isRequired,
  active: PropTypes.bool.isRequired,
  primed: PropTypes.bool.isRequired,
};

/**
 * Historia principal del home (DESIGN.md §9.5): carrusel de fotos a sangre +
 * velo + overline/título/bajada/CTA sobre la foto. Con una sola historia se
 * comporta como el hero estático original (sin controles ni autoplay). Cada
 * foto solo se monta en el DOM cuando le toca ser la actual o la siguiente
 * (`primed`), para no descargar de entrada todas las fotos del carrusel.
 */
function Hero({ slides }) {
  const count = slides?.length ?? 0;
  const [index, setIndex] = useState(0);
  const [primed, setPrimed] = useState(() => new Set(count ? [0, 1 % count] : []));
  const [paused, setPaused] = useState(false);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotionRef.current = media.matches;
    const onChange = (event) => {
      reducedMotionRef.current = event.matches;
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    setIndex(0);
    setPrimed(new Set(count ? [0, 1 % count] : []));
  }, [count]);

  useEffect(() => {
    setPrimed((prev) => {
      const next = (index + 1) % count;
      if (prev.has(index) && prev.has(next)) return prev;
      const merged = new Set(prev);
      merged.add(index);
      merged.add(next);
      return merged;
    });
  }, [index, count]);

  useEffect(() => {
    if (count < 2 || paused || reducedMotionRef.current) return undefined;
    if (typeof document !== "undefined" && document.hidden) return undefined;

    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [count, paused, index]);

  if (!count) return null;

  const goTo = (next) => setIndex(((next % count) + count) % count);

  return (
    <div
      role="region"
      aria-roledescription="carrusel"
      aria-label="Historia principal"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
      }}
      className={`relative flex min-h-[380px] flex-col justify-end overflow-hidden border border-line
        sm:min-h-[clamp(440px,66vh,660px)]
        animate-[adt-hero-fade-up_700ms_var(--adt-ease-standard)_both]
        before:absolute before:left-[-1px] before:top-[-1px] before:z-[3] before:h-[22px] before:w-[22px] before:border-l-2 before:border-t-2 before:border-signal before:content-['']
        after:absolute after:bottom-[-1px] after:right-[-1px] after:z-[3] after:h-[22px] after:w-[22px] after:border-b-2 after:border-r-2 after:border-signal after:content-['']`}
    >
      {slides.map((noticia, i) => (
        <HeroSlide key={noticia.id} noticia={noticia} active={i === index} primed={primed.has(i)} />
      ))}

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label="Historia anterior"
            className="absolute left-2 top-1/2 z-[4] hidden -translate-y-1/2 items-center justify-center rounded-adt border border-white/25 bg-black/40 p-2 text-white backdrop-blur-sm transition-colors duration-[var(--adt-dur-fast)] hover:bg-black/70 sm:flex"
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={2.5} />
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label="Historia siguiente"
            className="absolute right-2 top-1/2 z-[4] hidden -translate-y-1/2 items-center justify-center rounded-adt border border-white/25 bg-black/40 p-2 text-white backdrop-blur-sm transition-colors duration-[var(--adt-dur-fast)] hover:bg-black/70 sm:flex"
          >
            <ChevronRight className="h-5 w-5" strokeWidth={2.5} />
          </button>

          <div
            role="tablist"
            aria-label="Seleccionar historia"
            className="absolute bottom-4 right-4 z-[4] flex items-center gap-1.5 sm:bottom-6 sm:right-8"
          >
            {slides.map((noticia, i) => (
              <button
                key={noticia.id}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Historia ${i + 1} de ${count}: ${noticia.titulo}`}
                onClick={() => goTo(i)}
                className={`h-1.5 rounded-full transition-all duration-[var(--adt-dur-fast)] ${
                  i === index ? "w-6 bg-[#f3f1eb]" : "w-1.5 bg-[#f3f1eb]/40 hover:bg-[#f3f1eb]/70"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

Hero.propTypes = {
  slides: PropTypes.arrayOf(noticiaShape),
};

export default Hero;
