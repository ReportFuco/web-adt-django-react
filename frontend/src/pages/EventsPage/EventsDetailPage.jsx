import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import parse from "html-react-parser";
import { FaCalendarAlt, FaMapMarkerAlt, FaLink } from "react-icons/fa";

import { getEventBySlug, getEvents } from "../../services/api";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import EventSection from "./EventSection";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { sanitizeHTML } from "../../utils/htmlSanitizer";
import Maps from "../../components/features/Maps";
import SpotifyPlaylist from "../../components/common/SpotifyPlaylist";
import Socialmedia from "../../components/common/socialMedia";
import Seo from "../../components/common/Seo";
import Breadcrumbs from "../../components/common/Breadcrumbs";
import { formatEventDateRange, formatFullEventDate, getEventDateItems } from "../../utils/eventDates";

function EventsDetailPage() {
  const { slug } = useParams();
  const [evento, setEvento] = useState(null);
  const [eventos, setEventos] = useState(null);
  const [error, setError] = useState(null);

  const cleanContent = evento ? sanitizeHTML(evento.descripcion) : "";

  useEffect(() => {
    async function loadEvents() {
      try {
        if (slug) {
          const res = await getEventBySlug(slug);
          setEvento(res.data);
        }
        const resEventos = await getEvents();
        setEventos(resEventos);
      } catch (error) {
        console.error("Error al cargar el evento:", error);
        setError("Hubo un problema al cargar el evento");
      }
    }

    loadEvents();
  }, [slug]);

  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;
  if (!evento || !eventos) return <LoadingSpinner />;

  const eventDescription = (evento.descripcion || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160);
  const eventUrl = `https://adictosaltechno.com/eventos/${evento.id}/${slug}`;

  const eventDates = getEventDateItems(evento);
  const primaryDate = eventDates[0]?.fecha || evento.fecha_hora;
  const dateSummary = formatEventDateRange(eventDates);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
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
            location: {
              "@type": "Place",
              name: evento.lugar,
              address: evento.direccion || evento.lugar,
            },
            organizer: evento.organizacion
              ? { "@type": "Organization", name: evento.organizacion }
              : undefined,
            keywords: Array.isArray(evento.tags)
              ? evento.tags.map((tag) => tag.nombre ?? tag).join(", ")
              : "eventos techno, música electrónica",
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
      <Header />

      <section className="relative min-h-[68vh] flex items-end overflow-hidden border-b border-white/10">
        <div className="absolute inset-0">
          <img src={evento.imagen} alt={evento.nombre} className="w-full h-full object-cover opacity-70 brightness-75" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/60 to-black/20"></div>
        </div>

        <div className="relative z-20 max-w-7xl mx-auto w-full px-6 md:px-8 py-12 md:py-16 text-white">
          <Breadcrumbs items={[{ label: "Inicio", to: "/" }, { label: "Eventos", to: "/eventos" }, { label: evento.nombre }]} />
          <span className="inline-block border border-white/20 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.24em] mb-5">
            Evento
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-[0.94] tracking-tight max-w-5xl mb-6">{evento.nombre}</h1>
          <div className="flex flex-col md:flex-row md:flex-wrap gap-4 md:gap-8 text-[11px] uppercase tracking-[0.24em] text-white/60 font-bold">
            <span className="flex items-center gap-3"><FaMapMarkerAlt /> {evento.lugar}</span>
            {dateSummary && <span className="flex items-center gap-3"><FaCalendarAlt /> {dateSummary}</span>}
          </div>
          {Array.isArray(evento.tags) && evento.tags.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {evento.tags.map((tag) => (
                <span key={tag.id ?? tag.nombre ?? tag} className="border border-fuchsia-400/30 bg-fuchsia-400/10 px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-fuchsia-200">
                  {tag.nombre ?? tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_380px] gap-8">
        <div className="flex flex-col gap-8">
          <article className="border border-white/10 bg-[#101010] p-6 md:p-10 prose prose-invert prose-lg max-w-none text-white/85">
            {parse(cleanContent)}
          </article>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-white/10 bg-[#101010] p-6">
              <h3 className="text-sm uppercase tracking-[0.24em] text-white/50 mb-4 flex items-center gap-3"><FaCalendarAlt /> Fechas</h3>
              {eventDates.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {eventDates.map((dateItem, index) => (
                    <p key={dateItem.id ?? dateItem.fecha ?? index} className="text-xl font-semibold text-white">
                      {formatFullEventDate(dateItem.fecha)}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-xl font-semibold text-white">Fecha por confirmar</p>
              )}
            </div>
            <div className="border border-white/10 bg-[#101010] p-6">
              <h3 className="text-sm uppercase tracking-[0.24em] text-white/50 mb-4 flex items-center gap-3"><FaMapMarkerAlt /> Ubicación</h3>
              <p className="text-xl font-semibold text-white">{evento.lugar}</p>
              {evento.direccion && <p className="text-sm text-white/55 mt-2">{evento.direccion}</p>}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <div className="border border-white/10 bg-[#101010] p-6 text-white">
            <h3 className="text-2xl font-bold uppercase tracking-tight mb-5">tickets disponibles aqui</h3>
            {evento.website && (
              <a
                href={evento.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-full text-center bg-white text-black hover:bg-white/90 py-3 px-4 font-medium uppercase tracking-[0.18em] text-xs"
              >
                <FaLink className="mr-2" /> Sitio oficial
              </a>
            )}
            <div className="mt-6 pt-6 border-t border-white/10">
              <h4 className="text-sm uppercase tracking-[0.24em] text-white/50 mb-2">Organizado por</h4>
              <p className="text-white/80">{evento.organizacion || "Organización del evento"}</p>
            </div>
          </div>

          <div className="border border-white/10 bg-[#101010] p-6 text-white">
            <h3 className="text-xl font-bold mb-4 uppercase tracking-tight flex items-center gap-3"><FaMapMarkerAlt /> Ubicación</h3>
            <div className="h-56 overflow-hidden border border-white/10">
              <Maps direccion={evento.direccion} />
            </div>
            {evento.direccion && <p className="mt-4 text-sm text-white/55 uppercase tracking-[0.12em]">{evento.direccion}</p>}
          </div>

          <div className="border border-white/10 bg-[#0f0f0f] p-4 md:p-5">
            <EventSection event={eventos} gridCols="md:grid-cols-1" limit={3} destacadas={true} cardHeight="h-[22rem]" />
          </div>
        </div>
      </div>

      <Socialmedia />
      <SpotifyPlaylist />
      <Footer />
    </div>
  );
}

export default EventsDetailPage;
