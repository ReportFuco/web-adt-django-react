import { useEffect, useState } from "react";
import PropTypes from "prop-types";

import Seo from "../../components/common/Seo";
import Hero from "../../components/home/Hero";
import HeroSupport from "../../components/home/HeroSupport";
import Headlines from "../../components/home/Headlines";
import Gallery from "../../components/home/Gallery";
import CommunityStats from "../../components/home/CommunityStats";
import ContactForm from "../../components/home/ContactForm";
import NewsList from "../../components/content/NewsList";
import EventCards from "../../components/content/EventCards";
import InterviewGrid from "../../components/content/InterviewGrid";
import SectionHead from "../../components/ui/SectionHead";
import AdSlot from "../../components/ui/AdSlot";
import LoadingState from "../../components/ui/LoadingState";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";
import {
  getAnunciosByUbicacion,
  getEvents,
  getGaleria,
  getInterview,
  getNoticias,
  trackAnuncioClick,
} from "../../services/api";

const AD_LOCATIONS = {
  betweenNewsEvents: "home_between_news_events",
  betweenEventsInterviews: "home_between_events_interviews",
  afterInterviews: "home_after_interviews",
};

/**
 * Carga y arma los datos del home (PLAN.md Fase 4). Cada módulo declara su
 * selector: hero = 1 destacada + 4 apoyo sin duplicar; noticias = últimas
 * excluyendo el hero; eventos = próximos (excluye pasados aunque
 * `fecha_hora` tenga fallback histórico, ver views.py `proximos`).
 */
function useHomeData() {
  const [state, setState] = useState({ loading: true });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const [destacadasRes, allNoticiasRes, proximosRes, entrevistasRes, galeriaRes, adsA, adsB, adsC] =
        await Promise.all([
          getNoticias({ destacado: true }),
          getNoticias(),
          getEvents({ proximos: true }),
          getInterview(),
          getGaleria({ limit: 6 }),
          getAnunciosByUbicacion(AD_LOCATIONS.betweenNewsEvents),
          getAnunciosByUbicacion(AD_LOCATIONS.betweenEventsInterviews),
          getAnunciosByUbicacion(AD_LOCATIONS.afterInterviews),
        ]);
      if (cancelled) return;

      const destacadas = destacadasRes.results;
      const fillerNoticias = allNoticiasRes.results.filter(
        (noticia) => !destacadas.some((destacada) => destacada.id === noticia.id)
      );
      const heroPool = [...destacadas, ...fillerNoticias].slice(0, 5);
      const [heroLead, ...heroSupportSource] = heroPool;
      const heroSupportItems = heroSupportSource.map((noticia) => ({
        id: noticia.id,
        href: `/noticias/${noticia.id}/${noticia.slug}`,
        titulo: noticia.titulo,
        imagen: noticia.imagen,
        tag: "Noticias",
      }));

      const heroIds = new Set(heroPool.map((noticia) => noticia.id));
      const newsListItems = allNoticiasRes.results.filter((noticia) => !heroIds.has(noticia.id)).slice(0, 4);

      setState({
        loading: false,
        heroLead,
        heroSupportItems,
        heroError: destacadasRes.error || allNoticiasRes.error,
        newsListItems,
        newsError: allNoticiasRes.error,
        eventos: proximosRes.results,
        eventosError: proximosRes.error,
        entrevistas: entrevistasRes.results.slice(0, 3),
        entrevistasError: entrevistasRes.error,
        galeria: galeriaRes.results,
        ads: {
          betweenNewsEvents: adsA.results[0] || null,
          betweenEventsInterviews: adsB.results[0] || null,
          afterInterviews: adsC.results[0] || null,
        },
      });
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}

function AdBillboard({ anuncio }) {
  if (!anuncio) return null;
  return (
    <div className="wrap py-12">
      <AdSlot
        variant="billboard"
        title={anuncio.titulo}
        href={anuncio.enlace}
        ctaLabel={anuncio.cta_text || "Ver más"}
        onCtaClick={() => trackAnuncioClick(anuncio.id)}
      />
    </div>
  );
}

AdBillboard.propTypes = {
  anuncio: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    titulo: PropTypes.string,
    enlace: PropTypes.string,
    cta_text: PropTypes.string,
  }),
};

