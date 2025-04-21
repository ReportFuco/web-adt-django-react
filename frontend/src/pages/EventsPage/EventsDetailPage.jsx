import { useParams, useNavigate } from "react-router-dom";
import { getEventBySlug } from "../../services/api";
import { useState, useEffect } from "react";
import Header from "../../components/layout/Header";

function EventsDetailPage() {
  const { slug } = useParams();
  const [evento, setEvento] = useState([]);
  useEffect(() => {
    async function loadEvent() {
      if (slug) {
        const res = await getEventBySlug(slug);
        setEvento(res.data);
      }
    }
    loadEvent();
  }, [slug]);

  if (!evento) {
    return <p className="text-center text-gray-600 mt-10">Cargando...</p>;
  }

  return (
    <div>
      <Header />
      <h1 className="text-black">{evento.nombre}</h1>
      <p>{evento.descripcion}</p>
      <p>{evento.fecha_hora}</p>
      <p>{evento.website}</p>
      <p>{evento.lugar}</p>
      <img src={evento.imagen} alt={evento.nombre} />
    </div>
  );
}

export default EventsDetailPage;
