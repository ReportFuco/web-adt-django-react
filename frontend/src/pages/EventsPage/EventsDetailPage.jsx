import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import parse from "html-react-parser";
import { Calendar, ExternalLink, MapPin } from "lucide-react";

import { getEventBySlug, getEvents } from "../../services/api";
import LoadingState from "../../components/ui/LoadingState";
import ErrorState from "../../components/ui/ErrorState";
import DetailHero from "../../components/content/DetailHero";
import DetailGallery from "../../components/content/DetailGallery";
import EventCards from "../../components/content/EventCards";
import SectionHead from "../../components/ui/SectionHead";
import { MetaRow, MetaItem } from "../../components/ui/MetaRow";
import Maps from "../../components/features/Maps";
import Seo from "../../components/common/Seo";
import { sanitizeHTML } from "../../utils/htmlSanitizer";
import { formatEventDateRange, formatFullEventDate, getEventDateItems } from "../../utils/eventDates";
import { excerpt } from "../../utils/textExcerpt";

function EventsDetailPage() {
  const { slug } = useParams();
  const [evento, setEvento] = useState(null);
  const [eventos, setEventos] = useState([]);
  const [loadError, setLoadError] = useState(null);

  const cleanContent = evento ? sanitizeHTML(evento.descripcion) : "";

  useEffect(() => {
    let cancelled = false;
    async function loadEvents() {
      try {
        if (slug) {
          const res = await getEventBySlug(slug);
          if (!cancelled) setEvento(res.data);
        }
        const { results, error } = await getEvents({ proximos: true });
        if (cancelled) return;
        if (error) throw error;
        setEventos(results);
      } catch (error) {
        console.error("Error al cargar el evento:", error);
        if (!cancelled) setLoadError(error);
      }
    }
    loadEvents();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loadError) return <ErrorState className="my-24" description="No se pudo cargar el evento." />;
  if (!evento) return <LoadingState className="my-24" label="Cargando evento…" />;

  const eventDescription = excerpt(evento.descripcion || "", 160);
  const eventUrl = `https://adictosaltechno.com/eventos/${evento.id}/${slug}`;
  const eventDates = getEventDateItems(evento);
  const primaryDate = eventDates[0]?.fecha || evento.fecha_hora;
  const dateSummary = formatEventDateRange(eventDates);
  const relacionados = eventos.filter((item) => item.id !== evento.id).slice(0, 4);

  return (
    <>
      <Seo
        title={`${evento.nombre} | Evento techno | Adictos al Techno`}
        description={eventDescription || `Detalles del evento techno ${evento.nombre} en Adictos al Techno.`}
        canonical={eventUrl}
        image={evento.imagen}
        type="article"
        schema={[
          {
            "@context": "https://schema.org",
            "@type": "Event",
            name: evento.nombre,
            description: eventDescription || evento.nombre,
            startDate: primaryDate,
            eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
            eventStatus: "https://schema.org/EventScheduled",
            image: evento.imagen ? [evento.imagen] : undefined,
            url: eventUrl,
            location: { "@type": "Place", name: evento.lugar, address: evento.direccion || evento.lugar },
            organizer: evento.organizacion ? { "@type": "Organization", name: evento.organizacion } : undefined,
            keywords: Array.isArray(evento.tags) ? evento.tags.map((tag) => tag.nombre ?? tag).join(", ") : "eventos techno, música electrónica",
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Inicio", item: "https://adictosaltechno.com/" },
              { "@type": "ListItem", position: 2, name: "Eventos", item: "https://adictosaltechno.com/eventos" },
              { "@type": "ListItem", position: 3, name: evento.nombre, item: eventUrl },
            ],
          },
        ]}
      />

      <DetailHero
        kicker="Eventos"
        title={evento.nombre}
        breadcrumbItems={[{ label: "Inicio", to: "/" }, { label: "Eventos", to: "/eventos" }, { label: evento.nombre }]}
        imagen={evento.imagen}
        imageAlt={evento.nombre}
        meta={
          <MetaRow className="text-on-photo/70">
            <MetaItem icon={MapPin}>{evento.lugar}</MetaItem>
            {dateSummary && <MetaItem icon={Calendar}>{dateSummary}</MetaItem>}
          </MetaRow>
        }
        tags={evento.tags}
      />

      <div className="wrap grid grid-cols-1 gap-8 py-12 min-[1101px]:grid-cols-[minmax(0,2fr)_380px]">
        <div className="flex flex-col gap-8">
          <article className="rich-content border border-line bg-surface p-6 text-text-soft md:p-10">
            {parse(cleanContent)}
          </article>

          <div className="grid gap-6 min-[721px]:grid-cols-2">
            <div className="border border-line bg-surface p-6">
              <p className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-text-muted">
                <Calendar className="h-4 w-4" /> Fechas
              </p>
              {eventDates.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {eventDates.map((dateItem, index) => (
                    <p key={dateItem.id ?? dateItem.fecha ?? index} className="font-body text-lg font-semibold normal-case">
                      {formatFullEventDate(dateItem.fecha)}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="font-body text-lg font-semibold normal-case">Fecha por confirmar</p>
              )}
            </div>
            <div className="border border-line bg-surface p-6">
              <p className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-text-muted">
                <MapPin className="h-4 w-4" /> Ubicación
              </p>
              <p className="font-body text-lg font-semibold normal-case">{evento.lugar}</p>
              {evento.direccion && <p className="mt-2 text-sm text-text-muted">{evento.direccion}</p>}
            </div>
          </div>

          <DetailGallery fotos={evento.fotos} />
        </div>

        <div className="flex flex-col gap-8">
          <div className="border border-line bg-surface p-6">
            <h2 className="mb-5 text-xl">Tickets</h2>
            {evento.website && (
              <a
                href={evento.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-11 w-full items-center justify-center gap-2 rounded-adt bg-text px-4 py-3 text-xs font-bold uppercase tracking-[0.1em] text-bg hover:bg-signal hover:text-on-signal"
              >
                <ExternalLink className="h-4 w-4" /> Sitio oficial
              </a>
            )}
            <div className="mt-6 border-t border-line pt-6">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.1em] text-text-muted">Organizado por</p>
              <p className="text-text-soft">{evento.organizacion || "Organización del evento"}</p>
            </div>
          </div>

          <div className="border border-line bg-surface p-6">
            <p className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-text-muted">
              <MapPin className="h-4 w-4" /> Ubicación
            </p>
            <div className="h-56 overflow-hidden border border-line">
              <Maps direccion={evento.direccion} />
            </div>
            {evento.direccion && <p className="mt-4 text-sm text-text-muted">{evento.direccion}</p>}
          </div>
        </div>
      </div>

      {relacionados.length > 0 && (
        <section className="wrap py-12" aria-labelledby="related-events-heading">
          <SectionHead
            kicker="Eventos"
            title="Otros próximos eventos"
            headingId="related-events-heading"
            linkTo="/eventos"
            linkLabel="Ver calendario completo"
          />
          <EventCards eventos={relacionados} />
        </section>
      )}
    </>
  );
}

export default EventsDetailPage;
