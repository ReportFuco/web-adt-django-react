import { useQueryClient } from "@tanstack/react-query";
import { qk } from "./keys";
import { fetchNoticia, fetchEvento, fetchEntrevista } from "./fetchers";

// F4 (PLAN-TANSTACK-QUERY.md): precarga el detalle al pasar el mouse/foco
// sobre una tarjeta, para que abrir el detalle sea casi instantáneo.
export function usePrefetchDetail() {
  const queryClient = useQueryClient();

  const prefetchNoticia = (slug) => {
    if (!slug) return;
    queryClient.prefetchQuery({ queryKey: qk.noticias.detail(slug), queryFn: () => fetchNoticia(slug) });
  };

  const prefetchEvento = (slug) => {
    if (!slug) return;
    queryClient.prefetchQuery({ queryKey: qk.eventos.detail(slug), queryFn: () => fetchEvento(slug) });
  };

  const prefetchEntrevista = (slug) => {
    if (!slug) return;
    queryClient.prefetchQuery({ queryKey: qk.entrevistas.detail(slug), queryFn: () => fetchEntrevista(slug) });
  };

  return { prefetchNoticia, prefetchEvento, prefetchEntrevista };
}
