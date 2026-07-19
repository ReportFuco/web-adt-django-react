import PropTypes from "prop-types";
import Skeleton from "../ui/Skeleton";

/** Forma de InterviewGrid.jsx (retrato 4:5 + cita/byline) — Fase 7. */
function InterviewGridSkeleton({ items = 3 }) {
  return (
    <div role="status" aria-busy="true" className="grid gap-6 min-[601px]:grid-cols-2 min-[901px]:grid-cols-3">
      <span className="sr-only">Cargando entrevistas…</span>
      {Array.from({ length: items }, (_, index) => (
        <div key={index} className="border border-line">
          <Skeleton className="aspect-[4/5] w-full rounded-none" />
          <div className="p-4">
            <Skeleton className="mb-3 h-[22px] w-[22px]" />
            <Skeleton className="mb-2 h-5 w-full" />
            <Skeleton className="mb-3 h-5 w-2/3" />
            <Skeleton className="h-3 w-28" />
          </div>
        </div>
      ))}
    </div>
  );
}

InterviewGridSkeleton.propTypes = {
  items: PropTypes.number,
};

export default InterviewGridSkeleton;
