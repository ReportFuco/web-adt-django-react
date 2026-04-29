import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { formatEventDateBadge, formatEventDateRange, getEventDateItems } from "../../utils/eventDates";

const eventShape = PropTypes.shape({
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  nombre: PropTypes.string,
  slug: PropTypes.string,
  imagen: PropTypes.string,
  fecha_hora: PropTypes.string,
  fechas: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    fecha: PropTypes.string,
  })),
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

  const filteredEvents = event
    .filter((item) => (destacadas ? item.destacado === true : item.destacado === false))
    .slice(0, limit);

  const rowMode = cardHeight.includes("11rem") || cardHeight.includes("12rem");

  if (rowMode) {
    return (
      <div className="space-y-px editorial-grid overflow-hidden">
        {filteredEvents.map((item) => {
          const eventDates = getEventDateItems(item);
          const dateBadge = formatEventDateBadge(eventDates);
          const dateLabel = formatEventDateRange(eventDates);

          return (
          <div
            key={item.id}
            className="grid grid-cols-1 gap-4 px-4 py-5 sm:px-5 md:grid-cols-[170px_minmax(0,1fr)_auto] md:items-center md:px-6 md:py-7 group cursor-pointer theme-panel-strong hover:opacity-90 transition-all"
            onClick={() => {
              navigate(`/eventos/${item.id}/${item.slug}`);
              window.scrollTo(0, 0);
            }}
          >
            <div className="text-xl sm:text-2xl md:text-3xl font-bold leading-none" style={{ color: "var(--text)" }}>
              {dateBadge}
            </div>
            <div className="min-w-0">
              <h4 className="text-xl sm:text-2xl md:text-3xl font-bold uppercase leading-tight" style={{ color: "var(--text)" }}>{item.nombre}</h4>
              <p className="text-[10px] sm:text-xs uppercase tracking-[0.16em] sm:tracking-[0.2em] mt-2 theme-text-muted leading-relaxed">{item.lugar || dateLabel}</p>
            </div>
            <div className="flex justify-between md:justify-end gap-4 md:gap-6 items-center">
              <span className="text-[10px] font-bold border px-3 py-1 uppercase theme-button-secondary">Evento</span>
              <span style={{ color: "var(--text)" }}>→</span>
            </div>
          </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="max-w-7xl px-0 py-0" style={{ color: "var(--text)" }}>
      <div className="section-title mb-6 sm:mb-8 md:mb-10">
        <div>
          <h2 className="section-title-heading">{destacadas ? "Eventos Destacados" : "Más Eventos"}</h2>
          <p className="section-title-kicker">Calendar / clubs / live moments</p>
        </div>
      </div>

      <div className={`editorial-grid ${gridCols}`}>
        {filteredEvents.map((item) => {
          const eventDates = getEventDateItems(item);
          const dateLabel = formatEventDateRange(eventDates);

          return (
          <article
            key={item.id}
            className={`editorial-card p-4 sm:p-5 md:p-6 lg:p-7 flex flex-col gap-4 md:gap-5 group min-h-[23rem] sm:min-h-[24rem] md:min-h-0 ${cardHeight}`}
            onClick={() => {
              navigate(`/eventos/${item.id}/${item.slug}`);
              window.scrollTo(0, 0);
            }}
          >
            <div className="relative h-36 sm:h-44 md:h-auto md:flex-1 min-h-[9rem] overflow-hidden transition-all duration-500">
              <img src={item.imagen} alt={item.nombre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute top-3 left-3 md:top-4 md:left-4 theme-panel-strong text-[10px] font-bold px-3 py-1 uppercase tracking-tight">Evento</div>
            </div>
            <div className="flex min-h-[11rem] flex-col gap-3">
              <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.16em] sm:tracking-[0.2em] theme-text-muted leading-relaxed">{dateLabel}</p>
              <h3 className="text-xl sm:text-2xl lg:text-[1.7rem] font-bold leading-tight uppercase [overflow-wrap:anywhere]" style={{ color: "var(--text)" }}>{item.nombre}</h3>
              {Array.isArray(item.tags) && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {item.tags.slice(0, 3).map((tag) => (
                    <span key={tag.id ?? tag.nombre ?? tag} className="border border-fuchsia-400/30 bg-fuchsia-400/10 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-fuchsia-200 shadow-[inset_0_0_0_1px_rgba(232,121,249,0.06)]">
                      {tag.nombre ?? tag}
                    </span>
                  ))}
                </div>
              )}
              <button className="mt-auto pt-2 text-[10px] font-bold uppercase tracking-[0.18em] flex items-center gap-2 group/btn theme-text-soft">
                Ver evento <span className="group-hover/btn:translate-x-2 transition-transform">→</span>
              </button>
            </div>
          </article>
          );
        })}
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
