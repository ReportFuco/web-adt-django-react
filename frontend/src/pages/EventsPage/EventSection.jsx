import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const eventShape = PropTypes.shape({
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  nombre: PropTypes.string,
  slug: PropTypes.string,
  imagen: PropTypes.string,
  fecha_hora: PropTypes.string,
  lugar: PropTypes.string,
  destacado: PropTypes.bool,
  tags: PropTypes.array,
});

export default function EventSection({
  event = [],
  destacadas = false,
  limit = 4,
  gridCols = "md:grid-cols-4",
  cardHeight = "h-48",
}) {
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("es-ES", options);
  };

  const filteredEvents = event
    .filter((item) => (destacadas ? item.destacado === true : item.destacado === false))
    .slice(0, limit);

  const rowMode = cardHeight.includes("11rem") || cardHeight.includes("12rem");

  if (rowMode) {
    return (
      <div className="space-y-px editorial-grid">
        {filteredEvents.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-1 md:grid-cols-4 items-center py-8 px-6 group cursor-pointer theme-panel-strong hover:opacity-90 transition-all"
            onClick={() => {
              navigate(`/eventos/${item.id}/${item.slug}`);
              window.scrollTo(0, 0);
            }}
          >
            <div className="text-3xl font-bold tracking-tighter mb-4 md:mb-0" style={{ color: "var(--text)" }}>
              {new Date(item.fecha_hora).toLocaleDateString("es-ES", { month: "short", day: "2-digit" }).toUpperCase()}
            </div>
            <div className="md:col-span-2">
              <h4 className="text-2xl font-bold uppercase" style={{ color: "var(--text)" }}>{item.nombre}</h4>
              <p className="text-sm uppercase tracking-widest mt-1 theme-text-muted">{item.lugar || formatDate(item.fecha_hora)}</p>
            </div>
            <div className="flex justify-end gap-6 items-center mt-6 md:mt-0">
              <span className="text-[10px] font-bold border px-3 py-1 uppercase theme-button-secondary">Evento</span>
              <span style={{ color: "var(--text)" }}>→</span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-7xl px-0 py-0" style={{ color: "var(--text)" }}>
      <div className="section-title mb-10">
        <div>
          <h2 className="section-title-heading">{destacadas ? "Eventos Destacados" : "Más Eventos"}</h2>
          <p className="section-title-kicker">Calendar / clubs / live moments</p>
        </div>
      </div>

      <div className={`editorial-grid ${gridCols}`}>
        {filteredEvents.map((item) => (
          <article
            key={item.id}
            className={`editorial-card p-6 md:p-8 flex flex-col gap-6 group ${cardHeight}`}
            onClick={() => {
              navigate(`/eventos/${item.id}/${item.slug}`);
              window.scrollTo(0, 0);
            }}
          >
            <div className="relative flex-1 overflow-hidden transition-all duration-500">
              <img src={item.imagen} alt={item.nombre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute top-4 left-4 theme-panel-strong text-[10px] font-bold px-3 py-1 uppercase tracking-tight">Evento</div>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-[10px] uppercase tracking-widest theme-text-muted">{formatDate(item.fecha_hora)}</p>
              <h3 className="text-2xl font-bold leading-tight uppercase" style={{ color: "var(--text)" }}>{item.nombre}</h3>
              {Array.isArray(item.tags) && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {item.tags.slice(0, 3).map((tag) => (
                    <span key={tag.id ?? tag.nombre ?? tag} className="border border-fuchsia-400/30 bg-fuchsia-400/10 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-fuchsia-200 shadow-[inset_0_0_0_1px_rgba(232,121,249,0.06)]">
                      {tag.nombre ?? tag}
                    </span>
                  ))}
                </div>
              )}
              <button className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 group/btn theme-text-soft">
                Ver evento <span className="group-hover/btn:translate-x-2 transition-transform">→</span>
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

EventSection.propTypes = {
  event: PropTypes.arrayOf(eventShape),
  destacadas: PropTypes.bool,
  limit: PropTypes.number,
  gridCols: PropTypes.string,
  cardHeight: PropTypes.string,
};
