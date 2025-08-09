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
        setError("Hubo un problema al cargar las noticias");
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
      {/* Sección de Encabezado */}
      <section className="relative flex flex-col border-b-2 lg:flex-row items-center lg:items-stretch bg-black text-white p-6 lg:p-12">
        <div className="lg:w-1/2 flex flex-col justify-center px-6">
          <p className="uppercase text-sm font-semibold text-gray-400">
            Actualidad
          </p>
          <h1 className="text-4xl font-bold mb-4">{noticia.titulo}</h1>
          <p className="text-lg italic text-gray-300">{noticia.subtitulo}</p>
          <p className="text-gray-400">
            {new Date(noticia.fecha_publicacion).toLocaleDateString()}
          </p>
        </div>

        {noticia.imagen && (
          <div className="aspect-[4/3] w-full lg:w-[500px] overflow-hidden rounded-lg shadow-lg">
            <img
              src={noticia.imagen}
              alt={noticia.titulo}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </section>

      {/* Contenido Principal */}
      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- Artículo --- */}
        <article className="lg:col-span-2 text-neutral-300 p-6 rounded-lg shadow-lg prose prose-lg max-w-none [&_iframe]:w-full [&_iframe]:aspect-video [&_iframe]:rounded-lg [&_iframe]:my-4">
          {parse(cleanContent)}

        </article>

        {/* --- Columna derecha (solo escritorio) --- */}
        <div className="lg:grid gap-8 lg:grid-rows-[auto_auto_1fr]">
          {/* Comentarios (siempre visible) */}
          <aside className="p-6 bg-neutral-900 rounded-lg shadow-lg flex flex-col h-[550px]">
            <h2 className="text-xl font-semibold mb-4 text-neutral-300 text-center">
              Comentarios
            </h2>
            <div className="flex-grow overflow-y-auto">
              <Comments id={id} key={refresh} />
            </div>
            {token ? (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex items-center gap-2 mt-4"
              >
                <input
                  type="text"
                  placeholder="Escribe un comentario..."
                  className="flex-1 text-white border border-white rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                  {...register("comments", {
                    required: "Debes escribir algo para comentar",
                  })}
                />
                <button type="submit" className="text-white text-2xl p-2">
                  <IoSend />
                </button>
                {errors.comments && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.comments.message}
                  </p>
                )}
              </form>
            ) : (
              <p className="text-center text-sm text-white mt-4">
                Debes{" "}
                <Link
                  to="/login"
                  className="text-blue-500 underline hover:text-blue-700"
                >
                  iniciar sesión
                </Link>{" "}
                para comentar.
              </p>
            )}
          </aside>
          <div className="bg-yellow-100 p-4 rounded-lg mt-8 lg:mt-0 h-[300px]">
            <p className="text-center font-medium">Publicidad</p>
          </div>

          <NewsSection
            noticias={noticias}
            gridCols="grid-cols-1"
            limit={3}
            destacadas={true}
            cardHeight="h-64"
          />
        </div>
      </div>

      <div>
        <SpotifyPlaylist />
      </div>

      <Footer />
    </>
  );
}

export default NewsDetailPage;
