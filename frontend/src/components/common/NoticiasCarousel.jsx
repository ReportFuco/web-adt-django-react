import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

export default function NoticiasCarousel({ data }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % data.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [data.length]);

  const prevSlide = () => setCurrent((prev) => (prev - 1 + data.length) % data.length);
  const nextSlide = () => setCurrent((prev) => (prev + 1) % data.length);

  if (!data || data.length === 0) return null;

  const currentItem = data[current];
  const detailLink = () => {
    if (currentItem.tipo === "Noticias") return { type: "internal", path: `/noticias/${currentItem.id}/${currentItem.slug}` };
    if (currentItem.tipo === "Eventos") return { type: "internal", path: `/eventos/${currentItem.id}/${currentItem.slug}` };
    return { type: "external", path: currentItem?.url };
  };

  return (
    <section className="relative min-h-[72vh] md:min-h-[88vh] flex items-center px-0 overflow-hidden border-b border-white/10">
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentItem.id ?? current}
            src={currentItem.imagen}
            alt={currentItem.titulo}
            className="absolute inset-0 w-full h-full object-cover opacity-40 brightness-50"
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.985 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent z-10"></div>
      </div>

      <div className="relative z-20 max-w-7xl mx-auto w-full px-6 md:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentItem.id ?? `${current}-${currentItem.titulo}`}
            className="max-w-4xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-[10px] uppercase tracking-[0.5em] mb-6 opacity-60 font-bold border-l-2 border-white pl-4 text-white">
              {currentItem.tipo} / Adictos al Techno
            </p>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black leading-[0.95] tracking-tight uppercase mb-8 text-white max-w-3xl">
              {currentItem.titulo}
            </h1>
            <div className="flex flex-wrap gap-4">
              {detailLink().type === "internal" ? (
                <Link to={detailLink().path} className="bg-white text-black px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:invert transition-all duration-300">
                  Explorar
                </Link>
              ) : (
                <a href={detailLink().path} target="_blank" rel="noopener noreferrer" className="bg-white text-black px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:invert transition-all duration-300">
                  Ir al sitio
                </a>
              )}
              <button onClick={nextSlide} className="border border-white/20 hover:border-white px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-white transition-all duration-300">
                Siguiente
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-10 right-6 hidden lg:flex flex-col items-center gap-10 z-20 text-white">
        <button onClick={prevSlide} className="text-[10px] tracking-[0.5em] uppercase font-bold opacity-40 hover:opacity-100 transition-opacity rotate-90">Prev</button>
        <div className="w-[1px] h-20 bg-gradient-to-b from-white to-transparent"></div>
        <button onClick={nextSlide} className="text-[10px] tracking-[0.5em] uppercase font-bold opacity-40 hover:opacity-100 transition-opacity rotate-90">Next</button>
      </div>
    </section>
  );
}
