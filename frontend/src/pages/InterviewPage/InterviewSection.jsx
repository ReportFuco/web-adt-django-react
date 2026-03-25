import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const interviewShape = PropTypes.shape({
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  artista: PropTypes.string,
  slug: PropTypes.string,
  imagen_portada: PropTypes.string,
  destacado: PropTypes.bool,
});

export default function InterviewSection({
  interview = [],
  destacadas = false,
  limit = 4,
  gridCols = "md:grid-cols-4",
  cardHeight = "h-48",
}) {
  const navigate = useNavigate();

  const filteredInterview = interview
    .filter((item) => (destacadas ? item.destacado === true : true))
    .slice(0, limit);

  return (
    <div className="max-w-7xl px-0 py-0 text-white">
      <div className="section-title mb-10">
        <div>
          <h2 className="section-title-heading">{destacadas ? "Entrevistas" : "Conversaciones"}</h2>
          <p className="section-title-kicker">Voices from the underground</p>
        </div>
      </div>

      <div className={`editorial-grid ${gridCols}`}>
        {filteredInterview.map((item) => (
          <article
            key={item.id}
            className={`editorial-card p-6 md:p-8 flex flex-col gap-6 group ${cardHeight}`}
            onClick={() => {
              navigate(`/entrevistas/${item.slug}`);
              window.scrollTo(0, 0);
            }}
          >
            <div className="relative flex-1 overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
              <img src={item.imagen_portada} alt={item.artista} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute top-4 left-4 bg-black text-[10px] font-bold px-3 py-1 uppercase tracking-tight border border-white/10">Entrevista</div>
            </div>
            <div className="flex flex-col gap-4">
              <h3 className="text-2xl font-bold leading-tight group-hover:text-white transition-colors uppercase">{item.artista}</h3>
              <button className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 group/btn text-white/80">
                Leer más <span className="group-hover/btn:translate-x-2 transition-transform">→</span>
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

InterviewSection.propTypes = {
  interview: PropTypes.arrayOf(interviewShape),
  destacadas: PropTypes.bool,
  limit: PropTypes.number,
  gridCols: PropTypes.string,
  cardHeight: PropTypes.string,
};
