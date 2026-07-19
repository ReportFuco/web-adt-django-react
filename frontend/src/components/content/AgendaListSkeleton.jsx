import PropTypes from "prop-types";
import Skeleton from "../ui/Skeleton";

/** Forma de AgendaRow.jsx (fecha grande + info, sin imagen) usada en /eventos — Fase 7. */
function AgendaListSkeleton({ rows = 5 }) {
  return (
    <div role="status" aria-busy="true" className="border-t border-line">
      <span className="sr-only">Cargando agenda de eventos…</span>
      {Array.from({ length: rows }, (_, index) => (
        <div
          key={index}
          className="grid grid-cols-[64px_1fr] items-center gap-6 border-b border-line py-6 sm:grid-cols-[96px_1fr_auto]"
        >
          <div className="flex flex-col items-center gap-1.5">
            <Skeleton className="h-8 w-10 sm:h-11" />
            <Skeleton className="h-2.5 w-8" />
          </div>
          <div className="min-w-0">
            <Skeleton className="mb-2 h-5 w-full max-w-[28ch]" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
      ))}
    </div>
  );
}

AgendaListSkeleton.propTypes = {
  rows: PropTypes.number,
};

export default AgendaListSkeleton;
