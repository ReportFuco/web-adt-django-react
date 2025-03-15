import React, { useEffect, useState } from "react";
import { useApi } from "../services/api"; // 👈 Importa la API centralizada

function Interview() {
  const { getEvents } = useApi(); // 👈 Extrae `getEvents` desde `useApi()`
  const [evento, setEvento] = useState([]);

  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await getEvents();
        setEvento(res.data);
      } catch (error) {
        console.error("Error cargando eventos:", error);
      }
    }
    loadEvents();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold">Eventos</h2>
      <div className="border-b-4 border-amber-300 w-30 my-3"></div>
      <div className="flex flex-auto">
        {evento.map((news) => (
          <div
            key={news.id}
            className="relative group overflow-hidden shadow-lg cursor-pointer"
            onClick={() => {}}
          >
            <img
              src={news.imagen}
              alt={news.nombre}
              className="w-full h-100 object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6 w-full text-white bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300">
              <h3 className="text-sm font-semibold leading-tight">
                {news.nombre}
              </h3>
              <p className="text-xs opacity-80">
                {news.descripcion.slice(0, 100)}...
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Interview;
