import Header from "../../components/layout/Header";
import SpotifyPlaylist from "../../components/common/SpotifyPlaylist";
import Footer from "../../components/layout/Footer";
import technoImage from "../../assets/techno 7.jpg";
import EventSection from "../EventsPage/EventSection";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { useState, useEffect } from "react";
import { getEvents } from "../../services/api";
import Socialmedia from "../../components/common/socialMedia";

function EventsPage() {
  const [evento, setEvento] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadNews() {
      try {
        const res = await getEvents();
        setEvento(res.data);
      } catch (error) {
        console.error("Error cargando noticias:", error);
        setError("Error al cargar las noticias");
      }
    }

    loadNews();
  }, []);

  if (!evento) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500 text-xl">{error}</p>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen flex flex-col">
        <section className="md:col-span-4 flex flex-col gap-4 items-center">
          <h1 className="text-3xl font-extrabold text-center my-4">
            últimos Eventos
          </h1>

          <article className="p-0.5">
            <EventSection
              event={evento}
              destacadas={true}
              limit={10}
              gridCols="grid-cols-2"
              cardHeight="h-55 md:h-90"
            />
          </article>
          <article className="p-0.5">
            <EventSection
              event={evento}
              destacadas={false}
              limit={10}
              gridCols="grid-cols-2 md:grid-cols-4"
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
