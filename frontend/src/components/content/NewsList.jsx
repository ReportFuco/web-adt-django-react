import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Media from "../ui/Media";
import Tag from "../ui/Tag";
import { MetaRow, MetaItem } from "../ui/MetaRow";
import { formatShortDate } from "../../utils/formatDate";
import useInViewOnce from "../../hooks/useInViewOnce";

/** Últimas noticias en filas editoriales (DESIGN.md §9.6 — `news-row`). */
function NewsList({ noticias }) {
  const [ref, inView] = useInViewOnce();
  if (!noticias?.length) return null;

  return (
    <div ref={ref} className={cn("flex flex-col adt-reveal", inView && "is-visible")}>
      {noticias.map((noticia) => (
        <Link
          key={noticia.id}
          to={`/noticias/${noticia.id}/${noticia.slug}`}
          className="group grid grid-cols-[96px_1fr] items-center gap-4 border-b border-line py-4 first:border-t transition-colors duration-[var(--adt-dur-fast)] hover:bg-surface focus-visible:bg-surface min-[721px]:grid-cols-[160px_1fr_auto]"
        >
          <Media ratio="43" src={noticia.imagen} alt="" zoom className="w-full" />
          <span className="min-w-0">
            <span className="block font-body text-lg font-bold leading-snug group-hover:text-signal">
              {noticia.titulo}
            </span>
            <MetaRow className="mt-2">
              <Tag>Noticias</Tag>
              <MetaItem>{formatShortDate(noticia.fecha_publicacion)}</MetaItem>
            </MetaRow>
          </span>
          <ArrowRight
            className="hidden h-[18px] w-[18px] shrink-0 text-text-muted transition-[transform,color] duration-[var(--adt-dur-fast)] group-hover:translate-x-[3px] group-hover:text-signal min-[721px]:block"
            strokeWidth={2.5}
          />
        </Link>
      ))}
    </div>
  );
}

NewsList.propTypes = {
  noticias: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      slug: PropTypes.string.isRequired,
      titulo: PropTypes.string.isRequired,
      imagen: PropTypes.string,
      fecha_publicacion: PropTypes.string,
    })
  ),
};

export default NewsList;
