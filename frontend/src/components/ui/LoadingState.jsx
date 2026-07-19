import PropTypes from "prop-types";
import { cn } from "@/lib/utils";

/** Estado de carga (DESIGN.md §14 — loading/empty/error deben distinguirse). */
function LoadingState({ label = "Cargando…", className }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn("flex items-center justify-center gap-3 py-16 text-sm text-text-muted", className)}
    >
      <span
        className="h-4 w-4 animate-spin rounded-full border-2 border-line border-t-signal"
        aria-hidden="true"
      />
      {label}
    </div>
  );
}

LoadingState.propTypes = {
  label: PropTypes.node,
  className: PropTypes.string,
};

export default LoadingState;
