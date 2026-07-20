import { useQuery } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { qk } from "../../queries/keys";
import { fetchComments } from "../../queries/fetchers";

function Comments({ id }) {
  const { data: comentarios = [] } = useQuery({
    queryKey: qk.comments(id),
    queryFn: () => fetchComments(id),
    enabled: Boolean(id),
  });

  if (!comentarios.length) {
    return <p className="mt-10 text-center text-xs uppercase tracking-[0.18em] text-text-muted">Sin comentarios</p>;
  }

  return (
    <div className="space-y-4">
      {comentarios.map((coment) => (
        <div key={coment.id} className="border border-line bg-bg-soft p-4 text-sm text-text-soft">
          <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-text-muted">{coment.autor_username}</p>
          <p>{coment.contenido}</p>
        </div>
      ))}
    </div>
  );
}

Comments.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default Comments;
