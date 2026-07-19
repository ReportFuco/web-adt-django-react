import PropTypes from "prop-types";
import Skeleton from "../ui/Skeleton";

/** Forma de NewsList.jsx (filas 96px/160px + Media ratio 4:3) — Fase 7. */
function NewsListSkeleton({ rows = 4 }) {
  return (
    <div role="status" aria-busy="true" className="flex flex-col">
      <span className="sr-only">Cargando noticias…</span>
      {Array.from({ length: rows }, (_, index) => (
        <div
          key={index}
          className="grid grid-cols-[96px_1fr] items-center gap-4 border-b border-line py-4 first:border-t min-[721px]:grid-cols-[160px_1fr_auto]"
        >
          <Skeleton className="aspect-[4/3] w-full" />
          <div className="min-w-0">
            <Skeleton className="mb-3 h-5 w-full max-w-[32ch]" />
            <div className="flex items-center gap-3">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
          <Skeleton className="hidden h-[18px] w-[18px] min-[721px]:block" />
        </div>
      ))}
    </div>
  );
}

NewsListSkeleton.propTypes = {
  rows: PropTypes.number,
};

export default NewsListSkeleton;
