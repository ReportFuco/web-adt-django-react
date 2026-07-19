import PropTypes from "prop-types";
import { cn } from "@/lib/utils";

/** Label de sección en la señal (DESIGN.md §9.2/§9.3). */
function Kicker({ children, className, as: As = "span" }) {
  return (
    <As className={cn("mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-signal", className)}>
      {children}
    </As>
  );
}

Kicker.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  as: PropTypes.elementType,
};

export default Kicker;
