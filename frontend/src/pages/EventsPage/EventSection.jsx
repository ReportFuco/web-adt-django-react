import { useEffect, useState } from "react";
import { getEvents } from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function NewsSection({
  destacadas = false,
  limit = 4,
  gridCols = "md:grid-cols-4",
  showExcerpt = true,
  cardHeight = "h-48",
  titleSize = destacadas ? "text-2xl" : "text-xl",
}) {
  const navigate = useNavigate();
  const [evento, setEvento] = useState([]);

  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await getEvents();
        // Filtramos por destacadas o no y aplicamos límite
        const filteredEvents = res.data
          .filter((envets) => envets.destacado === destacadas)
          .slice(0, limit);
          setEvento(filteredEvents);
      } catch (error) {
        console.error("Error cargando noticias:", error);
      }
    }
    loadEvents();
  }, [destacadas, limit]);

  return (
    <div className="max-w-6xl px-1 py-1">
      {/* Título condicional */}
      <h2 className={`flex items-center gap-2 font-bold mb-2 ${titleSize}`}>
        {destacadas ? "Eventos Destacados" : "Más Eventos"}
        <span className="flex-1 h-[1px] bg-black ml-2"></span>
      </h2>

      <div className={`grid grid-cols-1 ${gridCols} gap-1`}>
        {evento.map((events) => (
          <div
            key={events.id}
            className={`relative group overflow-hidden shadow-md shadow-neutral-700 cursor-pointer m-0.5 ${cardHeight} rounded-2xl`}
            onClick={() => navigate(`/evento/${events.id}`)}
          >
            <img
              src={events.imagen}
              alt={events.nombre}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-4 w-full text-white">
              <h3 className="text-sm font-semibold leading-tight">
                {events.nombre}
              </h3>
              <p className="text-xs opacity-80 mt-1">
              {new Date(events.fecha_hora).toLocaleDateString()}
                </p>
              {showExcerpt && (
                <p className="text-xs opacity-80 mt-1">
                  {events.descripcion.slice(0, 100)}...
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
