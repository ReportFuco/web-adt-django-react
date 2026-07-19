import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Pause, Play } from "lucide-react";
import LinkGlyph from "./LinkGlyph";

/**
 * Ticker de titulares en loop horizontal (DESIGN.md §9.4/§5). Reemplaza
 * `react-fast-marquee`. La lista se duplica para un loop perfecto (la
 * segunda mitad es `aria-hidden`); un botón de pausa y
 * `prefers-reduced-motion` detienen la animación — escuchando *cambios*,
 * no solo el valor al montar (AUDITORIA.md defecto #5/#9.4).
 */
function Ticker({ items, onItemClick }) {
  const [userPaused, setUserPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = (event) => setReducedMotion(event.matches);
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  if (!items?.length) return null;

  const isPaused = userPaused || reducedMotion;

  const renderItems = (hidden) =>
    items.map((item) => (
      <li key={`${hidden ? "dup" : "orig"}-${item.id}`} aria-hidden={hidden || undefined}>
        <LinkGlyph size={12} className="text-signal" />
        {item.href ? (
          <a href={item.href} onClick={() => onItemClick?.(item)} tabIndex={hidden ? -1 : 0}>
            {item.label}
          </a>
        ) : (
          <span>{item.label}</span>
        )}
      </li>
    ));

  return (
    <div
      role="region"
      aria-label="Titulares en rotación"
      className="group flex items-center gap-4 border-t border-line bg-bg-soft px-4"
    >
      <div className="flex-1 overflow-hidden">
        <ul
          className="flex w-max animate-[adt-ticker_26s_linear_infinite] gap-16 whitespace-nowrap py-[9px] text-xs font-semibold uppercase tracking-[0.08em] text-text-soft [&_a:hover]:text-signal [&_a]:no-underline [&_li]:flex [&_li]:items-center [&_li]:gap-2 group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]"
          style={isPaused ? { animationPlayState: "paused" } : undefined}
        >
          {renderItems(false)}
          {renderItems(true)}
        </ul>
      </div>
      <button
        type="button"
        onClick={() => setUserPaused((prev) => !prev)}
        aria-pressed={isPaused}
        aria-label={isPaused ? "Reanudar titulares" : "Pausar titulares"}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-adt text-text-muted hover:text-text"
      >
        {isPaused ? <Play className="h-3.5 w-3.5" fill="currentColor" /> : <Pause className="h-3.5 w-3.5" fill="currentColor" />}
      </button>
    </div>
  );
}

Ticker.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired,
      href: PropTypes.string,
    })
  ).isRequired,
  onItemClick: PropTypes.func,
};

export default Ticker;
