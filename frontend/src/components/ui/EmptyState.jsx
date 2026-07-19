import PropTypes from "prop-types";
import { cn } from "@/lib/utils";

/** Estado vacío real (sin error) — DESIGN.md §14. */
function EmptyState({ title = "Nada por aquí todavía", description, action, className }) {
  return (
    <div className={cn("flex flex-col items-center gap-3 border border-line bg-bg-soft py-16 text-center", className)}>
      <p className="font-body text-base font-semibold text-text">{title}</p>
      {description && <p className="max-w-[40ch] text-sm text-text-muted">{description}</p>}
      {action}
    </div>
  );
}

EmptyState.propTypes = {
  title: PropTypes.node,
  description: PropTypes.node,
  action: PropTypes.node,
  className: PropTypes.string,
};

export default EmptyState;
