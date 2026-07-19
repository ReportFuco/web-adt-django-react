import PropTypes from "prop-types";

import Seo from "../../components/common/Seo";
import Hero from "../../components/home/Hero";
import HeroSkeleton from "../../components/home/HeroSkeleton";
import HeroSupport from "../../components/home/HeroSupport";
import HeroSupportSkeleton from "../../components/home/HeroSupportSkeleton";
import Headlines from "../../components/home/Headlines";
import HeadlinesSkeleton from "../../components/home/HeadlinesSkeleton";
import Gallery from "../../components/home/Gallery";
import GallerySkeleton from "../../components/home/GallerySkeleton";
import CommunityStats from "../../components/home/CommunityStats";
import ContactForm from "../../components/home/ContactForm";
import NewsList from "../../components/content/NewsList";
import NewsListSkeleton from "../../components/content/NewsListSkeleton";
import EventCards from "../../components/content/EventCards";
import EventCardsSkeleton from "../../components/content/EventCardsSkeleton";
import InterviewGrid from "../../components/content/InterviewGrid";
import InterviewGridSkeleton from "../../components/content/InterviewGridSkeleton";
import SectionHead from "../../components/ui/SectionHead";
import AdSlot from "../../components/ui/AdSlot";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";
import { trackAnuncioClick } from "../../services/api";
import useHomeData from "../../hooks/useHomeData";

/**
 * Placeholder de anuncio (Fase 7 §C): mientras `ads` está loading reserva el
 * alto del billboard para no insertarlo tarde encima de contenido visible;
 * si ya resolvió y no hay anuncio para esa ubicación, no ocupa espacio.
 */
function AdBillboard({ anuncio, loading }) {
  if (loading) {
    return (
      <div className="wrap py-12">
        <div aria-hidden="true" className="min-h-[220px]" />
      </div>
    );
  }
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
  loading: PropTypes.bool,
};

function MainPage() {
  const { heroNews, events, interviews, gallery, ads } = useHomeData();

  const heroSlides = heroNews.data?.heroSlides ?? [];
  const heroSupportItems = heroNews.data?.heroSupportItems ?? [];
  const newsListItems = heroNews.data?.newsListItems ?? [];
  const eventosList = events.data ?? [];
  const entrevistasList = interviews.data ?? [];
  const galeriaList = gallery.data ?? [];
  const adsData = ads.data ?? {};

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

      {heroNews.loading ? (
        <section
          className="wrap grid grid-cols-1 gap-6 pt-6 pb-12 min-[960px]:grid-cols-[1.4fr_1fr] min-[1101px]:grid-cols-[1.7fr_1fr]"
          aria-labelledby="hero-heading"
        >
          <h2 className="sr-only" id="hero-heading">
            Historia principal
          </h2>
          <HeroSkeleton />
          <HeroSupportSkeleton />
        </section>
      ) : heroSlides.length ? (
        <section
          className="wrap grid grid-cols-1 gap-6 pt-6 pb-12 min-[960px]:grid-cols-[1.4fr_1fr] min-[1101px]:grid-cols-[1.7fr_1fr]"
          aria-labelledby="hero-heading"
        >
          <h2 className="sr-only" id="hero-heading">
            Historia principal
          </h2>
          <Hero slides={heroSlides} />
          <HeroSupport items={heroSupportItems} />
        </section>
      ) : (
        <div className="wrap py-12">
          {heroNews.error ? (
            <ErrorState description="No se pudo cargar la portada." />
          ) : (
            <EmptyState description="Todavía no hay noticias destacadas para mostrar en portada." />
          )}
        </div>
      )}

      {events.loading ? <HeadlinesSkeleton /> : <Headlines eventos={eventosList.slice(0, 3)} />}

      <AdBillboard anuncio={adsData.betweenNewsEvents} loading={ads.loading} />

      <section className="wrap py-24" aria-labelledby="news-heading">
        <SectionHead
          kicker="Noticias"
          title="Últimas noticias"
          headingId="news-heading"
          linkTo="/noticias"
          linkLabel="Ver todas las noticias"
        />
        {heroNews.loading ? (
          <NewsListSkeleton />
        ) : newsListItems.length ? (
          <NewsList noticias={newsListItems} />
        ) : heroNews.error ? (
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
        {events.loading ? (
          <EventCardsSkeleton />
        ) : eventosList.length ? (
          <EventCards eventos={eventosList.slice(0, 4)} />
        ) : events.error ? (
          <ErrorState description="No se pudieron cargar los eventos." />
        ) : (
          <EmptyState description="No hay eventos próximos por ahora." />
        )}
      </section>

      <AdBillboard anuncio={adsData.betweenEventsInterviews} loading={ads.loading} />

      <section className="wrap py-24" aria-labelledby="interviews-heading">
        <SectionHead
          kicker="Entrevistas"
          title="Voces de la escena"
          headingId="interviews-heading"
          linkTo="/entrevistas"
          linkLabel="Ver todas las entrevistas"
        />
        {interviews.loading ? (
          <InterviewGridSkeleton />
        ) : entrevistasList.length ? (
          <InterviewGrid entrevistas={entrevistasList} />
        ) : interviews.error ? (
          <ErrorState description="No se pudieron cargar las entrevistas." />
        ) : (
          <EmptyState description="Todavía no hay entrevistas publicadas." />
        )}
      </section>

      <AdBillboard anuncio={adsData.afterInterviews} loading={ads.loading} />

      {gallery.loading ? (
        <section className="bg-bg-soft py-24" aria-labelledby="gallery-heading">
          <div className="wrap">
            <SectionHead
              kicker="Escena"
              title="Galería"
              headingId="gallery-heading"
              linkTo="/cultura"
              linkLabel="Ver galería completa"
            />
            <GallerySkeleton />
          </div>
        </section>
      ) : gallery.error ? (
        <section className="bg-bg-soft py-24" aria-labelledby="gallery-heading">
          <div className="wrap">
            <SectionHead
              kicker="Escena"
              title="Galería"
              headingId="gallery-heading"
              linkTo="/cultura"
              linkLabel="Ver galería completa"
            />
            <ErrorState description="No se pudo cargar la galería." />
          </div>
        </section>
      ) : (
        galeriaList.length > 0 && (
          <section className="bg-bg-soft py-24" aria-labelledby="gallery-heading">
            <div className="wrap">
              <SectionHead
                kicker="Escena"
                title="Galería"
                headingId="gallery-heading"
                linkTo="/cultura"
                linkLabel="Ver galería completa"
              />
              <Gallery fotos={galeriaList} />
            </div>
          </section>
        )
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
