import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getInterviewBySlug, getInterview } from "../../services/api";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import InterviewSection from "./InterviewSection";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { sanitizeHTML } from "../../utils/htmlSanitizer";

function InterviewDetailPage() {
  const { slug } = useParams();
  const [interview, setInterview] = useState(null);
  const [interviews, setInterviews] = useState(null);

  const cleanContent = interview?.contenido
    ? sanitizeHTML(interview.contenido)
    : "";

  useEffect(() => {
    async function loadInterviews() {
      try {
        if (slug) {
          const res = await getInterviewBySlug(slug);
          setInterview(res);
        }

        const resInterviews = await getInterview();
        setInterviews(resInterviews.data);
      } catch (error) {
        console.error("Error al cargar las noticias:", error);
        setError("Hubo un problema al cargar las noticias");
      }
    }

    loadInterviews();
  }, [slug]);

  if (!interview || !interviews) {
    return <LoadingSpinner />;
  }

  console.log(interview)
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Contenedor principal */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Tarjeta de presentación */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8 transition-all hover:shadow-xl">
            <div className="md:flex">
              {/* Imagen */}
              <div className="md:w-1/3">
                <img
                  src={interview.imagen_portada}
                  alt={interview.artista}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Contenido */}
              <div className="p-6 md:w-2/3">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                      Entrevista a {interview.artista}
                    </h1>
                    {interview.periodista && (
                      <p className="text-gray-600 mb-1">
                        Por:{" "}
                        <span className="font-medium">
                          {interview.periodista}
                        </span>
                      </p>
                    )}
                  </div>

                  {interview.instagram && (
                    <a
                      href={`https://instagram.com/${interview.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                      @{interview.instagram}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Contenido de la entrevista */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">

            <div
              className="prose max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: cleanContent }}
            />
          </div>

          <InterviewSection
            interview={interviews}
            destacadas={true}
            cardHeight="h-80"
          />
        </div>
      </main>
      <Footer />
    </>
  );
}

export default InterviewDetailPage;
