import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// React Router no resetea el scroll al navegar (a diferencia de una
// navegación MPA tradicional): sin esto, entrar a un detalle desde la mitad
// de un listado deja la página nueva ya scrolleada. Solo reacciona a
// cambios de pathname (no de `search`), para no interferir con el
// aria-busy/keepPreviousData de paginación (?page=2 en la misma ruta).
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}

export default ScrollToTop;
