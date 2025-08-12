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
    <div className="max-w-6xl px-1 py-1 text-white">
      {/* Título condicional */}
      <h2 className={`flex items-center gap-2 font-bold mb-2 ${titleSize}`}>
        {destacadas ? "Noticias Destacadas" : "Más Noticias"}
        <span className="flex-1 h-[1px] bg-white ml-2"></span>
      </h2>

      <div className={`grid ${gridCols} gap-2`}>
        {filteredNews.map((news) => (
          <div
            key={news.id}
            className={`relative group overflow-hidden cursor-pointer m-0.5 ${cardHeight} rounded-xs`}
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
              <h2
                className="text-xs md:text-xl font-bold"
                style={{
                  textShadow: `
      0px 0px 6px rgba(0,0,0,0.9),
      0px 0px 12px rgba(0,0,0,0.8),
      0px 0px 18px rgba(0,0,0,0.7)
    `,
                }}
              >
                {news.titulo}
              </h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
