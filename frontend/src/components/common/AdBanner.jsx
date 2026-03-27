import { memo, useCallback } from "react";
import PropTypes from "prop-types";
import { trackAnuncioClick } from "../../services/api";

function AdBanner({ anuncio }) {
  const handleClick = useCallback(async () => {
    try {
      if (anuncio?.id) await trackAnuncioClick(anuncio.id);
    } catch (e) {
      console.error("Error al trackear anuncio", e);
    }
  }, [anuncio]);

  if (!anuncio) return null;

  return (
    <section className="theme-panel-strong overflow-hidden border border-white/10 rounded-none md:rounded-sm">
      <a
        href={anuncio.enlace || "#"}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] items-stretch no-underline"
      >
        <div className="relative min-h-[190px] sm:min-h-[240px] md:min-h-[320px] lg:min-h-[360px] bg-black/30 order-1">
          {anuncio.imagen ? (
            <img
              src={anuncio.imagen}
              alt={anuncio.titulo}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-950" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/10 lg:bg-gradient-to-r lg:from-black/10 lg:via-black/10 lg:to-black/45" />
        </div>

        <div className="order-2 flex flex-col justify-center gap-4 sm:gap-5 p-5 sm:p-7 md:p-9 lg:p-10 bg-[#0c0c0c] text-white">
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] text-white/60 font-bold">
            AUSPICIADO
          </span>
          <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black uppercase tracking-tight leading-[0.95] max-w-[14ch]">
            {anuncio.titulo}
          </h3>
          {anuncio.contenido && (
            <p className="text-sm sm:text-[15px] md:text-base text-white/72 leading-relaxed max-w-xl">
              {anuncio.contenido}
            </p>
          )}
          <div className="pt-1 sm:pt-2">
            <span className="inline-flex items-center justify-center border border-white/20 px-4 sm:px-5 py-3 text-[10px] sm:text-[11px] uppercase tracking-[0.22em] font-bold hover:bg-white hover:text-black transition-all duration-300 w-full sm:w-auto text-center">
              {anuncio.cta_text || "Ver más"}
            </span>
          </div>
        </div>
      </a>
    </section>
  );
}

AdBanner.propTypes = {
  anuncio: PropTypes.shape({
    id: PropTypes.number,
    titulo: PropTypes.string,
    contenido: PropTypes.string,
    imagen: PropTypes.string,
    enlace: PropTypes.string,
    cta_text: PropTypes.string,
  }),
};

export default memo(AdBanner);
