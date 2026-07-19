import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import Media from "../ui/Media";
import useInViewOnce from "../../hooks/useInViewOnce";

const DETAIL_ROUTE = {
  noticia: (item) => `/noticias/${item.contenido_id}/${item.contenido_slug}`,
  evento: (item) => `/eventos/${item.contenido_id}/${item.contenido_slug}`,
  entrevista: (item) => `/entrevistas/${item.contenido_slug}`,
};

/**
 * Galería/Escena del home (DESIGN.md §9.6 — `gallery-grid`). Contenido
 * nuevo que hoy no se muestra en ninguna página: fotos agregadas de
 * FotoNoticia/FotoEvento/FotoEntrevista vía `/api/galeria/` (Fase 0).
 */
function Gallery({ fotos }) {
  const [ref, inView] = useInViewOnce();
  if (!fotos?.length) return null;

  return (
    <div
      ref={ref}
      className={cn(
        "grid grid-cols-3 gap-2 adt-reveal min-[561px]:grid-cols-4 min-[901px]:grid-cols-6",
        inView && "is-visible"
      )}
    >
      {fotos.map((foto) => {
        const buildHref = DETAIL_ROUTE[foto.tipo];
        const alt = foto.titulo || foto.contenido_titulo || "";
        const content = (
          <Media ratio="11" src={foto.imagen} alt={alt} credit={foto.credito} className="rounded-adt" />
        );
        return (
          <Link key={`${foto.tipo}-${foto.id}`} to={buildHref ? buildHref(foto) : "#"}>
            {content}
          </Link>
        );
      })}
    </div>
  );
}

Gallery.propTypes = {
  fotos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      tipo: PropTypes.oneOf(["noticia", "evento", "entrevista"]).isRequired,
      imagen: PropTypes.string,
      titulo: PropTypes.string,
      credito: PropTypes.string,
      contenido_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      contenido_slug: PropTypes.string,
      contenido_titulo: PropTypes.string,
    })
  ),
};

export default Gallery;
