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

  const cleanContent = interview?.contenido ? sanitizeHTML(interview.contenido) : "";

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

  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;
  if (!interview || !interviews) return <LoadingSpinner />;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="relative min-h-[68vh] flex items-end overflow-hidden border-b border-white/10">
          <div className="absolute inset-0">
            <img src={interview.imagen_portada} alt={interview.artista} className="w-full h-full object-cover grayscale opacity-40 brightness-50" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/60 to-black/20"></div>
          </div>

          <div className="relative z-20 max-w-7xl mx-auto w-full px-6 md:px-8 py-12 md:py-16 text-white">
            <span className="inline-block border border-white/20 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.24em] mb-5">Entrevista</span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-[0.94] tracking-tight max-w-5xl mb-5">{interview.artista}</h1>
            {interview.descripcion && <p className="text-lg md:text-xl text-white/70 max-w-3xl mb-5">{interview.descripcion}</p>}

            <div className="flex flex-col md:flex-row md:flex-wrap gap-4 md:gap-8 items-start md:items-center text-[11px] uppercase tracking-[0.24em] text-white/55 font-bold">
              {interview.periodista && <span>Entrevistado por {interview.periodista}</span>}
              {interview.fecha && (
                <span>
                  {new Date(interview.fecha).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              )}
              {interview.instagram && (
                <a
                  href={`https://instagram.com/${interview.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 border border-white/20 px-5 py-3 text-white hover:bg-white hover:text-black transition-all"
                >
                  <img src={Instagram} alt="Instagram" className="w-4 h-4 brightness-0 invert group-hover:invert-0 transition" />
                  <span>@{interview.instagram}</span>
                </a>
              )}
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 flex flex-col gap-8">
          <article className="border border-white/10 bg-[#101010] p-6 md:p-10 prose prose-invert prose-lg max-w-none text-white/85" dangerouslySetInnerHTML={{ __html: cleanContent }} />

          <div className="border border-white/10 bg-[#0f0f0f] p-4 md:p-5">
            <InterviewSection interview={interviews} destacadas={true} limit={3} gridCols="grid-cols-1 md:grid-cols-3" cardHeight="h-[22rem]" />
          </div>

          <Socialmedia />
        </div>
      </main>
      <Footer />
    </>
  );
}

export default InterviewDetailPage;
