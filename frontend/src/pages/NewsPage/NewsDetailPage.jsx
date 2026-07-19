import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { IoSend } from "react-icons/io5";
import { Calendar } from "lucide-react";
import parse from "html-react-parser";
import { getNoticia, getNoticias, postComment } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import Comments from "../../components/features/Comments";
import ErrorState from "../../components/ui/ErrorState";
import DetailHero from "../../components/content/DetailHero";
import DetailGallery from "../../components/content/DetailGallery";
import DetailPageSkeleton from "../../components/content/DetailPageSkeleton";
import NewsList from "../../components/content/NewsList";
import SectionHead from "../../components/ui/SectionHead";
import { MetaRow, MetaItem } from "../../components/ui/MetaRow";
import { sanitizeHTML } from "../../utils/htmlSanitizer";
import { formatShortDate } from "../../utils/formatDate";
import { excerpt } from "../../utils/textExcerpt";
import Seo from "../../components/common/Seo";

function NewsDetailPage() {
  const { token } = useAuth();
  const { slug, id } = useParams();
  const [noticia, setNoticia] = useState(null);
  const [noticias, setNoticias] = useState([]);
  const [loadError, setLoadError] = useState(null);
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
      console.error("Error al enviar comentario", response.error);
    }
  };

  const cleanContent = noticia ? sanitizeHTML(noticia.contenido) : "";

  useEffect(() => {
    let cancelled = false;
    async function loadNews() {
      try {
        if (slug) {
          const res = await getNoticia(slug);
          if (!cancelled) setNoticia(res);
        }
        const { results, error } = await getNoticias();
        if (cancelled) return;
        if (error) throw error;
        setNoticias(results);
      } catch (error) {
        console.error("Error al cargar la noticia:", error);
        if (!cancelled) setLoadError(error);
      }
    }
    loadNews();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    if (!cleanContent.includes("instagram-media")) return;

    const processEmbeds = () => {
      window.instgrm?.Embeds?.process?.();
    };

    const processAfterRender = () => {
      requestAnimationFrame(() => {
        processEmbeds();
        setTimeout(processEmbeds, 500);
        setTimeout(processEmbeds, 1500);
      });
    };

    const existingScript = document.querySelector(
      'script[src="//www.instagram.com/embed.js"], script[src="https://www.instagram.com/embed.js"]'
    );
    if (existingScript) {
      if (window.instgrm?.Embeds) {
        processAfterRender();
      } else {
        existingScript.addEventListener("load", processAfterRender, { once: true });
      }
      return;
    }

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://www.instagram.com/embed.js";
    script.onload = processAfterRender;
    document.body.appendChild(script);
  }, [cleanContent]);

  if (loadError) return <ErrorState className="my-24" description="No se pudo cargar la noticia." />;
  if (!noticia) return <DetailPageSkeleton type="noticia" />;

  const noticiaDescription = excerpt(noticia.subtitulo || noticia.contenido || "", 160);
  const noticiaUrl = `https://adictosaltechno.com/noticias/${id}/${slug}`;
  const relacionadas = noticias.filter((item) => item.id !== noticia.id).slice(0, 4);

  return (
    <>
      <Seo
        title={`${noticia.titulo} | Noticias de techno | Adictos al Techno`}
        description={noticiaDescription || "Lee la noticia completa en Adictos al Techno."}
        canonical={noticiaUrl}
        image={noticia.imagen}
        type="article"
        schema={[
          {
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            headline: noticia.titulo,
            description: noticiaDescription || noticia.titulo,
            image: noticia.imagen ? [noticia.imagen] : undefined,
            datePublished: noticia.fecha_publicacion,
            author: noticia.autor_username ? [{ "@type": "Person", name: noticia.autor_username }] : undefined,
            mainEntityOfPage: noticiaUrl,
            keywords: Array.isArray(noticia.tags) ? noticia.tags.map((tag) => tag.nombre ?? tag).join(", ") : "techno, música electrónica",
            publisher: {
              "@type": "Organization",
              name: "Adictos al Techno",
              logo: { "@type": "ImageObject", url: "https://adictosaltechno.com/logo-social.jpg" },
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Inicio", item: "https://adictosaltechno.com/" },
              { "@type": "ListItem", position: 2, name: "Noticias", item: "https://adictosaltechno.com/noticias" },
              { "@type": "ListItem", position: 3, name: noticia.titulo, item: noticiaUrl },
            ],
          },
        ]}
      />

      <DetailHero
        kicker="Noticias"
        title={noticia.titulo}
        breadcrumbItems={[{ label: "Inicio", to: "/" }, { label: "Noticias", to: "/noticias" }, { label: noticia.titulo }]}
        imagen={noticia.imagen}
        imageAlt={noticia.titulo}
        dek={noticia.subtitulo}
        meta={
          noticia.fecha_publicacion && (
            <MetaRow className="text-on-photo/70">
              <MetaItem icon={Calendar}>{formatShortDate(noticia.fecha_publicacion)}</MetaItem>
            </MetaRow>
          )
        }
        tags={noticia.tags}
      />

      <div className="wrap grid grid-cols-1 gap-8 py-12 min-[1101px]:grid-cols-[minmax(0,2fr)_380px]">
        <div className="flex flex-col gap-10">
          <article className="rich-content border border-line bg-surface p-6 text-text-soft md:p-10">
            {parse(cleanContent)}
          </article>
          <DetailGallery fotos={noticia.fotos} />
        </div>

        <div className="flex flex-col gap-8">
          <aside className="flex max-h-[620px] flex-col border border-line bg-surface p-5 md:p-6">
            <h2 className="mb-4 text-xl">Comentarios</h2>
            <div className="mb-4 flex-grow overflow-y-auto pr-1">
              <Comments id={id} key={refresh} />
            </div>
            {token ? (
              <form onSubmit={handleSubmit(onSubmit)} className="flex items-center gap-2 border-t border-line pt-4">
                <input
                  type="text"
                  placeholder="Escribe un comentario…"
                  className="min-h-11 flex-1 border border-control-line bg-surface px-4 py-3 text-sm text-text focus:border-signal focus:outline-none"
                  {...register("comments", { required: "Debes escribir algo para comentar" })}
                />
                <button
                  type="submit"
                  aria-label="Enviar comentario"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-adt bg-text text-bg hover:bg-signal hover:text-on-signal"
                >
                  <IoSend />
                </button>
              </form>
            ) : (
              <p className="mt-2 text-sm uppercase tracking-[0.1em] text-text-muted">
                Debes{" "}
                <Link to="/login" className="text-text underline hover:text-signal">
                  iniciar sesión
                </Link>{" "}
                para comentar.
              </p>
            )}
            {errors.comments && <p className="mt-2 text-xs text-red-400">{errors.comments.message}</p>}
          </aside>
        </div>
      </div>

      {relacionadas.length > 0 && (
        <section className="wrap py-12" aria-labelledby="related-news-heading">
          <SectionHead
            kicker="Noticias"
            title="También te puede interesar"
            headingId="related-news-heading"
            linkTo="/noticias"
            linkLabel="Ver todas"
          />
          <NewsList noticias={relacionadas} />
        </section>
      )}
    </>
  );
}

export default NewsDetailPage;
