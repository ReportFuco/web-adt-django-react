import PropTypes from "prop-types";
import { cn } from "@/lib/utils";
import LinkGlyph from "./LinkGlyph";

const RATIOS = {
  "169": "aspect-video",
  "32": "aspect-[3/2]",
  "43": "aspect-[4/3]",
  "45": "aspect-[4/5]",
  "11": "aspect-square",
};

/**
 * Contenedor de fotografía documental (DESIGN.md §7). Reserva espacio con
 * `aspect-ratio` y muestra un placeholder (eslabón de marca) mientras no hay
 * `src`. A diferencia del mock (que usa `background-image`), en producción
 * siempre renderiza un `<img>` real con `alt`, `loading` y `decoding`
 * (PLAN.md — "Desviaciones conocidas del mock"). Los consumidores envuelven
 * este componente en `<Link>`/`<a>` cuando la foto es interactiva.
 */
function Media({
  ratio = "43",
  src,
  alt = "",
  credit,
  creditPosition = "bottom",
  priority = false,
  zoom = false,
  className,
}) {
  return (
    <div className={cn("relative isolate overflow-hidden bg-surface", RATIOS[ratio], className)}>
      {src ? (
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className={cn(
            "absolute inset-0 h-full w-full object-cover",
            zoom &&
              "transition-transform duration-[var(--adt-dur-med)] ease-[var(--adt-ease-standard)] group-hover:scale-105"
          )}
        />
      ) : (
        <div
          className="absolute inset-0 flex items-center justify-center bg-surface-raised text-text-muted/60"
          aria-hidden="true"
        >
          <LinkGlyph size={40} />
        </div>
      )}
      {credit && (
        <span
          className={cn(
            "absolute left-2 z-[1] bg-black/55 px-[7px] py-[3px] text-[0.6875rem] uppercase tracking-[0.06em] text-on-photo",
            creditPosition === "top" ? "top-2" : "bottom-2"
          )}
        >
          {credit}
        </span>
      )}
    </div>
  );
}

Media.propTypes = {
  ratio: PropTypes.oneOf(["169", "32", "43", "45", "11"]),
  src: PropTypes.string,
  alt: PropTypes.string,
  credit: PropTypes.string,
  creditPosition: PropTypes.oneOf(["top", "bottom"]),
  priority: PropTypes.bool,
  zoom: PropTypes.bool,
  className: PropTypes.string,
};

export default Media;
