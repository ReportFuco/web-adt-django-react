import { useState, useEffect } from "react";

import Header from "../../components/layout/Header";
import SpotifyPlaylist from "../../components/common/SpotifyPlaylist";
import Footer from "../../components/layout/Footer";
import EventSection from "../EventsPage/EventSection";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Socialmedia from "../../components/common/socialMedia";
import NoticiasCarousel from "@/components/common/NoticiasCarousel";
import { getEvents } from "../../services/api";
import Seo from "../../components/common/Seo";

function EventsPage() {
  const [eventos, setEventos] = useState(null);
  const [error, setError] = useState(null);
  const [destacados, setDestacados] = useState([]);

  function normalizeData(eventos) {
    return eventos.map((evento) => ({
      id: evento.id,
      titulo: evento.nombre,
      nombre: evento.nombre,
      imagen: evento.imagen,
      tipo: "Eventos",
      slug: evento.slug,
      fecha_hora: evento.fecha_hora,
      fechas: evento.fechas || [],
      lugar: evento.lugar,
      tags: evento.tags || [],
      destacado: evento.destacado || false,
    }));
  }

  useEffect(() => {
    async function loadNews() {
      try {
        const eventsData = await getEvents();

        if (!Array.isArray(eventsData)) {
          throw new Error("Respuesta inválida al cargar eventos");
        }

        const normalizados = normalizeData(eventsData);
        setEventos(normalizados);
        const destacadosFiltrados = normalizados.filter((item) => item.destacado);
        setDestacados(destacadosFiltrados);
      } catch (error) {
        console.error("Error cargando eventos:", error);
        setError("Error al cargar los eventos");
      }
    }

    loadNews();
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500 text-xl">{error}</p>
      </div>
    );
  }

  if (!eventos) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Seo
        title="Eventos techno y música electrónica | Adictos al Techno"
        description="Agenda de eventos techno, fiestas electrónicas, festivales y fechas destacadas en Chile y el mundo."
        canonical="https://adictosaltechno.com/eventos"
        schema={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Eventos techno y música electrónica",
          url: "https://adictosaltechno.com/eventos",
          inLanguage: "es-CL",
        }}
      />
      <Header />
      <NoticiasCarousel data={destacados} />
      <main className="min-h-screen flex flex-col">
        <section className="md:col-span-4 flex flex-col gap-4 items-center">
          <p className="text-[11px] uppercase tracking-[0.28em] text-white/45 font-semibold text-center mt-4">
            Agenda techno, fiestas electrónicas y festivales
          </p>
          <h1 className="text-3xl font-extrabold text-center my-1">
            Eventos techno y música electrónica
          </h1>
          <p className="text-sm md:text-base text-white/60 text-center max-w-3xl px-4 mb-2">
            Revisa fechas, fiestas, festivales y eventos de techno para seguir la escena electrónica en Chile y el mundo.
          </p>

          <article className="p-0.5 w-full max-w-6xl">
            <EventSection
              event={eventos}
              destacadas={true}
              limit={10}
              gridCols="grid-cols-1 sm:grid-cols-2"
              cardHeight="h-55 md:h-90"
            />
          </article>
          <article className="p-0.5 w-full max-w-6xl">
            <EventSection
              event={eventos}
              destacadas={false}
              limit={10}
              gridCols="grid-cols-1 sm:grid-cols-2 md:grid-cols-4"
              cardHeight="h-55 md:h-90"
            />
          </article>
        </section>
        <Socialmedia />
        <SpotifyPlaylist />
        <Footer />
      </main>
    </>
  );
}

export default EventsPage;
