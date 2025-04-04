import { getEvents } from "../../services/api";
import Header from "../../components/layout/Header";
import { useEffect, useState } from "react";
import EventCard from "../../components/EventCard";
import SpotifyPlaylist from "../../components/common/SpotifyPlaylist";
import Footer from "../../components/layout/Footer";

function EventsPage() {
  const [evento, setEvento] = useState([]);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const rest = await getEvents();
        setEvento(rest);
      } catch (error) {
        console.error("Error al obtener los datos", error);
      }
    };
    loadEvents();
  }, []);

  return (
    <>
      <Header />
      <main>
        <section id="proximos-eventos">
          <h2 className="font-bold text-2xl text-black text-center mb-6">
            Próximos eventos
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
            {evento.map((evento) => (
              <EventCard key={evento.id} evento={evento} />
            ))}
          </div>
        </section>
      </main>
      <SpotifyPlaylist />
      <Footer />
    </>
  );
}

export default EventsPage;
