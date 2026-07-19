import PropTypes from "prop-types";
import { cn } from "@/lib/utils";

/** Pill de categoría/etiqueta (DESIGN.md §9.2). `active` vira a la señal. */
function Tag({ children, active = false, className, as: As = "span" }) {
  return (
    <As
      className={cn(
        "inline-flex items-center rounded-adt border border-line px-2 py-[3px] text-[0.6875rem] font-bold uppercase tracking-[0.08em] text-text-soft",
        active && "border-signal text-signal",
        className
      )}
    >
      {children}
    </As>
  );
}

Tag.propTypes = {
  children: PropTypes.node.isRequired,
  active: PropTypes.bool,
  className: PropTypes.string,
  as: PropTypes.elementType,
};

export default Tag;
