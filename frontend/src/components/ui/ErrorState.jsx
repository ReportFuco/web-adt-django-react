import PropTypes from "prop-types";
import { cn } from "@/lib/utils";
import Cta from "./Cta";

/**
 * Estado de error explícito (distinto de "vacío") — DESIGN.md §14 /
 * docs/rediseño/AUDITORIA.md #4: un fallo de red nunca debe verse igual a
 * una lista vacía.
 */
function ErrorState({ title = "No se pudo cargar el contenido", description, onRetry, className }) {
  return (
    <div
      role="alert"
      className={cn("flex flex-col items-center gap-3 border border-line bg-bg-soft py-16 text-center", className)}
    >
      <p className="font-body text-base font-semibold text-text">{title}</p>
      {description && <p className="max-w-[40ch] text-sm text-text-muted">{description}</p>}
      {onRetry && (
        <Cta variant="ghost" type="button" onClick={onRetry}>
          Reintentar
        </Cta>
      )}
    </div>
  );
}

ErrorState.propTypes = {
  title: PropTypes.node,
  description: PropTypes.node,
  onRetry: PropTypes.func,
  className: PropTypes.string,
};

export default ErrorState;
