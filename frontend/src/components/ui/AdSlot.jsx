import PropTypes from "prop-types";
import { cn } from "@/lib/utils";
import Cta from "./Cta";

const VARIANT_MIN_HEIGHT = {
  leaderboard: "min-h-24", // 96px
  billboard: "min-h-[220px]",
};

/**
 * Slot de publicidad (DESIGN.md §9.7). A diferencia del mock, la etiqueta
 * "Publicidad" es texto real en el DOM (no un `::before`), para que sea
 * accesible y no dependa de que el CSS cargue.
 */
function AdSlot({ variant = "leaderboard", title, href, ctaLabel = "Ver más", note, onCtaClick, className }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 border border-line bg-bg-soft px-6 py-8 text-center text-text-muted",
        VARIANT_MIN_HEIGHT[variant],
        className
      )}
    >
      <span className="self-start text-[0.5625rem] font-bold uppercase tracking-[0.12em] text-text-muted">
        Publicidad
      </span>
      {title && (
        <p className="max-w-[40ch] font-body text-lg font-bold leading-snug text-text">{title}</p>
      )}
      {href && (
        <Cta variant="ghost" href={href} onClick={onCtaClick}>
          {ctaLabel}
        </Cta>
      )}
      {note && <span className="text-xs uppercase tracking-[0.1em] tabular-nums">{note}</span>}
    </div>
  );
}

AdSlot.propTypes = {
  variant: PropTypes.oneOf(["leaderboard", "billboard"]),
  title: PropTypes.node,
  href: PropTypes.string,
  ctaLabel: PropTypes.node,
  note: PropTypes.node,
  onCtaClick: PropTypes.func,
  className: PropTypes.string,
};

export default AdSlot;

/**
 * Variante inline para contenido patrocinado dentro del flujo editorial
 * (DESIGN.md §9.7): borde punteado, opacidad reducida.
 */
export function SponsoredSlot({ title, imageSrc, imageAlt = "", href, ctaLabel = "Ver más", className }) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-6 rounded-adt border border-dashed border-line p-6 opacity-[0.86]",
        className
      )}
    >
      <div className="flex h-24 w-24 shrink-0 items-center justify-center bg-surface-raised text-center text-[0.625rem] uppercase tracking-[0.08em] text-text-muted">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={imageAlt}
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : (
          "Publicidad"
        )}
      </div>
      <div className="min-w-0">
        <span className="mb-1 block text-[0.625rem] font-bold uppercase tracking-[0.1em] text-text-muted">
          Publicidad
        </span>
        <p className="font-body text-base font-semibold text-text">{title}</p>
      </div>
      {href && (
        <Cta variant="ghost" href={href} className="ml-auto">
          {ctaLabel}
        </Cta>
      )}
    </div>
  );
}

SponsoredSlot.propTypes = {
  title: PropTypes.node,
  imageSrc: PropTypes.string,
  imageAlt: PropTypes.string,
  href: PropTypes.string,
  ctaLabel: PropTypes.node,
  className: PropTypes.string,
};
