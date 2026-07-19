import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const VARIANT_CLASSES = {
  primary: "bg-text text-bg hover:bg-signal hover:text-on-signal",
  ghost: "border border-line hover:border-signal hover:text-signal",
};

/**
 * Botón/enlace de acción (DESIGN.md §9.1). Siempre incluye la flecha a la
 * derecha. Polimórfico: `to` renderiza `<Link>` (ruta interna), `href`
 * renderiza `<a>` (externa), sin ninguno de los dos renderiza `<button>`.
 */
function Cta({ children, variant = "primary", to, href, type = "button", className, ...props }) {
  const classes = cn(
    "group inline-flex min-h-11 items-center gap-2 rounded-adt px-6 text-[0.8125rem] font-bold uppercase tracking-[0.06em] transition-colors duration-[var(--adt-dur-fast)] ease-adt",
    VARIANT_CLASSES[variant],
    className
  );

  const arrow = (
    <ArrowRight
      className="h-[15px] w-[15px] shrink-0 transition-transform duration-[var(--adt-dur-fast)] ease-adt group-hover:translate-x-[3px]"
      strokeWidth={2.5}
    />
  );

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
        {arrow}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
        {arrow}
      </a>
    );
  }

  return (
    <button type={type} className={classes} {...props}>
      {children}
      {arrow}
    </button>
  );
}

Cta.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(["primary", "ghost"]),
  to: PropTypes.string,
  href: PropTypes.string,
  type: PropTypes.string,
  className: PropTypes.string,
};

export default Cta;
