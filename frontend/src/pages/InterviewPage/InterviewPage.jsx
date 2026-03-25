import { useState, useEffect } from "react";

import Header from "../../components/layout/Header";
import SpotifyPlaylist from "../../components/common/SpotifyPlaylist";
import Footer from "../../components/layout/Footer";
import InterviewSection from "./InterviewSection";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { getInterview } from "../../services/api";
import Socialmedia from "../../components/common/socialMedia";
import Seo from "../../components/common/Seo";

function InterviewPage() {
  const [interview, setInterview] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadNews() {
      try {
        const interviewsData = await getInterview();

        if (!Array.isArray(interviewsData)) {
          throw new Error("Respuesta inválida al cargar entrevistas");
        }

        setInterview(interviewsData);
      } catch (error) {
        console.error("Error cargando entrevistas:", error);
        setError("Error al cargar las entrevistas");
      }
    }

    loadNews();
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500 text-xl">{error}</p>
      </div>
    );
  }

  if (!interview) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Seo
        title="Entrevistas de techno y cultura electrónica | Adictos al Techno"
        description="Entrevistas a DJs, productores y protagonistas de la escena techno y electrónica en Chile y el mundo."
        canonical="https://adictosaltechno.com/entrevistas"
        schema={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Entrevistas de techno y cultura electrónica",
          url: "https://adictosaltechno.com/entrevistas",
          inLanguage: "es-CL",
        }}
      />
      <Header />
      <main className="min-h-screen flex flex-col">
        <section className="md:col-span-4 flex flex-col gap-4 items-center">
          <p className="text-[11px] uppercase tracking-[0.28em] text-white/45 font-semibold text-center mt-4">
            Voces de la escena techno y electrónica
          </p>
          <h1 className="text-3xl font-extrabold text-center my-1">
            Entrevistas de techno y cultura electrónica
          </h1>
          <p className="text-sm md:text-base text-white/60 text-center max-w-3xl px-4 mb-2">
            Conversaciones con DJs, productores, artistas y protagonistas de la cultura techno en Chile y el circuito internacional.
          </p>

          <article className="p-0.5">
            <InterviewSection
              interview={interview}
              destacadas={true}
              limit={10}
              gridCols="grid-cols-2"
              cardHeight="h-55 md:h-90"
            />
          </article>
          <article className="p-0.5">
            <InterviewSection
              interview={interview}
              destacadas={false}
              limit={10}
              gridCols="grid-cols-2 md:grid-cols-4"
              cardHeight="h-55 md:h-90"
            />
          </article>
        </section>

        <Socialmedia />
        <SpotifyPlaylist />
        <Footer />
      </main>
    </>
  );
}

export default InterviewPage;
