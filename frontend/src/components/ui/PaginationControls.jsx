import PropTypes from "prop-types";
import { ArrowLeft, ArrowRight } from "lucide-react";

/** Paginación simple anterior/siguiente para listados (PLAN.md Fase 5). */
function PaginationControls({ hasPrevious, hasNext, onPrevious, onNext, page }) {
  if (!hasPrevious && !hasNext) return null;

  return (
    <nav aria-label="Paginación" className="mt-8 flex items-center justify-between border-t border-line pt-6">
      <button
        type="button"
        onClick={onPrevious}
        disabled={!hasPrevious}
        className="inline-flex min-h-11 items-center gap-2 rounded-adt border border-line px-4 text-xs font-bold uppercase tracking-[0.06em] disabled:cursor-not-allowed disabled:opacity-40 hover:enabled:border-signal hover:enabled:text-signal"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
        Anterior
      </button>
      <span className="text-xs uppercase tracking-[0.06em] text-text-muted">Página {page}</span>
      <button
        type="button"
        onClick={onNext}
        disabled={!hasNext}
        className="inline-flex min-h-11 items-center gap-2 rounded-adt border border-line px-4 text-xs font-bold uppercase tracking-[0.06em] disabled:cursor-not-allowed disabled:opacity-40 hover:enabled:border-signal hover:enabled:text-signal"
      >
        Siguiente
        <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
      </button>
    </nav>
  );
}

PaginationControls.propTypes = {
  hasPrevious: PropTypes.bool.isRequired,
  hasNext: PropTypes.bool.isRequired,
  onPrevious: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
};

export default PaginationControls;
