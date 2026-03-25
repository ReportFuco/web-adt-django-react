import { useEffect, useState } from "react";
import { getComments } from "../../services/api";

function Comments({ id }) {
  const [comentarios, setComentarios] = useState([]);

  useEffect(() => {
    async function loadComments() {
      if (id) {
        const res = await getComments(id);
        setComentarios(res);
      }
    }
    loadComments();
  }, [id]);

  if (!comentarios.length) {
    return <p className="text-center text-white/40 mt-10 uppercase tracking-[0.18em] text-xs">Sin comentarios</p>;
  }

  return (
    <div className="space-y-4">
      {comentarios.map((coment) => (
        <div key={coment.id} className="border border-white/10 bg-black/60 p-4 text-sm text-white/80">
          <p className="text-[10px] uppercase tracking-[0.22em] text-white/40 mb-2">{coment.autor_username}</p>
          <p>{coment.contenido}</p>
        </div>
      ))}
    </div>
  );
}

export default Comments;
