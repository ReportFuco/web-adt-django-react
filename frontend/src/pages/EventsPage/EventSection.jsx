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
      <div className="space-y-px bg-white/10 border-y border-white/10">
        {filteredEvents.map((item) => (
          <div
            key={item.id}
            className="bg-[#0a0a0a] grid grid-cols-1 md:grid-cols-4 items-center py-8 px-6 group hover:bg-white hover:text-black transition-all cursor-pointer"
            onClick={() => {
              navigate(`/eventos/${item.id}/${item.slug}`);
              window.scrollTo(0, 0);
            }}
          >
            <div className="text-3xl font-bold tracking-tighter mb-4 md:mb-0">{new Date(item.fecha_hora).toLocaleDateString("es-ES", { month: "short", day: "2-digit" }).toUpperCase()}</div>
            <div className="md:col-span-2">
              <h4 className="text-2xl font-bold uppercase">{item.nombre}</h4>
              <p className="text-sm uppercase tracking-widest opacity-60 mt-1">{item.lugar || formatDate(item.fecha_hora)}</p>
            </div>
            <div className="flex justify-end gap-6 items-center mt-6 md:mt-0">
              <span className="text-[10px] font-bold border border-current px-3 py-1 uppercase">Evento</span>
              <span>→</span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-7xl px-0 py-0 text-white">
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
            <div className="relative flex-1 overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
              <img src={item.imagen} alt={item.nombre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute top-4 left-4 bg-black text-[10px] font-bold px-3 py-1 uppercase tracking-tight border border-white/10">Evento</div>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-[10px] opacity-40 uppercase tracking-widest">{formatDate(item.fecha_hora)}</p>
              <h3 className="text-2xl font-bold leading-tight uppercase">{item.nombre}</h3>
              <button className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 group/btn text-white/80">
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
