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
    <section className="theme-panel-strong overflow-hidden border border-white/10">
      <a
        href={anuncio.enlace || "#"}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="grid md:grid-cols-[1.2fr_1fr] items-stretch no-underline"
      >
        <div className="relative min-h-[240px] md:min-h-[320px] bg-black/30">
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
          <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-black/10 to-black/50" />
        </div>

        <div className="flex flex-col justify-center gap-5 p-8 md:p-10 lg:p-12 bg-[#0c0c0c] text-white">
          <span className="text-[10px] md:text-[11px] uppercase tracking-[0.34em] text-white/60 font-bold">
            AUSPICIADO
          </span>
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-black uppercase tracking-tight leading-none">
            {anuncio.titulo}
          </h3>
          {anuncio.contenido && (
            <p className="text-sm md:text-base text-white/72 leading-relaxed max-w-xl">
              {anuncio.contenido}
            </p>
          )}
          <div>
            <span className="inline-flex items-center border border-white/20 px-5 py-3 text-[11px] uppercase tracking-[0.24em] font-bold hover:bg-white hover:text-black transition-all duration-300">
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
