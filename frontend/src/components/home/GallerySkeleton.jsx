import PropTypes from "prop-types";
import Skeleton from "../ui/Skeleton";

/** Forma de Gallery.jsx (grilla 3→4→6, ratio 1:1) — Fase 7. */
function GallerySkeleton({ items = 6 }) {
  return (
    <div
      role="status"
      aria-busy="true"
      className="grid grid-cols-3 gap-2 min-[561px]:grid-cols-4 min-[901px]:grid-cols-6"
    >
      <span className="sr-only">Cargando galería…</span>
      {Array.from({ length: items }, (_, index) => (
        <Skeleton key={index} className="aspect-square w-full" />
      ))}
    </div>
  );
}

GallerySkeleton.propTypes = {
  items: PropTypes.number,
};

export default GallerySkeleton;
