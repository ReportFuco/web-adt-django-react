import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const newsShape = PropTypes.shape({
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  titulo: PropTypes.string,
  slug: PropTypes.string,
  imagen: PropTypes.string,
  destacado: PropTypes.bool,
  tags: PropTypes.array,
});

export default function NewsSection({
  noticias = [],
  destacadas = false,
  limit = 4,
  gridCols = "md:grid-cols-4",
  cardHeight = "h-48",
}) {
  const navigate = useNavigate();

  const filteredNews = noticias
    .filter((news) => (destacadas ? news.destacado === true : news.destacado === false))
    .slice(0, limit);

  return (
    <div className="max-w-7xl px-0 py-0" style={{ color: "var(--text)" }}>
      <div className="section-title mb-6 sm:mb-8 md:mb-10">
        <div>
          <h2 className="section-title-heading">{destacadas ? "Noticias Recientes" : "Más Noticias"}</h2>
          <p className="section-title-kicker">Latest from the scene</p>
        </div>
      </div>

      <div className={`editorial-grid ${gridCols}`}>
        {filteredNews.map((news) => (
          <article
            key={news.id}
            className={`editorial-card p-4 sm:p-5 md:p-6 lg:p-7 flex flex-col gap-4 md:gap-5 group min-h-[23rem] sm:min-h-[24rem] md:min-h-0 ${cardHeight}`}
            onClick={() => {
              navigate(`/noticias/${news.id}/${news.slug}`);
              window.scrollTo(0, 0);
            }}
          >
            <div className="relative h-36 sm:h-44 md:h-auto md:flex-1 min-h-[9rem] overflow-hidden transition-all duration-500">
              <img src={news.imagen} alt={news.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute top-3 left-3 md:top-4 md:left-4 theme-panel-strong text-[10px] font-bold px-3 py-1 uppercase tracking-tight">Noticia</div>
            </div>
            <div className="flex min-h-[11rem] flex-col gap-3">
              <h3 className="text-xl sm:text-2xl lg:text-[1.7rem] font-bold leading-tight uppercase [overflow-wrap:anywhere]" style={{ color: "var(--text)" }}>{news.titulo}</h3>
              {Array.isArray(news.tags) && news.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {news.tags.slice(0, 3).map((tag) => (
                    <span key={tag.id ?? tag.nombre ?? tag} className="border border-cyan-400/30 bg-cyan-400/10 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-cyan-200 shadow-[inset_0_0_0_1px_rgba(34,211,238,0.06)]">
                      {tag.nombre ?? tag}
                    </span>
                  ))}
                </div>
              )}
              <button className="mt-auto pt-2 text-[10px] font-bold uppercase tracking-[0.18em] flex items-center gap-2 group/btn theme-text-soft">
                Leer más <span className="group-hover/btn:translate-x-2 transition-transform">→</span>
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

NewsSection.propTypes = {
  noticias: PropTypes.arrayOf(newsShape),
  destacadas: PropTypes.bool,
  limit: PropTypes.number,
  gridCols: PropTypes.string,
  cardHeight: PropTypes.string,
};
