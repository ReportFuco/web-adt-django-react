import PropTypes from "prop-types";
import { cn } from "@/lib/utils";

/**
 * Primitivo decorativo de carga (Fase 7 — PLAN-FASE7-POLISH.md §C). Reduced
 * motion queda cubierto por el guard CSS global (neutraliza animate-pulse).
 */
function Skeleton({ className }) {
  return <div aria-hidden="true" className={cn("animate-pulse rounded-adt bg-surface-raised", className)} />;
}

Skeleton.propTypes = {
  className: PropTypes.string,
};

export default Skeleton;
