import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Calendar, Instagram } from "lucide-react";

import { getInterviewBySlug, getInterview } from "../../services/api";
import LoadingState from "../../components/ui/LoadingState";
import ErrorState from "../../components/ui/ErrorState";
import DetailHero from "../../components/content/DetailHero";
import DetailGallery from "../../components/content/DetailGallery";
import InterviewGrid from "../../components/content/InterviewGrid";
import SectionHead from "../../components/ui/SectionHead";
import { MetaRow, MetaItem } from "../../components/ui/MetaRow";
import Seo from "../../components/common/Seo";
import { sanitizeHTML } from "../../utils/htmlSanitizer";
import { formatShortDate } from "../../utils/formatDate";

function InterviewDetailPage() {
  const { slug } = useParams();
  const [interview, setInterview] = useState(null);
  const [interviews, setInterviews] = useState([]);
  const [loadError, setLoadError] = useState(null);

  const cleanContent = interview?.contenido ? sanitizeHTML(interview.contenido) : "";

  useEffect(() => {
    let cancelled = false;
    async function loadInterviews() {
      try {
        if (slug) {
          const res = await getInterviewBySlug(slug);
          if (!cancelled) setInterview(res);
        }
        const { results, error } = await getInterview();
        if (cancelled) return;
        if (error) throw error;
        setInterviews(results);
      } catch (error) {
        console.error("Error al cargar la entrevista:", error);
        if (!cancelled) setLoadError(error);
      }
    }
    loadInterviews();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loadError) return <ErrorState className="my-24" description="No se pudo cargar la entrevista." />;
  if (!interview) return <LoadingState className="my-24" label="Cargando entrevista…" />;

  const interviewDescription = (interview.cita_destacada || interview.contenido || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160);
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
