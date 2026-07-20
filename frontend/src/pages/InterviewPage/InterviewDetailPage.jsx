import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Instagram } from "lucide-react";

import { qk } from "../../queries/keys";
import { fetchEntrevista, fetchEntrevistas } from "../../queries/fetchers";
import ErrorState from "../../components/ui/ErrorState";
import DetailHero from "../../components/content/DetailHero";
import DetailGallery from "../../components/content/DetailGallery";
import DetailPageSkeleton from "../../components/content/DetailPageSkeleton";
import InterviewGrid from "../../components/content/InterviewGrid";
import SectionHead from "../../components/ui/SectionHead";
import { MetaRow, MetaItem } from "../../components/ui/MetaRow";
import Seo from "../../components/common/Seo";
import { sanitizeHTML } from "../../utils/htmlSanitizer";
import { formatShortDate } from "../../utils/formatDate";
import { excerpt } from "../../utils/textExcerpt";

function InterviewDetailPage() {
  const { slug } = useParams();

  const interviewQuery = useQuery({
    queryKey: qk.entrevistas.detail(slug),
    queryFn: () => fetchEntrevista(slug),
    enabled: Boolean(slug),
    staleTime: 10 * 60 * 1000,
  });
  const relacionadasParams = { tag: undefined, page: 1 };
  const relacionadasQuery = useQuery({
    queryKey: qk.entrevistas.list(relacionadasParams),
    queryFn: () => fetchEntrevistas(relacionadasParams),
  });

  const interview = interviewQuery.data;
  const interviews = relacionadasQuery.data?.results ?? [];
  const loadError = interviewQuery.error || relacionadasQuery.error;

  const cleanContent = interview?.contenido ? sanitizeHTML(interview.contenido) : "";

  if (loadError) return <ErrorState className="my-24" description="No se pudo cargar la entrevista." />;
  if (!interview) return <DetailPageSkeleton type="entrevista" />;

  const interviewDescription = excerpt(interview.cita_destacada || interview.contenido || "", 160);
  const interviewUrl = `https://adictosaltechno.com/entrevistas/${slug}`;
  const relacionadas = interviews.filter((item) => item.id !== interview.id).slice(0, 3);

  return (
    <>
      <Seo
        title={`${interview.artista} | Entrevista techno | Adictos al Techno`}
        description={interviewDescription || `Entrevista a ${interview.artista} en Adictos al Techno.`}
        canonical={interviewUrl}
        image={interview.imagen_portada}
        type="article"
        schema={[
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: interview.artista,
            description: interviewDescription || interview.artista,
            image: interview.imagen_portada ? [interview.imagen_portada] : undefined,
            datePublished: interview.fecha_publicacion,
            author: interview.periodista ? [{ "@type": "Person", name: interview.periodista }] : undefined,
            mainEntityOfPage: interviewUrl,
            keywords: Array.isArray(interview.tags) ? interview.tags.map((tag) => tag.nombre ?? tag).join(", ") : "entrevista techno, música electrónica",
            publisher: {
              "@type": "Organization",
              name: "Adictos al Techno",
              logo: { "@type": "ImageObject", url: "https://adictosaltechno.com/logo-social.jpg" },
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Inicio", item: "https://adictosaltechno.com/" },
              { "@type": "ListItem", position: 2, name: "Entrevistas", item: "https://adictosaltechno.com/entrevistas" },
              { "@type": "ListItem", position: 3, name: interview.artista, item: interviewUrl },
            ],
          },
        ]}
      />

      <DetailHero
        kicker="Entrevistas"
        title={interview.artista}
        breadcrumbItems={[{ label: "Inicio", to: "/" }, { label: "Entrevistas", to: "/entrevistas" }, { label: interview.artista }]}
        imagen={interview.imagen_portada}
        imageAlt={`Retrato de ${interview.artista}`}
        grayscale
        dek={interview.rol_entrevistado}
        meta={
          <MetaRow className="flex-wrap items-center text-on-photo/70">
            {interview.periodista && <MetaItem>Entrevistado por {interview.periodista}</MetaItem>}
            {interview.fecha_publicacion && (
              <MetaItem icon={Calendar}>{formatShortDate(interview.fecha_publicacion)}</MetaItem>
            )}
            {interview.instagram && (
              <a
                href={`https://instagram.com/${interview.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-on-photo/30 px-4 py-2 text-on-photo hover:border-signal hover:text-signal"
              >
                <Instagram className="h-4 w-4" strokeWidth={2} />@{interview.instagram}
              </a>
            )}
          </MetaRow>
        }
        tags={interview.tags}
      />

      <div className="wrap flex flex-col gap-10 py-12">
        {interview.cita_destacada && (
          <blockquote className="border-l-2 border-signal pl-6 font-display text-2xl font-bold leading-tight text-text">
            &ldquo;{interview.cita_destacada}&rdquo;
          </blockquote>
        )}
        <article
          className="rich-content border border-line bg-surface p-6 text-text-soft md:p-10"
          dangerouslySetInnerHTML={{ __html: cleanContent }}
        />
        <DetailGallery fotos={interview.fotos} />
      </div>

      {relacionadas.length > 0 && (
        <section className="wrap py-12" aria-labelledby="related-interviews-heading">
          <SectionHead
            kicker="Entrevistas"
            title="Otras voces de la escena"
            headingId="related-interviews-heading"
            linkTo="/entrevistas"
            linkLabel="Ver todas"
          />
          <InterviewGrid entrevistas={relacionadas} />
        </section>
      )}
    </>
  );
}

export default InterviewDetailPage;
