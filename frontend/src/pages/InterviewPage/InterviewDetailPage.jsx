import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getInterviewBySlug, getInterview } from "../../services/api";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import InterviewSection from "./InterviewSection";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { sanitizeHTML } from "../../utils/htmlSanitizer";
import Instagram from "../../assets/icons/instagram-brands-solid.svg";
import Socialmedia from "@/components/common/socialMedia";

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

  console.log(interview);
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Contenedor principal */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Tarjeta de presentación */}
          <div className="text-white rounded-xs shadow-lg overflow-hidden mb-8 transition-all hover:shadow-xl">
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
              <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-start">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-300 mb-2">
                    Entrevista a {interview.artista}
                  </h1>
                  {interview.periodista && (
                    <p className="text-gray-400 text-sm md:text-base mb-1">
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
                    className="flex items-center gap-2 self-start md:self-center bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full text-xs md:text-sm font-semibold hover:opacity-90 transition-opacity px-4 py-2 cursor-pointer"
                  >
                    <img src={Instagram} alt="Instagram" width="15" />@
                    {interview.instagram}
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="p-6 mb-8">
            <div
              className="prose max-w-none text-gray-300"
              dangerouslySetInnerHTML={{ __html: cleanContent }}
            />
          </div>

          <InterviewSection
            interview={interviews}
            destacadas={true}
            cardHeight="h-80"
          />
        </div>
        <Socialmedia />
      </main>
      <Footer />
    </>
  );
}

export default InterviewDetailPage;
