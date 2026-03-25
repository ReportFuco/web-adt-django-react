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

  if (!noticia || !noticias) return <LoadingSpinner />;

  return (
    <>
      <Header />

      <section className="relative min-h-[68vh] flex items-end overflow-hidden border-b border-white/10">
        <div className="absolute inset-0">
          <img src={noticia.imagen} alt={noticia.titulo} className="w-full h-full object-cover grayscale opacity-40 brightness-50" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/60 to-black/20"></div>
        </div>

        <div className="relative z-20 max-w-7xl mx-auto w-full px-6 md:px-8 py-12 md:py-16 text-white">
          <span className="inline-block border border-white/20 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.24em] mb-5">
            Actualidad
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-[0.94] tracking-tight max-w-5xl mb-5">
            {noticia.titulo}
          </h1>
          {noticia.subtitulo && (
            <p className="text-lg md:text-xl text-white/70 max-w-3xl mb-4">{noticia.subtitulo}</p>
          )}
          <p className="text-[11px] uppercase tracking-[0.26em] text-white/50 font-bold">
            {new Date(noticia.fecha_publicacion).toLocaleDateString("es-ES", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_380px] gap-8">
        <article className="border border-white/10 bg-[#101010] p-6 md:p-10 text-white/85 prose prose-invert prose-lg max-w-none [&_iframe]:w-full [&_iframe]:aspect-video [&_iframe]:my-6 [&_iframe]:border [&_iframe]:border-white/10">
          {parse(cleanContent)}
        </article>

        <div className="flex flex-col gap-8">
          <aside className="border border-white/10 bg-[#101010] text-white p-5 md:p-6 flex flex-col max-h-[620px]">
            <h2 className="text-2xl font-bold uppercase tracking-tight mb-4">Comentarios</h2>
            <div className="flex-grow overflow-y-auto mb-4 pr-1">
              <Comments id={id} key={refresh} />
            </div>
            {token ? (
              <form onSubmit={handleSubmit(onSubmit)} className="flex items-center gap-2 border-t border-white/10 pt-4">
                <input
                  type="text"
                  placeholder="Escribe un comentario..."
                  className="flex-1 text-white bg-black border border-white/15 px-4 py-3 focus:outline-none focus:border-white text-sm"
                  {...register("comments", {
                    required: "Debes escribir algo para comentar",
                  })}
                />
                <button type="submit" className="text-black text-xl p-3 bg-white hover:bg-white/90 transition-colors">
                  <IoSend />
                </button>
              </form>
            ) : (
              <p className="text-sm text-white/60 mt-2 uppercase tracking-[0.16em]">
                Debes <Link to="/login" className="text-white underline">iniciar sesión</Link> para comentar.
              </p>
            )}
            {errors.comments && <p className="text-red-400 text-xs mt-2">{errors.comments.message}</p>}
          </aside>

          <div className="border border-white/10 bg-[#0f0f0f] p-6 text-white/50 uppercase tracking-[0.24em] text-xs font-bold text-center">
            Espacio editorial / publicidad
          </div>

          <div className="border border-white/10 bg-[#0f0f0f] p-4 md:p-5">
            <NewsSection noticias={noticias} gridCols="grid-cols-1" limit={3} destacadas={true} cardHeight="h-[22rem]" />
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
