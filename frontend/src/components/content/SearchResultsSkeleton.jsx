import PropTypes from "prop-types";
import Skeleton from "../ui/Skeleton";

/** Forma de la fila de resultados de SearchResultsPage.jsx (igual a NewsList) — Fase 7. */
function SearchResultsSkeleton({ rows = 5 }) {
  return (
    <div role="status" aria-busy="true" className="flex flex-col">
      <span className="sr-only">Buscando…</span>
      {Array.from({ length: rows }, (_, index) => (
        <div
          key={index}
          className="grid grid-cols-[96px_1fr] items-center gap-4 border-b border-line py-4 first:border-t"
        >
          <Skeleton className="aspect-[4/3] w-full" />
          <div className="min-w-0">
            <Skeleton className="mb-3 h-5 w-full max-w-[32ch]" />
            <div className="flex items-center gap-3">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

SearchResultsSkeleton.propTypes = {
  rows: PropTypes.number,
};

export default SearchResultsSkeleton;
