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
import BannerSpotify from "../../assets/img/banners/banner-spotify.jpg";

function MainPage() {
  const [data, setData] = useState({
    noticias: [],
    entrevistas: [],
    eventos: [],
    productos: [],
    loading: true,
  });

  function normalizeData(noticias, eventos) {
    const noticiasNormalized = noticias.map((noticia) => ({
      id: noticia.id,
      titulo: noticia.titulo,
      imagen: noticia.imagen,
      tipo: "noticia",
      slug: noticia.slug,
      fecha: noticia.fecha_publicacion,
      destacado: noticia.destacado, // ✅ incluir
    }));

    const eventosNormalized = eventos.map((evento) => ({
      id: evento.id,
      titulo: evento.nombre,
      imagen: evento.imagen,
      tipo: "evento",
      slug: evento.slug,
      fecha: evento.fecha_hora,
      destacado: evento.destacado, // ✅ incluir
    }));

    return [...noticiasNormalized, ...eventosNormalized];
  }

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [noticias, entrevistas, eventos, productos] = await Promise.all([
          getNoticias(),
          getInterview(),
          getEvents(),
          getProductos(),
        ]);
        const combinado = normalizeData(noticias.data, eventos.data);
        const destacados = combinado.filter((item) => item.destacado || false);

        setData({
          noticias: noticias.data,
          entrevistas: entrevistas.data,
          eventos: eventos.data,
          productos: productos.data,
          combinado,
          destacados,
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

  data.destacados.push({
    titulo: "¡Siguenos en nuestra playlist de Spotify!",
    imagen: BannerSpotify,
    tipo: "custom",
    slug: null,
    id: "spotify-banner",
  });

  return (
    <>
      <Header />
      <main className="min-h-screen flex flex-col">
        <NoticiasCarousel data={data.destacados} />

        <section className="md:col-span-4 flex flex-col gap-4 items-center">
          <article className="p-0.5">
            <EventSections
              event={data.eventos}
              destacadas={true}
              limit={4}
              gridCols="grid-cols-2"
              cardHeight="h-55 md:h-85"
            />
          </article>

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
