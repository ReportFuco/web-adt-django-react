import { useEffect, useState } from "react";
import {
  getAnunciosByUbicacion,
  getEvents,
  getGaleria,
  getInterview,
  getNoticias,
} from "../services/api";

const AD_LOCATIONS = {
  betweenNewsEvents: "home_between_news_events",
  betweenEventsInterviews: "home_between_events_interviews",
  afterInterviews: "home_after_interviews",
};

const INITIAL_GROUP = { loading: true, data: null, error: null };

/**
 * Carga los datos del home por módulo independiente (Fase 7 —
 * PLAN-FASE7-POLISH.md §C): cada grupo resuelve su propio
 * {loading, data, error} apenas terminan sus requests, sin esperar al resto,
 * para que MainPage pueda sustituir solo el skeleton de ese grupo. `heroNews`
 * cubre hero + apoyo + lista de noticias porque las tres vistas se arman a
 * partir de las mismas dos llamadas (destacadas + todas las noticias) sin
 * duplicar historias entre ellas.
 */
function useHomeData() {
  const [heroNews, setHeroNews] = useState(INITIAL_GROUP);
  const [events, setEvents] = useState(INITIAL_GROUP);
  const [interviews, setInterviews] = useState(INITIAL_GROUP);
  const [gallery, setGallery] = useState(INITIAL_GROUP);
  const [ads, setAds] = useState(INITIAL_GROUP);

  useEffect(() => {
    let cancelled = false;

    Promise.all([getNoticias({ destacado: true }), getNoticias()]).then(
      ([destacadasRes, allNoticiasRes]) => {
        if (cancelled) return;

        const destacadas = destacadasRes.results;
        const fillerNoticias = allNoticiasRes.results.filter(
          (noticia) => !destacadas.some((destacada) => destacada.id === noticia.id)
        );
        const heroPool = [...destacadas, ...fillerNoticias].slice(0, 5);
        const [, ...heroSupportSource] = heroPool;
        const heroSupportItems = heroSupportSource.map((noticia) => ({
          id: noticia.id,
          href: `/noticias/${noticia.id}/${noticia.slug}`,
          titulo: noticia.titulo,
          imagen: noticia.imagen,
          tag: "Noticias",
        }));

        const heroIds = new Set(heroPool.map((noticia) => noticia.id));
        const newsListItems = allNoticiasRes.results
          .filter((noticia) => !heroIds.has(noticia.id))
          .slice(0, 4);

        setHeroNews({
          loading: false,
          error: destacadasRes.error || allNoticiasRes.error || null,
          data: { heroSlides: heroPool, heroSupportItems, newsListItems },
        });
      }
    );

    getEvents({ proximos: true }).then((res) => {
      if (cancelled) return;
      setEvents({ loading: false, error: res.error || null, data: res.results });
    });

    getInterview().then((res) => {
      if (cancelled) return;
      setInterviews({ loading: false, error: res.error || null, data: res.results.slice(0, 3) });
    });

    getGaleria({ limit: 6 }).then((res) => {
      if (cancelled) return;
      setGallery({ loading: false, error: res.error || null, data: res.results });
    });

    Promise.all([
      getAnunciosByUbicacion(AD_LOCATIONS.betweenNewsEvents),
      getAnunciosByUbicacion(AD_LOCATIONS.betweenEventsInterviews),
      getAnunciosByUbicacion(AD_LOCATIONS.afterInterviews),
    ]).then(([adsA, adsB, adsC]) => {
      if (cancelled) return;
      setAds({
        loading: false,
        error: null,
        data: {
          betweenNewsEvents: adsA.results[0] || null,
          betweenEventsInterviews: adsB.results[0] || null,
          afterInterviews: adsC.results[0] || null,
        },
      });
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return { heroNews, events, interviews, gallery, ads };
}

export default useHomeData;
