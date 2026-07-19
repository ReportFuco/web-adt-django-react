import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Quote } from "lucide-react";
import Media from "../ui/Media";

/**
 * Retratos + cita destacada (DESIGN.md §9.6 — `interview-card`). La cita
 * viene del campo `cita_destacada` (Fase 0); si una entrevista todavía no
 * lo tiene cargado, no se inventa truncando el contenido.
 */
function InterviewGrid({ entrevistas }) {
  if (!entrevistas?.length) return null;

  return (
    <div className="grid gap-6 min-[601px]:grid-cols-2 min-[901px]:grid-cols-3">
      {entrevistas.map((entrevista) => {
        const href = `/entrevistas/${entrevista.slug}`;
        return (
          <article key={entrevista.id} className="border border-line">
            <Link to={href}>
              <Media
                ratio="45"
                src={entrevista.imagen_portada}
                alt={`Retrato de ${entrevista.artista}`}
                credit={entrevista.credito_foto_portada}
              />
            </Link>
            <div className="p-4">
              <Quote className="mb-2 h-[22px] w-[22px] text-signal" fill="currentColor" />
              {entrevista.cita_destacada && (
                <blockquote className="font-display text-[1.1875rem] font-bold normal-case leading-tight tracking-[0.005em]">
                  <Link to={href} className="hover:text-signal">
                    &ldquo;{entrevista.cita_destacada}&rdquo;
                  </Link>
                </blockquote>
              )}
              <p className="mt-3 text-xs font-bold uppercase tracking-[0.05em] text-text-muted">
                <span className="text-text">{entrevista.artista}</span>
                {entrevista.rol_entrevistado && <> · {entrevista.rol_entrevistado}</>}
              </p>
            </div>
          </article>
        );
      })}
    </div>
  );
}

InterviewGrid.propTypes = {
  entrevistas: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      slug: PropTypes.string.isRequired,
      artista: PropTypes.string.isRequired,
      imagen_portada: PropTypes.string,
      credito_foto_portada: PropTypes.string,
      cita_destacada: PropTypes.string,
      rol_entrevistado: PropTypes.string,
    })
  ),
};

export default InterviewGrid;
