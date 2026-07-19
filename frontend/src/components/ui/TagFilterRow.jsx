import PropTypes from "prop-types";
import Tag from "./Tag";

/** Fila de filtro por tag para listados (DESIGN.md §9.2 — `tag--active`). */
function TagFilterRow({ tags, activeTag, onSelect }) {
  if (!tags?.length) return null;

  return (
    <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filtrar por etiqueta">
      <button type="button" onClick={() => onSelect(null)}>
        <Tag as="span" active={!activeTag}>
          Todo
        </Tag>
      </button>
      {tags.map((tag) => (
        <button key={tag.id} type="button" onClick={() => onSelect(tag.nombre)}>
          <Tag as="span" active={activeTag === tag.nombre}>
            {tag.nombre}
          </Tag>
        </button>
      ))}
    </div>
  );
}

TagFilterRow.propTypes = {
  tags: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      nombre: PropTypes.string.isRequired,
    })
  ),
  activeTag: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
};

export default TagFilterRow;
