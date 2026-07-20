import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Calendar, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import Media from "../ui/Media";
import { formatEventDateBadge } from "../../utils/eventDates";
import useInViewOnce from "../../hooks/useInViewOnce";
import { usePrefetchDetail } from "../../queries/usePrefetchDetail";

/** Próximos eventos en tarjetas cuadradas (DESIGN.md §9.6 — `event-card`). */
function EventCards({ eventos }) {
  const [ref, inView] = useInViewOnce();
  const { prefetchEvento } = usePrefetchDetail();
  if (!eventos?.length) return null;

  return (
    <div ref={ref} className="grid gap-6 min-[461px]:grid-cols-2 min-[1001px]:grid-cols-4">
      {eventos.map((evento, index) => (
        <div
          key={evento.id}
          style={{ transitionDelay: inView ? `${index * 70}ms` : undefined }}
          className={cn("adt-reveal h-full", inView && "is-visible")}
        >
          <Link
            to={`/eventos/${evento.id}/${evento.slug}`}
            onMouseEnter={() => prefetchEvento(evento.slug)}
            onFocus={() => prefetchEvento(evento.slug)}
            className="group flex h-full flex-col border border-line bg-surface transition-[border-color,transform] duration-[var(--adt-dur-fast)] hover:-translate-y-0.5 hover:border-signal focus-visible:-translate-y-0.5 focus-visible:border-signal"
          >
            <Media ratio="11" src={evento.imagen} alt="" zoom className="border-b border-line" />
            <div className="flex flex-1 flex-col gap-2 p-4">
              <span className="inline-flex items-center gap-1.5 font-display text-[0.8125rem] font-extrabold uppercase tracking-[0.04em] tabular-nums text-signal">
                <Calendar className="h-[13px] w-[13px] shrink-0" strokeWidth={2} />
                {formatEventDateBadge(evento.fechas || [])}
              </span>
              <span className="font-body text-base font-bold leading-tight group-hover:text-signal">
                {evento.nombre}
              </span>
              <span className="mt-auto inline-flex items-center gap-1.5 text-[0.6875rem] uppercase tracking-[0.04em] text-text-muted">
                <MapPin className="h-3 w-3 shrink-0" strokeWidth={2} />
                {evento.lugar}
              </span>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}

EventCards.propTypes = {
  eventos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      slug: PropTypes.string.isRequired,
      nombre: PropTypes.string.isRequired,
      imagen: PropTypes.string,
      lugar: PropTypes.string,
      fechas: PropTypes.array,
    })
  ),
};

export default EventCards;
