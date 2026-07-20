import { useQuery } from "@tanstack/react-query";
import { qk } from "../queries/keys";
import { fetchRedes } from "../queries/fetchers";

// Mismos valores que la siembra inicial del backend
// (backend_django/noticias/migrations/0018_seed_redes_sociales.py), para que
// el header/footer nunca queden sin íconos si el endpoint tarda o falla.
const FALLBACK_REDES = [
  { id: "instagram", red: "instagram", label: "Instagram", url: "https://www.instagram.com/adictos_al_techno/", contador: 169986 },
  { id: "whatsapp", red: "whatsapp", label: "Comunidad de WhatsApp", url: "https://chat.whatsapp.com/HGiCQbH6KOdKE1VKbxpKgV?s=sh&p=i&ilr=4", contador: 1001 },
  { id: "spotify", red: "spotify", label: "Spotify", url: "https://open.spotify.com/playlist/4uDeR4NrQHknGI4XMVEwRH?si=65BaoIh9RC-JPxE7NokKdQ", contador: 229 },
  { id: "tiktok", red: "tiktok", label: "TikTok", url: "https://www.tiktok.com/@adictos.al.techno?_t=ZM-8vv8jszOOKz&_r=1", contador: 280 },
];

/**
 * Redes sociales (links + contadores de comunidad) editables desde el admin
 * (modelo `RedSocial`). Header, Footer y CommunityStats montan este hook por
 * separado; React Query dedupe los 3 montajes bajo la misma queryKey en vez
 * del `sharedPromise` manual anterior. Mientras carga o si el backend falla
 * o devuelve vacío, se usa `FALLBACK_REDES` para que la navegación nunca
 * quede sin íconos.
 */
function useRedesSociales() {
  const { data, isPending, error } = useQuery({
    queryKey: qk.redes(),
    queryFn: fetchRedes,
    staleTime: 30 * 60 * 1000,
  });

  const useFallback = isPending || Boolean(error) || data?.results.length === 0;

  return {
    loading: isPending,
    redes: useFallback ? FALLBACK_REDES : data.results,
    error: error ?? null,
  };
}

export default useRedesSociales;
