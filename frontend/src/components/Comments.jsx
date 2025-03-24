import React, { useEffect, useState } from "react";
import { getComments } from "../services/api";

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
    return (
      <p className="text-center text-gray-600 mt-10">Sin comentarios</p>
    );
  }

  return (
    <div>
      {comentarios.map((coment) => (
        <p className="m-4" key={coment.id}><strong>{coment.autor_username}</strong>: {coment.contenido}</p>
      ))}
    </div>
  );
}

export default Comments;
