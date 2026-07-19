import PropTypes from "prop-types";
import Skeleton from "../ui/Skeleton";

/** Forma de EventCards.jsx (grilla 1→2→4, Media ratio 1:1) — Fase 7. */
function EventCardsSkeleton({ items = 4 }) {
  return (
    <div role="status" aria-busy="true" className="grid gap-6 min-[461px]:grid-cols-2 min-[1001px]:grid-cols-4">
      <span className="sr-only">Cargando eventos…</span>
      {Array.from({ length: items }, (_, index) => (
        <div key={index} className="flex flex-col border border-line bg-surface">
          <Skeleton className="aspect-square w-full rounded-none border-b border-line" />
          <div className="flex flex-1 flex-col gap-2 p-4">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="mt-auto h-3 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}

EventCardsSkeleton.propTypes = {
  items: PropTypes.number,
};

export default EventCardsSkeleton;
