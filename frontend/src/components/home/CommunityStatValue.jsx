import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import useInViewOnce from "../../hooks/useInViewOnce";
import { formatCommunityStat } from "../../utils/formatCommunityStat";

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Contador de cifras de comunidad (Fase 7 §D.3): requestAnimationFrame +
 * useInViewOnce en vez de conectar NumberTicker (Magic UI/motion) para no
 * sumar esa dependencia al bundle del home solo por esta animación. Con
 * `prefers-reduced-motion`, muestra el valor final de inmediato; el texto
 * accesible es siempre el número ya formateado, sin aria-live que anuncie
 * cada frame.
 */
function CommunityStatValue({ value, durationMs = 900, className }) {
  const [ref, inView] = useInViewOnce();
  const [display, setDisplay] = useState(() => (prefersReducedMotion() ? value : 0));

  useEffect(() => {
    if (!inView || prefersReducedMotion()) {
      setDisplay(value);
      return undefined;
    }

    const start = performance.now();
    let frame = requestAnimationFrame(function tick(now) {
      const progress = Math.min(1, (now - start) / durationMs);
      setDisplay(Math.round(value * progress));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    });

    return () => cancelAnimationFrame(frame);
  }, [inView, value, durationMs]);

  return (
    <span ref={ref} className={className}>
      {formatCommunityStat(display)}
    </span>
  );
}

CommunityStatValue.propTypes = {
  value: PropTypes.number.isRequired,
  durationMs: PropTypes.number,
  className: PropTypes.string,
};

export default CommunityStatValue;
