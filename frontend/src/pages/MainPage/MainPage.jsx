import SpotifyPlaylist from "../../components/common/SpotifyPlaylist";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import NewsSection from "../NewsPage/NewsSection";
import EventSections from "../EventsPage/EventSection";
import StoreSection from "../store/StoreSection";
import InterviewSection from "../InterviewPage/InterviewSection";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { useState, useEffect } from "react";
import { getNoticias, getInterview, getEvents } from "../../services/api";
import { getProductos } from "../../services/store.api";
import Socialmedia from "../../components/common/socialMedia";
import Form from "../../components/common/Form";
import NoticiasCarousel from "../../components/common/NoticiasCarousel";


function MainPage() {
  const [data, setData] = useState({
    noticias: [],
    entrevistas: [],
    eventos: [],
    productos: [],
    loading: true,
  });

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [noticias, entrevistas, eventos, productos] = await Promise.all([
          getNoticias(),
          getInterview(),
          getEvents(),
          getProductos(),
        ]);

        setData({
          noticias: noticias.data,
          entrevistas: entrevistas.data,
          eventos: eventos.data,
          productos: productos.data,
          loading: false,
        });
      } catch (error) {
        console.error("Error cargando datos:", error);
        setData({ ...data, loading: false });
      }
    };

    fetchAllData();
  }, []);

  if (data.loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Header />
      <main className="min-h-screen flex flex-col">
        <NoticiasCarousel data={data.noticias.slice(0, 3)} />

        <section className="md:col-span-4 flex flex-col gap-4 items-center">
          <article className="p-0.5">
            <NewsSection
              noticias={data.noticias}
              destacadas={true}
              limit={4}
              gridCols="grid-cols-2"
              cardHeight="h-65 md:h-85"
            />
          </article>
          <article className="p-0.5">
            <InterviewSection
              interview={data.entrevistas}
              destacadas={true}
              limit={4}
              gridCols="grid-cols-2"
              cardHeight="h-55 md:h-85"
            />
          </article>
          <article className="p-0.5">
            <EventSections
              event={data.eventos}
              destacadas={true}
              limit={4}
              gridCols="grid-cols-2"
              cardHeight="h-55 md:h-85"
            />
          </article>

          {/* <article className="p-0.5">
            <StoreSection
              destacadas={true}
              limit={4}
              gridCols="grid-cols-2 md:grid-cols-4"
              cardHeight="h-55 md:h-85"
            />
          </article> */}

          <article className="p-0.5">
            <NewsSection
              noticias={data.noticias}
              destacadas={false}
              limit={8}
              gridCols="grid-cols-2 md:grid-cols-4"
              cardHeight="h-55 md:h-85"
            />
          </article>

          <article className="p-0.5">
            <EventSections
              event={data.eventos}
              destacadas={false}
              limit={8}
              gridCols="grid-cols-2 md:grid-cols-4"
              cardHeight="h-55 md:h-85"
            />
          </article>
        </section>

        <div className="mx-4">
          <h2 className=" text-white flex items-center gap-2">
            Redes sociales
            <span className="flex-1 h-[1px] bg-white ml-2"></span>
          </h2>
        </div>

        <Socialmedia />
        <Form />
        <SpotifyPlaylist />
      </main>
      <Footer />
    </>
  );
}

export default MainPage;
