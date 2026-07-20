import PropTypes from "prop-types";
import { cn } from "@/lib/utils";
import Breadcrumbs from "../common/Breadcrumbs";
import Tag from "../ui/Tag";

/**
 * Portada tipo hero para páginas de detalle (noticia/evento/entrevista) —
 * PLAN.md Fase 5. Foto a sangre + velo oscuro (siempre, en ambos temas,
 * DESIGN.md §2.3) + breadcrumbs/kicker/título/meta/tags sobre la foto.
 */
function DetailHero({ kicker, title, breadcrumbItems, imagen, imageAlt = "", dek, meta, tags, grayscale = false }) {
  return (
    <section className="relative flex min-h-[68vh] items-end overflow-hidden border-b border-line">
      {imagen && (
        <img
          src={imagen}
          alt={imageAlt}
          loading="eager"
          decoding="async"
          className={cn("absolute inset-0 h-full w-full object-cover", grayscale && "grayscale")}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-black/20" />
      <div className="wrap relative z-10 py-16 text-on-photo">
        <Breadcrumbs items={breadcrumbItems} />
        <Tag className="mb-5 border-on-photo/30 text-on-photo">{kicker}</Tag>
        <h1 className="mb-4 max-w-5xl break-words text-on-photo text-[clamp(2.2rem,5vw,4rem)]">{title}</h1>
        {dek && <p className="mb-4 max-w-3xl text-lg text-on-photo/82">{dek}</p>}
        {meta}
        {tags?.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Tag key={tag.id ?? tag.nombre ?? tag} className="border-on-photo/30 text-on-photo">
                {tag.nombre ?? tag}
              </Tag>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

DetailHero.propTypes = {
  kicker: PropTypes.node.isRequired,
  title: PropTypes.node.isRequired,
  breadcrumbItems: PropTypes.array,
  imagen: PropTypes.string,
  imageAlt: PropTypes.string,
  dek: PropTypes.node,
  meta: PropTypes.node,
  tags: PropTypes.array,
  grayscale: PropTypes.bool,
};

export default DetailHero;
