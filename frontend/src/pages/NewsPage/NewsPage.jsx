import Header from "../../components/layout/Header";
import SpotifyPlaylist from "../../components/common/SpotifyPlaylist";
import Footer from "../../components/layout/Footer";
import technoImage from "../../assets/techno 7.jpg";
import NewsSection from "../NewsPage/NewsSection";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { useState, useEffect } from "react";
import { getNoticias } from "../../services/api";
import Socialmedia from "../../components/common/socialMedia";
import NoticiasCarousel from "../../components/common/NoticiasCarousel";

function NewsPage() {
  const [noticias, setNoticias] = useState(null);
  const [error, setError] = useState(null);
  const [destacados, setDestacados] = useState([]);
  const [loading, setLoading] = useState(true);

  function normalizeData(noticias) {
    return noticias.map((noticia) => ({
      id: noticia.id,
      titulo: noticia.titulo,
      imagen: noticia.imagen,
      tipo: "Noticias",
      slug: noticia.slug,
      fecha: noticia.fecha_publicacion,
      destacado: noticia.destacado,
    }));
  }

  useEffect(() => {
    async function loadNews() {
      try {
        const res = await getNoticias();
        const noticiasData = Array.isArray(res?.data) ? res.data : null;

        if (!noticiasData) {
          throw new Error("Respuesta inválida al cargar noticias");
        }

        const normalizados = normalizeData(noticiasData);
        setNoticias(noticiasData);
        const destacadosFiltrados = normalizados.filter((item) => item.destacado);
        setDestacados(destacadosFiltrados);
      } catch (error) {
        console.error("Error cargando noticias:", error);
        setError("Error al cargar las noticias");
      } finally {
        setLoading(false);
      }
    }

    loadNews();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500 text-xl">{error}</p>
      </div>
    );
  }

  if (!noticias) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Header />
      <NoticiasCarousel data={destacados} />
      <main className="min-h-screen flex flex-col">
        <section className="md:col-span-4 flex flex-col gap-4 items-center my-4">
          <h1 className="text-3xl text-white font-extrabold text-center ">
            Últimas noticias
          </h1>

          <article className="p-0.5">
            <NewsSection
              noticias={noticias}
              destacadas={true}
              limit={10}
              gridCols="grid-cols-2"
              cardHeight="h-55 md:h-90"
            />
          </article>
          <article className="p-0.5">
            <NewsSection
              noticias={noticias}
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

export default NewsPage;
