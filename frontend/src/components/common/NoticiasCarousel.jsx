import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function NoticiasCarousel({ data }) {
  const [current, setCurrent] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detectar si es móvil al montar y en cambios de tamaño
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % data.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [data.length]);

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + data.length) % data.length);
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % data.length);
  };

  if (!data || data.length === 0) return null;

  const currentItem = data[current];
  const detailLink =
    currentItem.tipo === "noticia"
      ? `/noticias/${currentItem.id}/${currentItem.slug}`
      : `/eventos/${currentItem.id}/${currentItem.slug}`;

  return (
    <div className="relative w-full h-72 md:h-110 overflow-hidden">
      <div
        className="flex transition-transform duration-1000 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {data.map((item, index) => (
          <div
            key={index}
            className="relative w-full flex-shrink-0 h-72 md:h-120"
          >
            {/* Fondo con blur condicional */}
            {!isMobile && (
              <div className="block absolute inset-0">
                <img
                  src={item.imagen}
                  alt=""
                  className="w-full h-full object-cover blur-lg scale-110"
                />
              </div>
            )}

            {/* Imagen principal con mejoras para móvil */}
            <img
              src={item.imagen}
              alt={item.titulo}
              className={`relative w-full h-full z-10 ${
                isMobile ? "object-cover" : "object-contain"
              }`}
            />

            {/* Overlay oscuro para mejor legibilidad en móvil */}
            {isMobile && (
              <div className="absolute inset-0 bg-black/30 z-15"></div>
            )}
          </div>
        ))}
      </div>

      {/* Título y botón */}
      <div className="absolute bottom-4 left-4 text-white px-4 py-2 rounded-lg z-20 flex flex-col gap-2 max-w-[80%]">
        <h2
          className="text-md md:text-4xl font-bold"
          style={{
            textShadow: isMobile
              ? "0px 2px 4px rgba(0,0,0,0.9)"
              : `0px 0px 6px rgba(0,0,0,0.9),
                 0px 0px 12px rgba(0,0,0,0.8),
                 0px 0px 18px rgba(0,0,0,0.7)`,
          }}
        >
          {currentItem.titulo}
        </h2>
        <Link
          to={detailLink}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm md:text-base w-fit"
        >
          Más información
        </Link>
      </div>

      {/* Controles mejorados para móvil */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 text-white rounded-full z-20 flex items-center justify-center"
      >
        ‹
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 w-8 h-8 text-white rounded-full z-20 flex items-center justify-center"
      >
        ›
      </button>
    </div>
  );
}
