import { useEffect, useState } from "react";
import { getNoticias } from "../services/api";

export default function NewsGrid() {
  const [noticias, setNoticias] = useState([]);

  useEffect(() => {
    async function loadNews() {
      const res = await getNoticias();
      console.log(res);
      setNoticias(res.data.slice(0, 4));
    }
    loadNews();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold">Noticias</h2>
      <div className="border-b-4 border-amber-300 w-30 my-3"></div>
      <div className="grid md:grid-cols-4 gap-1">
        {noticias.map((news) => (
          <div
            key={news.id}
            className="relative group overflow-hidden shadow-lg cursor-pointer"
          >
            <img
              src={news.imagen}
              alt={news.titulo}
              className="w-full h-100 object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6 w-full text-white bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300">
              <h3 className="text-sm font-semibold leading-tight">
                {news.titulo}
              </h3>
              <p className="text-xs opacity-80">{news.contenido}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
