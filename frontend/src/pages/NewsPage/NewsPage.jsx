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

  useEffect(() => {
    async function loadNews() {
      try {
        const res = await getNoticias();
        setNoticias(res.data);
      } catch (error) {
        console.error("Error cargando noticias:", error);
        setError("Error al cargar las noticias");
      } finally {
        setLoading(false);
      }
    }

    loadNews();
  }, []);

  if (!noticias) {
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
      <NoticiasCarousel data={noticias.slice(0, 4)} />
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
