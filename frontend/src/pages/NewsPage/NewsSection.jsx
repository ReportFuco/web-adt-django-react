import { useNavigate } from "react-router-dom";

export default function NewsSection({
  noticias = [],
  destacadas = false,
  limit = 4,
  gridCols = "md:grid-cols-4",
  cardHeight = "h-48",
  titleSize = destacadas ? "text-2xl" : "text-xl",
}) {
  const navigate = useNavigate();

  const filteredNews = noticias
    .filter((news) =>
      destacadas ? news.destacado === true : news.destacado === false
    )
    .slice(0, limit);

  return (
    <div className="max-w-6xl px-1 py-1">
      {/* Título condicional */}
      <h2 className={`flex items-center gap-2 font-bold mb-2 ${titleSize}`}>
        {destacadas ? "Noticias Destacadas" : "Más Noticias"}
        <span className="flex-1 h-[1px] bg-black ml-2"></span>
      </h2>

      <div className={`grid ${gridCols} gap-2`}>
        {filteredNews.map((news) => (
          <div
            key={news.id}
            className={`relative group overflow-hidden shadow-md shadow-neutral-700 cursor-pointer m-0.5 ${cardHeight} rounded-2xl`}
            onClick={() => {
              navigate(`/noticias/${news.id}/${news.slug}`);
              window.scrollTo(0, 0);
            }}
          >
            <img
              src={news.imagen}
              alt={news.titulo}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

            <div className="absolute bottom-0 left-0 p-4 w-full text-white">
              <h3 className="text-base font-semibold leading-tight drop-shadow-md">
                {news.titulo.slice(0, 50)}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
