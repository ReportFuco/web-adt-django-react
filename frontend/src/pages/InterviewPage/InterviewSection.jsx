import { useEffect, useState } from "react";
import { getInterview } from "../../services/api";
import { useNavigate } from "react-router-dom";
import parse from "html-react-parser";

export default function InterviewSection({
  interview = [],
  destacadas = false,
  limit = 4,
  gridCols = "md:grid-cols-4",
  showExcerpt = true,
  cardHeight = "h-48",
  titleSize = destacadas ? "text-2xl" : "text-xl",
}) {
  const navigate = useNavigate();

  const filteredInterview = interview
    .filter((news) => (destacadas ? news.destacado === true : true))
    .slice(0, limit);

  return (
    <div className="max-w-6xl px-1 py-1">
      {/* Título condicional */}
      <h2 className={`flex items-center gap-2 font-bold mb-2 ${titleSize}`}>
        {destacadas ? "Entrevistas destacadas" : "Entrevistas"}
        <span className="flex-1 h-[1px] bg-black ml-2"></span>
      </h2>

      <div className={`grid ${gridCols} gap-2`}>
        {filteredInterview.map((interviews) => (
          <div
            key={interviews.id}
            className={`relative group overflow-hidden shadow-md shadow-neutral-700 cursor-pointer m-0.5 ${cardHeight} rounded-2xl`}
            onClick={() => {
              navigate(`/entrevistas/${interviews.slug}`);
              window.scrollTo(0, 0);
            }}
          >
            <img
              src={interviews.imagen_portada}
              alt={interviews.artista}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-4 w-full text-white">
              <h3 className="text-xs xl:text-xl font-semibold leading-tight">
                Entrevista a {interviews.artista}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
