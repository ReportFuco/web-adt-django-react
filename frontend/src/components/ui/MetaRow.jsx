import PropTypes from "prop-types";
import { cn } from "@/lib/utils";

/** Fila de metadatos: fecha, tiempo de lectura, venue, etc. (DESIGN.md §9.2). */
export function MetaRow({ children, className }) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-4 text-xs tracking-[0.03em] text-text-muted [&_svg]:h-[13px] [&_svg]:w-[13px]",
        className
      )}
    >
      {children}
    </div>
  );
}

MetaRow.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

/** Un ítem dentro de MetaRow: ícono opcional + texto. */
export function MetaItem({ icon: Icon, children, className }) {
  return (
    <span className={cn("inline-flex items-center gap-[5px]", className)}>
      {Icon && <Icon strokeWidth={2} aria-hidden="true" />}
      {children}
    </span>
  );
}

MetaItem.propTypes = {
  icon: PropTypes.elementType,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};
