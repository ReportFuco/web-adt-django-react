import { useQuery } from "@tanstack/react-query";
import { qk } from "../queries/keys";
import { fetchAnuncios, fetchEventos, fetchEntrevistas, fetchGaleria, fetchNoticias } from "../queries/fetchers";

const AD_LOCATIONS = {
  betweenNewsEvents: "home_between_news_events",
  betweenEventsInterviews: "home_between_events_interviews",
  afterInterviews: "home_after_interviews",
};

const toGroup = ({ isLoading, data, error }) => ({
  loading: isLoading,
  data: data ?? null,
  error: error ?? null,
});

async function fetchHeroNews() {
  const [destacadasRes, allNoticiasRes] = await Promise.all([
    fetchNoticias({ destacado: true }),
    fetchNoticias(),
  ]);

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

  return { heroSlides: heroPool, heroSupportItems, newsListItems };
}

async function fetchHomeAds() {
  const [adsA, adsB, adsC] = await Promise.all([
    fetchAnuncios(AD_LOCATIONS.betweenNewsEvents),
    fetchAnuncios(AD_LOCATIONS.betweenEventsInterviews),
    fetchAnuncios(AD_LOCATIONS.afterInterviews),
  ]);
  return {
    betweenNewsEvents: adsA.results[0] || null,
    betweenEventsInterviews: adsB.results[0] || null,
    afterInterviews: adsC.results[0] || null,
  };
}

/**
 * Carga los datos del home por módulo independiente (Fase 7 —
 * PLAN-FASE7-POLISH.md §C), ahora sobre React Query (PLAN-TANSTACK-QUERY.md
 * F2): cada grupo es un useQuery propio que resuelve su {loading, data,
 * error} sin esperar al resto, para que MainPage sustituya solo el skeleton
 * de ese grupo. `heroNews` cubre hero + apoyo + lista de noticias porque las
 * tres vistas se arman a partir de las mismas dos llamadas (destacadas +
 * todas las noticias) sin duplicar historias entre ellas.
 */
function useHomeData() {
  const heroNewsQuery = useQuery({ queryKey: qk.home.heroNews(), queryFn: fetchHeroNews });

  const eventsQuery = useQuery({
    queryKey: qk.eventos.list({ proximos: true }),
    queryFn: () => fetchEventos({ proximos: true }),
    select: (data) => data.results,
  });

  const interviewsQuery = useQuery({
    queryKey: qk.entrevistas.list(),
    queryFn: () => fetchEntrevistas(),
    select: (data) => data.results.slice(0, 3),
  });

  const galleryQuery = useQuery({
    queryKey: qk.galeria({ limit: 6 }),
    queryFn: () => fetchGaleria({ limit: 6 }),
    select: (data) => data.results,
  });

  const adsQuery = useQuery({ queryKey: qk.home.ads(), queryFn: fetchHomeAds });

  return {
    heroNews: toGroup(heroNewsQuery),
    events: toGroup(eventsQuery),
    interviews: toGroup(interviewsQuery),
    gallery: toGroup(galleryQuery),
    ads: toGroup(adsQuery),
  };
}

export default useHomeData;