function MainPage() {
  const data = useHomeData();

  if (data.loading) {
    return <LoadingState label="Cargando el home…" className="min-h-[60vh]" />;
  }

  return (
    <>
      <Seo
        title="Adictos al Techno | Noticias de techno, eventos y cultura electrónica"
        description="Noticias de techno, eventos electrónicos, entrevistas y cultura club en Chile y el mundo. Sigue la escena techno, artistas, lanzamientos y festivales en Adictos al Techno."
        canonical="https://adictosaltechno.com/"
        schema={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Adictos al Techno",
          url: "https://adictosaltechno.com/",
          inLanguage: "es-CL",
          description: "Noticias de techno, eventos electrónicos, entrevistas y cultura club en Chile y el mundo.",
        }}
      />

      {data.heroLead ? (
        <section className="wrap grid grid-cols-1 gap-6 pt-6 pb-12 min-[960px]:grid-cols-[1.4fr_1fr] min-[1101px]:grid-cols-[1.7fr_1fr]" aria-labelledby="hero-heading">
          <h2 className="sr-only" id="hero-heading">
            Historia principal
          </h2>
          <Hero noticia={data.heroLead} />
          <HeroSupport items={data.heroSupportItems} />
        </section>
      ) : (
        <div className="wrap py-12">
          {data.heroError ? (
            <ErrorState description="No se pudo cargar la portada." />
          ) : (
            <EmptyState description="Todavía no hay noticias destacadas para mostrar en portada." />
          )}
        </div>
      )}

      <Headlines eventos={data.eventos.slice(0, 3)} />

      <AdBillboard anuncio={data.ads.betweenNewsEvents} />

      <section className="wrap py-24" aria-labelledby="news-heading">
        <SectionHead
          kicker="Noticias"
          title="Últimas noticias"
          headingId="news-heading"
          linkTo="/noticias"
          linkLabel="Ver todas las noticias"
        />
        {data.newsListItems.length ? (
          <NewsList noticias={data.newsListItems} />
        ) : data.newsError ? (
          <ErrorState description="No se pudieron cargar las noticias." />
        ) : (
          <EmptyState description="Todavía no hay noticias publicadas." />
        )}
      </section>

      <section className="wrap py-24" aria-labelledby="events-heading">
        <SectionHead
          kicker="Eventos"
          title="Próximos eventos"
          headingId="events-heading"
          linkTo="/eventos"
          linkLabel="Ver calendario completo"
        />
        {data.eventos.length ? (
          <EventCards eventos={data.eventos.slice(0, 4)} />
        ) : data.eventosError ? (
          <ErrorState description="No se pudieron cargar los eventos." />
        ) : (
          <EmptyState description="No hay eventos próximos por ahora." />
        )}
      </section>

      <AdBillboard anuncio={data.ads.betweenEventsInterviews} />

      <section className="wrap py-24" aria-labelledby="interviews-heading">
        <SectionHead
          kicker="Entrevistas"
          title="Voces de la escena"
          headingId="interviews-heading"
          linkTo="/entrevistas"
          linkLabel="Ver todas las entrevistas"
        />
        {data.entrevistas.length ? (
          <InterviewGrid entrevistas={data.entrevistas} />
        ) : data.entrevistasError ? (
          <ErrorState description="No se pudieron cargar las entrevistas." />
        ) : (
          <EmptyState description="Todavía no hay entrevistas publicadas." />
        )}
      </section>

      <AdBillboard anuncio={data.ads.afterInterviews} />

      {data.galeria.length > 0 && (
        <section className="bg-bg-soft py-24" aria-labelledby="gallery-heading">
          <div className="wrap">
            <SectionHead
              kicker="Escena"
              title="Galería"
              headingId="gallery-heading"
              linkTo="/cultura"
              linkLabel="Ver galería completa"
            />
            <Gallery fotos={data.galeria} />
          </div>
        </section>
      )}

      <section className="wrap py-24" aria-labelledby="community-heading">
        <h2 className="sr-only" id="community-heading">
          Comunidad
        </h2>
        <CommunityStats />
      </section>

      <ContactForm />
    </>
  );
}

export default MainPage;
