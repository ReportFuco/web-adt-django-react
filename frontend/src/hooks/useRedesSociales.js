import { useEffect, useState } from "react";
import { getRedesSociales } from "../services/api";

// Mismos valores que la siembra inicial del backend
// (backend_django/noticias/migrations/0018_seed_redes_sociales.py), para que
// el header/footer nunca queden sin íconos si el endpoint tarda o falla.
const FALLBACK_REDES = [
  { id: "instagram", red: "instagram", label: "Instagram", url: "https://www.instagram.com/adictos_al_techno/", contador: 169986 },
  { id: "whatsapp", red: "whatsapp", label: "Comunidad de WhatsApp", url: "https://chat.whatsapp.com/HGiCQbH6KOdKE1VKbxpKgV?s=sh&p=i&ilr=4", contador: 1001 },
  { id: "spotify", red: "spotify", label: "Spotify", url: "https://open.spotify.com/playlist/4uDeR4NrQHknGI4XMVEwRH?si=65BaoIh9RC-JPxE7NokKdQ", contador: 229 },
  { id: "tiktok", red: "tiktok", label: "TikTok", url: "https://www.tiktok.com/@adictos.al.techno?_t=ZM-8vv8jszOOKz&_r=1", contador: 280 },
];

let sharedPromise = null;

function fetchRedesSociales() {
  if (!sharedPromise) {
    sharedPromise = getRedesSociales().then((res) => {
      if (res.error || res.results.length === 0) {
        sharedPromise = null; // permite reintentar en el próximo montaje
      }
      return res;
    });
  }
  return sharedPromise;
}

/**
 * Redes sociales (links + contadores de comunidad) editables desde el admin
 * (modelo `RedSocial`). Header, Footer y CommunityStats montan este hook por
 * separado; comparten una única promesa en memoria para no triplicar el
 * fetch en cada carga de página. Mientras carga o si el backend falla, se
 * usa `FALLBACK_REDES` para que la navegación nunca quede sin íconos.
 */
function useRedesSociales() {
  const [state, setState] = useState({ loading: true, redes: FALLBACK_REDES, error: null });

  useEffect(() => {
    let cancelled = false;
    fetchRedesSociales().then((res) => {
      if (cancelled) return;
      const useFallback = Boolean(res.error) || res.results.length === 0;
      setState({
        loading: false,
        redes: useFallback ? FALLBACK_REDES : res.results,
        error: res.error,
      });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}

export default useRedesSociales;
