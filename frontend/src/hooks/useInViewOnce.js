import { useEffect, useRef, useState } from "react";

/**
 * Detecta si un elemento entró al viewport, una sola vez (Fase 7 §D.2 —
 * reveal de contenedores principales del home). Si `IntersectionObserver`
 * no existe, el contenido queda visible de inmediato: este hook solo anima
 * la entrada, nunca debe ser la razón por la que algo no se muestra.
 */
function useInViewOnce({ threshold = 0.15 } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView];
}

export default useInViewOnce;
