import { useParams } from "react-router-dom";
import { getEventBySlug, getEvents } from "../../services/api";
import { useState, useEffect } from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import EventSection from "./EventSection";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { sanitizeHTML } from "../../utils/htmlSanitizer";
import parse from "html-react-parser";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaLink,
  FaShareAlt,
} from "react-icons/fa";
import Maps from "../../components/features/Maps";

function EventsDetailPage() {
  const { slug } = useParams();
  const [evento, setEvento] = useState(null);
  const [eventos, setEventos] = useState(null);

  const cleanContent = evento ? sanitizeHTML(evento.descripcion) : "";

  useEffect(() => {
    async function loadEvents() {
      try {
        if (slug) {
          const res = await getEventBySlug(slug);
          setEvento(res.data);
        }

        const resEventos = await getEvents();
        setEventos(resEventos.data);
      } catch (error) {
        console.error("Error al cargar el evento:", error);
        setError("Hubo un problema al cargar el evento");
      }
    }

    loadEvents();
  }, [slug]);

  if (!evento || !eventos) {
    return <LoadingSpinner />;
  }

  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("es-ES", options);
  };

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={evento.imagen}
          alt={evento.nombre}
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-90"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="max-w-6xl mx-auto">
            <span className="inline-block px-3 py-1 bg-white text-black text-sm font-semibold rounded-full mb-4">
              Evento Destacado
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              {evento.nombre}
            </h1>
            <div className="flex items-center space-x-4 text-lg">
              <span className="flex items-center">
                <FaMapMarkerAlt className="mr-2" /> {evento.lugar}
              </span>
              <span className="flex items-center">
                <FaCalendarAlt className="mr-2" />{" "}
                {formatDate(evento.fecha_hora)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Event Details */}
          <div className="lg:w-2/3">
            <div className="rounded-xl shadow-md overflow-hidden mb-8">
              <div className="p-8">
                <div className="prose max-w-none text-neutral-300 text-lg leading-relaxed mb-6">
                  {parse(cleanContent)}
                </div>

                {/* Event Highlights */}
                <div className="grid grid-cols-1 font-bold text-lg text-white md:grid-cols-2 gap-6 mb-8">
                  <div className="p-4 border-1 border-neutral-700 rounded-xs">
                    <h3 className=" mb-3 flex items-center">
                      <FaCalendarAlt className=" mr-2" /> Fecha y Hora
                    </h3>
                    <p>{formatDate(evento.fecha_hora)}</p>
                  </div>
                  <div className=" p-4 border-1 border-neutral-700 rounded-xs">
                    <h3 className="mb-3 flex items-center">
                      <FaMapMarkerAlt className=" mr-2" /> Ubicación
                    </h3>
                    <p>{evento.lugar}</p>
                    {evento.direccion && (
                      <p className="text-sm mt-1">{evento.direccion}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-1/3 space-y-6">
            {/* Ticket/Registration Box */}
            <div className="rounded-md neutral-950 text-white">
              <div className="bg-gradient-to-tl from-red-950 to-black p-2 text-center rounded-xs">
                <h3 className="text-xl font-bold">Más Información</h3>
              </div>
              <div className="p-4 bg-neutral-950">
                {evento.website && (
                  <a
                    href={evento.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center mt-4 w-full text-center bg-black hover:bg-neutral-900  py-3 px-4 rounded-lg font-medium"
                  >
                    <FaLink className="mr-2" /> Sitio Oficial
                  </a>
                )}

                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-semibold mb-2">Organizado por:</h4>
                  <p>{evento.organizacion || "Organización del evento"}</p>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="text-neutral-300 rounded-xs border border-neutral-700 overflow-hidden p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <FaMapMarkerAlt className="text-red-500 mr-2" /> Ubicación
              </h3>
              <div className="bg-gray-200 h-48 rounded-lg overflow-hidden">
                <Maps direccion={evento.direccion} />
              </div>
              {evento.direccion && (
                <p className="mt-3 text-sm text-neutral-300">
                  <span className="font-medium">Dirección:</span>{" "}
                  {evento.direccion}
                </p>
              )}
            </div>

            <EventSection
              event={eventos}
              gridCols="md:grid-cols-1"
              limit={3}
              destacadas={true}
              cardHeight="h-80"
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default EventsDetailPage;
