import { useEffect, useState } from "react";
import { getNoticias } from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function NewsSection({
  destacadas = false,
  limit = 4,
  gridCols = "md:grid-cols-4",
  showExcerpt = true,
  cardHeight = "h-48",
  titleSize = destacadas ? "text-xl" : "text-lg",
}) {
  const navigate = useNavigate();
  const [noticias, setNoticias] = useState([]);

  useEffect(() => {
    async function loadNews() {
      try {
        const res = await getNoticias();
        // Filtramos por destacadas o no y aplicamos límite
        const filteredNews = res.data
          .filter((news) => news.destacado === destacadas)
          .slice(0, limit);
        setNoticias(filteredNews);
      } catch (error) {
        console.error("Error cargando noticias:", error);
      }
    }
    loadNews();
  }, [destacadas, limit]);

  return (
    <div className="max-w-6xl px-1 py-1">
      {/* Título condicional */}
      <h2 className="flex items-center gap-2 text-2xl font-bold mb-2">
        {destacadas ? "Noticias Destacadas" : "Últimas Noticias"}
        <span className="flex-1 h-[1px] bg-black ml-2"></span>
      </h2>

      <div className={`grid grid-cols-1 ${gridCols} gap-1`}>
        {noticias.map((news) => (
          <div
            key={news.id}
            className={`relative group overflow-hidden shadow-lg cursor-pointer m-0.5 ${cardHeight} rounded-md`}
            onClick={() => navigate(`/noticias/${news.id}`)}
          >
            <img
              src={news.imagen}
              alt={news.titulo}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-4 w-full text-white">
              <h3 className="text-sm font-semibold leading-tight">
                {news.titulo}
              </h3>
              {showExcerpt && (
                <p className="text-xs opacity-80 mt-1">
                  {news.contenido.slice(0, 100)}...
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
