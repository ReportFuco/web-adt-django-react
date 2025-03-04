import { useState } from "react";
import Fotito from "../assets/fondo.webp"
import FotoDos from "../assets/fotos de eventos3.jpg"

const newsData = [
  {
    title: "ULTRA Japan revela el lineup de fase 1 para la edición 2023",
    date: "Julio 19, 2023",
    image: Fotito, // Reemplaza con URL real
  },
  {
    title: "DJ Michael Bibi Revela su Lucha contra el Cáncer",
    date: "Junio 30, 2023",
    image: FotoDos, // Reemplaza con URL real
  },
  {
    title: "James Hype: Innovación y pasión en la música electrónica",
    date: "Julio 17, 2023",
    image: "https://via.placeholder.com/400x300", // Reemplaza con URL real
  },
  {
    title: "Mainstage de Tomorrowland 2023: Un escenario impresionante en Boom, Bélgica",
    date: "Julio 21, 2023",
    image: "https://via.placeholder.com/400x300", // Reemplaza con URL real
  },
];

export default function NewsGrid() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Noticias</h2>
      <div className="grid md:grid-cols-4 gap-1">
        {newsData.map((news, index) => (
          <div
            key={index}
            className="relative group overflow-hidden shadow-lg cursor-pointer"
          >
            <img
              src={news.image}
              alt={news.title}
              className="w-full h-100 object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-2 w-full text-white bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300">
              <p className="text-xs opacity-80">{news.date}</p>
              <h3 className="text-sm font-semibold leading-tight">{news.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}