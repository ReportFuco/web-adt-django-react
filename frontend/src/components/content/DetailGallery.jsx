import PropTypes from "prop-types";
import Media from "../ui/Media";
import Kicker from "../ui/Kicker";

/**
 * Galería de fotos propia de una noticia/evento/entrevista (`fotos`,
 * PLAN.md Fase 5). Distinta de home/Gallery.jsx (que agrega fotos de todo
 * el sitio vía `/api/galeria/`) — esta usa el array anidado del propio
 * detalle, ya incluido en el serializer.
 */
function DetailGallery({ fotos }) {
  if (!fotos?.length) return null;

  return (
    <div>
      <Kicker>Galería</Kicker>
      <div className="grid grid-cols-2 gap-2 min-[561px]:grid-cols-3">
        {fotos.map((foto) => (
          <Media
            key={foto.id}
            ratio="11"
            src={foto.url_publica || foto.imagen}
            alt={foto.titulo || ""}
            credit={foto.credito}
            className="rounded-adt"
          />
        ))}
      </div>
    </div>
  );
}

DetailGallery.propTypes = {
  fotos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      imagen: PropTypes.string,
      url_publica: PropTypes.string,
      titulo: PropTypes.string,
      credito: PropTypes.string,
    })
  ),
};

export default DetailGallery;
