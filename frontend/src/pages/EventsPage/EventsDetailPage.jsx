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
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("es-ES", options);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
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
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
              <div className="p-8">
                <div className="prose max-w-none text-gray-700 text-lg leading-relaxed mb-6">
                  {parse(cleanContent)}
                </div>

                {/* Event Highlights */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="font-bold text-lg mb-3 flex items-center">
                      <FaCalendarAlt className="text-blue-600 mr-2" /> Fecha y
                      Hora
                    </h3>
                    <p>{formatDate(evento.fecha_hora)}</p>
                  </div>
                  <div className="bg-green-50 p-6 rounded-lg">
                    <h3 className="font-bold text-lg mb-3 flex items-center">
                      <FaMapMarkerAlt className="text-green-600 mr-2" />{" "}
                      Ubicación
                    </h3>
                    <p>{evento.lugar}</p>
                    {evento.direccion && (
                      <p className="text-sm mt-1">{evento.direccion}</p>
                    )}
                  </div>
                </div>

                {/* Share Buttons */}
                <div className="border-t pt-6">
                  <h4 className="font-medium mb-3">Compartir este evento:</h4>
                  <div className="flex space-x-3">
                    <button className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200">
                      <FaShareAlt />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-1/3 space-y-6">
            {/* Ticket/Registration Box */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden top-6">
              <div className="bg-black text-white p-4 text-center">
                <h3 className="text-xl font-bold">Más Información</h3>
              </div>
              <div className="p-6">
                {evento.website && (
                  <a
                    href={evento.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 w-full inline-block text-center border border-black hover:bg-gray-100 text-black py-3 px-4 rounded-lg font-medium flex items-center justify-center"
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
            <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <FaMapMarkerAlt className="text-red-500 mr-2" /> Ubicación
              </h3>
              <div className="bg-gray-200 h-48 rounded-lg flex items-center justify-center">
                <Maps direccion={evento.direccion} />
              </div>
              {evento.direccion && (
                <p className="mt-3 text-sm text-gray-600">
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
