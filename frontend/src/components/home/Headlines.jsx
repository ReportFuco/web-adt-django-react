import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { formatEventDateBadge } from "../../utils/eventDates";

/**
 * Strip compacto de titulares de agenda bajo el hero (DESIGN.md §9.6).
 * Composición editorial distinta a las tarjetas de EventCards, aunque
 * comparta la misma fuente de datos (próximos eventos).
 */
function Headlines({ eventos }) {
  if (!eventos?.length) return null;

  return (
    <section aria-labelledby="headlines-heading" className="wrap border-y border-line py-6">
      <h2
        id="headlines-heading"
        className="mb-4 inline-flex items-center gap-2 font-body text-xs font-bold uppercase normal-case tracking-[0.14em] text-signal before:h-[9px] before:w-[9px] before:shrink-0 before:bg-signal before:content-['']"
      >
        Titulares · Agenda
      </h2>
      <div className="grid gap-8 min-[761px]:grid-cols-3">
        {eventos.map((evento, index) => (
          <Link
            key={evento.id}
            to={`/eventos/${evento.id}/${evento.slug}`}
            className={`group grid grid-cols-[9px_1fr] items-start gap-4 ${
              index > 0 ? "border-t border-line pt-4 min-[761px]:border-l min-[761px]:border-t-0 min-[761px]:pl-8 min-[761px]:pt-0" : ""
            }`}
          >
            <span className="mt-1.5 h-[9px] w-[9px] shrink-0 bg-signal" aria-hidden="true" />
            <span className="min-w-0">
              <span className="block font-body text-[1.0625rem] font-bold leading-snug group-hover:text-signal">
                {evento.nombre}
              </span>
              <span className="mt-1.5 block text-[0.6875rem] uppercase tracking-[0.06em] tabular-nums text-text-muted">
                {formatEventDateBadge(evento.fechas || [])} · {evento.lugar}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

Headlines.propTypes = {
  eventos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      slug: PropTypes.string.isRequired,
      nombre: PropTypes.string.isRequired,
      lugar: PropTypes.string,
      fechas: PropTypes.array,
    })
  ),
};

export default Headlines;
