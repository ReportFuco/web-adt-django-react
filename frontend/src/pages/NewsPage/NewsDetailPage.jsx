import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { IoSend } from "react-icons/io5";
import parse from "html-react-parser";
import { getNoticia, getNoticias, postComment } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import Comments from "../../components/features/Comments";
import SpotifyPlaylist from "../../components/common/SpotifyPlaylist";
import NewsSection from "./NewsSection";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { sanitizeHTML } from "../../utils/htmlSanitizer";
import Socialmedia from "../../components/common/socialMedia";

function NewsDetailPage() {
  const { token } = useAuth();
  const { slug, id } = useParams();
  const [noticia, setNoticia] = useState(null);
  const [noticias, setNoticias] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    const response = await postComment(id, data.comments);
    if (response.success) {
      setRefresh((prev) => !prev);
      reset();
    } else {
      console.error("Error al enviar comentario ❌", response.error);
    }
  };

  const cleanContent = noticia ? sanitizeHTML(noticia.contenido) : "";

  useEffect(() => {
    async function loadNews() {
      try {
        if (slug) {
          const res = await getNoticia(slug);
          setNoticia(res);
        }
        const resNoticias = await getNoticias();
        setNoticias(resNoticias.data);
      } catch (error) {
        console.error("Error al cargar las noticias:", error);
      }
    }
    loadNews();
  }, [slug]);

  if (!noticia || !noticias) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Header />

      {/* Hero Section optimizada para móviles */}
      <div className="relative h-auto min-h-[60vh] md:h-110 overflow-hidden">
        {/* Fondo difuminado - solo visible en md+ */}
        <div className="absolute inset-0 hidden md:block">
          <img
            src={noticia.imagen}
            alt={`Fondo ${noticia.titulo}`}
            className="w-full h-full object-cover blur-xl scale-105"
          />
        </div>

        {/* Imagen principal - visible en todos los dispositivos */}
        <div className="absolute inset-0 flex justify-center items-center">
          <img
            src={noticia.imagen}
            alt={noticia.titulo}
            className="relative w-full h-full md:w-auto md:h-auto md:max-h-[80%] object-cover md:object-contain z-10"
          />
        </div>

        {/* Degradado */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 md:opacity-90 z-20"></div>

        {/* Contenido de texto */}
        <div className="relative pt-16 pb-8 px-4 text-white z-30 flex flex-col justify-end h-full">
          <div className="max-w-6xl mx-auto w-full">
            <span className="inline-block px-3 py-1 bg-white text-black text-sm font-semibold rounded-full mb-3">
              Actualidad
            </span>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 leading-tight">
              {noticia.titulo}
            </h1>
            {noticia.subtitulo && (
              <p className="text-base md:text-lg italic text-gray-300 mb-3">
                {noticia.subtitulo}
              </p>
            )}
            <p className="text-gray-300 text-sm md:text-base">
              {new Date(noticia.fecha_publicacion).toLocaleDateString("es-ES", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Contenido Principal optimizado para móviles */}
      <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Artículo */}
        <article className="lg:col-span-2 text-neutral-300 px-4 py-6 rounded-lg prose prose-lg max-w-none [&_iframe]:w-full [&_iframe]:aspect-video [&_iframe]:rounded-lg [&_iframe]:my-4">
          {parse(cleanContent)}
        </article>

        {/* Columna derecha - reordenada para móviles */}
        <div className="flex flex-col gap-6 lg:grid lg:gap-8 lg:grid-rows-[auto_auto_1fr]">
          {/* Otras noticias primero en móviles */}
          <NewsSection
            noticias={noticias}
            gridCols="grid-cols-1"
            limit={3}
            destacadas={true}
            cardHeight="h-64"
          />

          {/* Comentarios */}
          <aside className="p-4 text-white bg-neutral-900 rounded-lg shadow-lg flex flex-col h-auto max-h-[500px]">
            <h2 className="text-xl font-semibold mb-4 text-neutral-300 text-center">
              Comentarios
            </h2>
            <div className="flex-grow overflow-y-auto mb-4">
              <Comments id={id} key={refresh} />
            </div>
            {token ? (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Escribe un comentario..."
                  className="flex-1 text-white bg-neutral-800 border border-neutral-700 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white text-sm"
                  {...register("comments", {
                    required: "Debes escribir algo para comentar",
                  })}
                />
                <button
                  type="submit"
                  className="text-white text-xl p-2 bg-neutral-700 rounded-full"
                >
                  <IoSend />
                </button>
              </form>
            ) : (
              <p className="text-center text-sm text-white mt-2">
                Debes{" "}
                <Link
                  to="/login"
                  className="text-blue-400 underline hover:text-blue-300"
                >
                  iniciar sesión
                </Link>{" "}
                para comentar.
              </p>
            )}
            {errors.comments && (
              <p className="text-red-400 text-xs mt-1 text-center">
                {errors.comments.message}
              </p>
            )}
          </aside>

          {/* Publicidad */}
          <div className="bg-yellow-100 p-4 rounded-lg h-[120px] flex items-center justify-center">
            <p className="text-center font-medium">Publicidad</p>
          </div>
        </div>
      </div>

      <Socialmedia />
      <SpotifyPlaylist />
      <Footer />
    </>
  );
}

export default NewsDetailPage;
