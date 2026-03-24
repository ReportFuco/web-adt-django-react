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
  const [error, setError] = useState(null);

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

  if (error) {
    return <div className="text-center text-red-500 py-10">{error}</div>;
  }

  if (!interview || !interviews) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="relative text-white rounded-lg shadow-xl overflow-hidden mb-8 bg-gradient-to-br from-neutral-900 to-neutral-950 border border-gray-900">
            <div className="w-full h-[200px] md:h-[300px] lg:h-[450px] relative">
              <img
                src={interview.imagen_portada}
                alt={interview.artista}
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent"></div>
              <div className="absolute top-4 left-4">
                <span className="bg-[#ff3131] backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                  Entrevista
                </span>
              </div>
            </div>

            <div className="p-6 lg:p-10">
              <h1 className="text-3xl lg:text-5xl font-bold mb-4 leading-tight">
                {interview.artista}
              </h1>

              {interview.periodista && (
                <p className="text-gray-300 text-sm lg:text-base mb-4">
                  Entrevistado por{" "}
                  <span className="font-semibold text-[#ff3131]">
                    {interview.periodista}
                  </span>
                </p>
              )}

              {interview.descripcion && (
                <p className="text-gray-400 text-base leading-relaxed mb-6">
                  {interview.descripcion}
                </p>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-6 border-t border-gray-700">
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                  {interview.fecha && (
                    <span className="flex items-center gap-2">
                      📅{" "}
                      {new Date(interview.fecha).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  )}
                  {interview.duracion_lectura && (
                    <span className="flex items-center gap-2">
                      ⏱ {interview.duracion_lectura} min de lectura
                    </span>
                  )}
                </div>

                {interview.instagram && (
                  <a
                    href={`https://instagram.com/${interview.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 bg-gradient-to-r from-[#ff3131] via-red-500 to-red-400 text-white rounded-xl px-6 py-3 font-semibold hover:scale-105 hover:shadow-lg transition-transform duration-300 text-sm lg:text-base"
                  >
                    <img
                      src={Instagram}
                      alt="Instagram"
                      className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300"
                    />
                    <span>@{interview.instagram}</span>
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
