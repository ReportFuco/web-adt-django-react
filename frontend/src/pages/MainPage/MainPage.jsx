import SpotifyPlaylist from "../../components/common/SpotifyPlaylist";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import NewsSection from "../NewsPage/NewsSection";
import EventSections from "../EventsPage/EventSection";
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
      tipo: "Noticias",
      slug: noticia.slug,
      fecha: noticia.fecha_publicacion,
      destacado: noticia.destacado,
    }));

    const eventosNormalized = eventos.map((evento) => ({
      id: evento.id,
      titulo: evento.nombre,
      imagen: evento.imagen,
      tipo: "Eventos",
      slug: evento.slug,
      fecha: evento.fecha_hora,
      destacado: evento.destacado,
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
        setData((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchAllData();
  }, []);

  if (data.loading) return <LoadingSpinner />;

  const destacados = [
    ...(data.destacados || []),
    {
      titulo: "Síguenos en nuestra playlist de Spotify",
      imagen: BannerSpotify,
      tipo: "Spotify",
      slug: null,
      id: "spotify-banner",
      url: "https://open.spotify.com/playlist/4uDeR4NrQHknGI4XMVEwRH",
    },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen flex flex-col" style={{ color: "var(--text)" }}>
        <NoticiasCarousel data={destacados} />

        <section className="py-20 px-4 md:px-6 max-w-7xl mx-auto w-full flex flex-col gap-8">
          <article className="section-shell">
            <NewsSection
              noticias={data.noticias}
              destacadas={true}
              limit={6}
              gridCols="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              cardHeight="h-[28rem]"
            />
          </article>

          <article className="section-shell">
            <EventSections
              event={data.eventos}
              destacadas={true}
              limit={6}
              gridCols="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              cardHeight="h-[26rem]"
            />
          </article>

          <article className="section-shell">
            <InterviewSection
              interview={data.entrevistas}
              destacadas={true}
              limit={6}
              gridCols="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              cardHeight="h-[26rem]"
            />
          </article>
        </section>

        <section
          className="py-24"
          style={{
            background: "var(--bg-soft)",
            borderTop: "1px solid var(--border)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row justify-between items-baseline mb-12 gap-8">
              <h2
                className="text-5xl md:text-7xl font-black uppercase tracking-tighter"
                style={{ color: "var(--text)" }}
              >
                Calendario <br /> de Eventos
              </h2>
              <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-[0.2em] p-4 theme-button-secondary">
                <span className="theme-text-muted">Filtro:</span>
                <button style={{ color: "var(--text)" }} className="underline">
                  Todo
                </button>
                <button className="theme-text-soft">Chile</button>
                <button className="theme-text-soft">Techno</button>
              </div>
            </div>
            <EventSections
              event={data.eventos}
              destacadas={false}
              limit={8}
              gridCols="grid-cols-1 md:grid-cols-2"
              cardHeight="h-[11rem] md:h-[12rem]"
            />
          </div>
        </section>

        <section className="py-24 px-4 md:px-6">
          <div className="max-w-5xl mx-auto theme-panel-strong p-10 md:p-20 flex flex-col items-center text-center gap-8">
            <span className="text-5xl">∞</span>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter" style={{ color: "var(--text)" }}>
              Únete a la <br /> comunidad
            </h2>
            <p className="text-lg md:text-xl max-w-2xl font-medium theme-text-soft">
              Acceso a noticias, eventos, contenido editorial y la escena electrónica desde una mirada más profunda.
            </p>
            <button className="theme-button px-12 py-5 text-sm font-bold uppercase tracking-[0.3em] hover:scale-105 transition-transform">
              Explorar →
            </button>
          </div>
        </section>

        <Socialmedia />
        <Form />
        <SpotifyPlaylist />
      </main>
      <Footer />
    </>
  );
}

export default MainPage;
