import SpotifyPlaylist from "../components/SpotifyPlaylist";
import React, { useEffect, useState } from "react";
import Comments from "../components/Comments";
import { getNoticia } from "../services/api";
import { Link, useNavigate, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useForm } from "react-hook-form";
import { IoSend } from "react-icons/io5";
import { useAuth } from "../context/AuthContext";
import { postComment } from "../services/api";

function NewsPage() {
  const navigate = useNavigate()
  const { token } = useAuth();
  const { id } = useParams();
  const [noticia, setNoticia] = useState(null);
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
    } else {
      console.error("Error al enviar comentario ❌", response.error);
    }

    reset();
  };

  useEffect(() => {
    async function loadNews() {
      if (id) {
        const res = await getNoticia(id);
        setNoticia(res);
      }
    }
    loadNews();
  }, [id]);

  if (!noticia) {
    return <p className="text-center text-gray-600 mt-10">Cargando...</p>;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <section className="relative flex flex-col lg:flex-row items-center lg:items-stretch bg-black text-white p-6 lg:p-12">
        {/* Texto a la izquierda */}
        <div className="lg:w-1/2 flex flex-col justify-center px-6">
          <p className="uppercase text-sm font-semibold text-gray-400">
            Actualidad
          </p>
          <h1 className="text-4xl font-bold mb-4">{noticia.titulo}</h1>
          <p className="text-lg italic text-gray-300">{noticia.subtitulo}</p>
          <p className="text-gray-400 mt-4">
            por{" "}
            <span className="font-semibold text-white">
              {noticia.autor_username}
            </span>
          </p>
          <p className="text-gray-400">
            {new Date(noticia.fecha_publicacion).toLocaleDateString()}
          </p>
        </div>

        {/* Imagen a la derecha */}
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

      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <article className="lg:col-span-2 bg-white p-6 rounded-lg shadow-lg prose prose-lg">
          <ReactMarkdown>{noticia.contenido}</ReactMarkdown>
          <p className="m-2">Fuente: {noticia.fuente}</p>
        </article>

        <aside className="bg-white p-6 rounded-lg shadow-lg flex flex-col h-[400px]">
          <h2 className="text-xl font-semibold mb-4 text-neutral-950 text-center">
            Comentarios
          </h2>
          <div className="flex-grow overflow-y-auto pr-2">
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
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                {...register("comments", {
                  required: {
                    value: true,
                    message: "Debes escribir algo para comentar",
                  },
                })}
              />
              <button type="submit" className="text-black text-2xl p-2">
                <IoSend />
              </button>
              {errors.comments && (
                <p className="text-red-500 text-sm mt-1 text-center w-full">
                  {errors.comments.message}
                </p>
              )}
            </form>
          ) : (
            <p className="text-center text-sm text-red-500 mt-4">
              Debes{" "}
              <Link
                className="text-blue-500 underline hover:text-blue-700"
                to={"/login"}
              >
                iniciar sesión
              </Link>{" "}
              para comentar.
            </p>
          )}
        </aside>
      </div>

      <div>
        <SpotifyPlaylist />
      </div>
      <Footer />
    </div>
  );
}

export default NewsPage;
