import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

/**
 * Fila de agenda cronológica (DESIGN.md §9.6): fecha dominante (día grande +
 * mes) / info / CTA opcional. Usado en el listado de eventos.
 */
function AgendaRow({ to, day, month, title, meta, isToday = false, cta, className }) {
  return (
    <div
      className={cn(
        "grid grid-cols-[64px_1fr] items-center gap-6 border-b border-line py-6 transition-colors duration-[var(--adt-dur-fast)] hover:bg-surface sm:grid-cols-[96px_1fr_auto]",
        className
      )}
    >
      <div className={cn("text-center leading-none", isToday ? "text-signal" : "text-text")}>
        <span className="font-display text-[1.75rem] font-black sm:text-[2.5rem]">{day}</span>
        <span className="mt-0.5 block text-[0.6875rem] font-bold uppercase tracking-[0.1em] text-text-muted">
          {month}
        </span>
      </div>
      <div className="group min-w-0">
        <Link to={to} className="block">
          <p className="mb-1.5 font-body text-lg font-bold leading-tight group-hover:text-signal sm:text-[1.1875rem]">
            {title}
          </p>
          {meta && <div className="text-xs text-text-muted">{meta}</div>}
        </Link>
      </div>
      {cta && <div className="col-span-2 justify-self-start sm:col-span-1 sm:justify-self-auto">{cta}</div>}
    </div>
  );
}

AgendaRow.propTypes = {
  to: PropTypes.string.isRequired,
  day: PropTypes.node.isRequired,
  month: PropTypes.node.isRequired,
  title: PropTypes.node.isRequired,
  meta: PropTypes.node,
  isToday: PropTypes.bool,
  cta: PropTypes.node,
  className: PropTypes.string,
};

export default AgendaRow;
