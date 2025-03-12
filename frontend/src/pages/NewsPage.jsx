import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { getNews } from "../services/api";

function NewsPage() {
  const { id } = useParams();
  const [noticia, setNoticia] = useState(null);

  useEffect(() => {
    async function loadNews() {
      try {
        const res = await getNews(id);
        setNoticia(res.data);
      } catch (error) {
        console.error("Error cargando la noticia:", error);
      }
    }

    if (id) {
      loadNews();
    }
  }, [id]);

  if (!noticia) {
    return <p className="text-center text-gray-600 mt-10">Cargando...</p>;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* HERO SECTION */}
      <section className="relative flex flex-col lg:flex-row items-center lg:items-stretch bg-gray-900 text-white p-6 lg:p-12">
        {/* Texto a la izquierda */}
        <div className="lg:w-1/2 flex flex-col justify-center px-6">
          <p className="uppercase text-sm font-semibold text-gray-400">Actualidad</p>
          <h1 className="text-4xl font-bold mb-4">{noticia.titulo}</h1>
          <p className="text-lg italic text-gray-300">{noticia.subtitulo}</p>
          <p className="text-gray-400 mt-4">
            por <span className="font-semibold text-white">{noticia.autor}</span>
          </p>
          <p className="text-gray-400">{new Date(noticia.fecha_publicacion).toLocaleDateString()}</p>
        </div>

        {/* Imagen a la derecha */}
        {noticia.imagen && (
          <div className="lg:w-1/2 flex justify-center">
            <img
              src={noticia.imagen}
              alt={noticia.titulo}
              className="object-cover w-full lg:w-auto h-80 lg:h-full rounded-lg shadow-lg"
            />
          </div>
        )}
      </section>

      {/* CONTENIDO PRINCIPAL */}
      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sección de texto de la noticia */}
        <article className="lg:col-span-2 bg-white p-6 rounded-sm shadow-lg prose prose-lg">
          <ReactMarkdown>{noticia.contenido}</ReactMarkdown>
        </article>

        {/* Noticias relacionadas */}
        <aside className="bg-white p-6 rounded-sm shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-red-600">Actualidad</h2>
          <ul className="space-y-4">
            {noticia.relacionadas?.map((news, index) => (
              <li key={index} className="flex space-x-4">
                <img src={news.imagen} alt={news.titulo} className="w-24 h-24 object-cover rounded-md shadow-md" />
                <div>
                  <h3 className="text-md font-semibold">{news.titulo}</h3>
                  <p className="text-sm text-gray-500">{news.fecha}</p>
                </div>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}

export default NewsPage;
