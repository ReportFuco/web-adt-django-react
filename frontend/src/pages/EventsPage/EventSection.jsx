import { useNavigate } from "react-router-dom";

export default function NewsSection({
  event = [],
  destacadas = false,
  limit = 4,
  gridCols = "md:grid-cols-4",
  showExcerpt = true,
  cardHeight = "h-48",
  titleSize = destacadas ? "text-2xl" : "text-xl",
}) {
  const navigate = useNavigate();

  const filteredEvents = event
    .filter((news) =>
      destacadas ? news.destacado === true : news.destacado === false
    )
    .slice(0, limit);

  return (
    <div className="max-w-6xl px-1 py-1">
      {/* Título condicional */}
      <h2
        className={`flex text-white items-center gap-2 font-bold mb-2 ${titleSize}`}
      >
        {destacadas ? "Eventos Destacados" : "Más Eventos"}
        <span className="flex-1 h-[1px] bg-white ml-2"></span>
      </h2>

      <div className={`grid ${gridCols} gap-2`}>
        {filteredEvents.map((events) => (
          <div
            key={events.id}
            className={`relative group overflow-hidden cursor-pointer m-0.5 ${cardHeight} rounded-xs`}
            onClick={() => {
              navigate(`/eventos/${events.id}/${events.slug}`);
              window.scrollTo(0, 0);
            }}
          >
            <img
              src={events.imagen}
              alt={events.nombre}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
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
                {events.nombre}
              </h2>
              <p className="text-xs opacity-80 mt-1">
                {new Date(events.fecha_hora).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
