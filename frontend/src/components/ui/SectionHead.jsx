import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Kicker from "./Kicker";

/**
 * Encabezado de sección: kicker + título a la izquierda, link "Ver todas"
 * a la derecha (DESIGN.md §9.3).
 */
function SectionHead({ kicker, title, headingId, linkTo, linkLabel, className }) {
  return (
    <div className={cn("mb-8 flex flex-wrap items-end justify-between gap-6", className)}>
      <div>
        <Kicker>{kicker}</Kicker>
        <h2 id={headingId} className="text-[clamp(1.75rem,3vw,2.75rem)]">
          {title}
        </h2>
      </div>
      {linkTo && (
        <Link
          to={linkTo}
          className="group inline-flex shrink-0 items-center gap-1.5 border-b border-line pb-0.5 text-sm font-semibold tracking-[0.04em] uppercase transition-colors duration-[var(--adt-dur-fast)] hover:border-signal hover:text-signal"
        >
          {linkLabel}
          <ArrowRight
            className="h-3.5 w-3.5 transition-transform duration-[var(--adt-dur-fast)] ease-adt group-hover:translate-x-[3px]"
            strokeWidth={2.5}
          />
        </Link>
      )}
    </div>
  );
}

SectionHead.propTypes = {
  kicker: PropTypes.node.isRequired,
  title: PropTypes.node.isRequired,
  headingId: PropTypes.string,
  linkTo: PropTypes.string,
  linkLabel: PropTypes.node,
  className: PropTypes.string,
};

export default SectionHead;
