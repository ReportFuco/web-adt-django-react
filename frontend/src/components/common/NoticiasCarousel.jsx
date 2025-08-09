import { useState, useEffect } from "react";

export default function NoticiasCarousel({ data }) {
  const [current, setCurrent] = useState(0);

  // Cambio automático cada 4 segundos
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

  return (
    <div className="relative w-full h-64 md:h-96 overflow-hidden">
      <div
        className="flex transition-transform duration-1000 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {data.map((item, index) => (
          <div
            key={index}
            className="relative w-full flex-shrink-0 h-72 md:h-120"
          >
            {/* Fondo difuminado solo en md y superior */}
            <div className="hidden md:block absolute inset-0">
              <img
                src={item.imagen}
                alt=""
                className="w-full h-full object-cover blur-lg scale-110"
              />
            </div>

            {/* Imagen principal */}
            <img
              src={item.imagen}
              alt={item.titulo}
              className="relative w-full h-full object-contain z-10"
            />
          </div>
        ))}
      </div>

      {/* Título */}
      <div className="absolute bottom-4 left-4 text-white px-4 py-2 rounded-lg z-20">
        <h2 className="text-xl md:text-4xl font-bold">{data[current].titulo}</h2>
      </div>

      {/* Controles */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white px-3 py-2 rounded-full z-20"
      >
        ‹
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white px-3 py-2 rounded-full z-20"
      >
        ›
      </button>
    </div>
  );
}
