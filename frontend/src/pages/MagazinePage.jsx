import { useState, useEffect } from "react";
import SpotifyPlaylist from "../components/SpotifyPlaylist";
import { getEvents } from "../services/api";
import NewsGrid from "./NewsGrid";
import Header from "../components/Header";
import Footer from "../components/Footer";
import technoImage from "../assets/techno 7.jpg";
import EventCard from "../components/EventCard";

function MagazinePage() {
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
      <main className="min-h-screen flex flex-col">
        <section className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 flex-grow">
          {/* Lateral izquierdo (imagen) */}
          <aside
            className="bg-cover bg-center bg-no-repeat h-24 md:h-auto md:col-span-1"
            style={{ backgroundImage: `url(${technoImage})` }}
          ></aside>

          {/* Contenido central */}
          <section className="md:col-span-4 flex flex-col gap-4">
            <article className="p-0.5">
              <h2 className="text-3xl font-bold">Noticias</h2>
              <div className="border-b-4 border-neutral-500 w-35 mb-4 mt-1"></div>
              <NewsGrid />
            </article>
            <article>
              <h2 className="text-3xl font-bold">Eventos</h2>
              <div className="border-b-4 border-neutral-500 w-35 mb-4 mt-1"></div>
              <div className="">
                {evento.map((evento) => (
                  <EventCard key={evento.id} evento={evento} />
                ))}
              </div>
            </article>
          </section>

          <aside
            className="bg-cover bg-center bg-no-repeat h-30 my-2 md:h-auto md:col-span-1"
            style={{ backgroundImage: `url(${technoImage})` }}
          ></aside>
        </section>

        <div className="w-full mt-10">
          <SpotifyPlaylist />
        </div>
        <Footer />
      </main>
    </>
  );
}

export default MagazinePage;
