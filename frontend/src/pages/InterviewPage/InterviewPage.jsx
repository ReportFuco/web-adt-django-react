import Header from "../../components/layout/Header";
import SpotifyPlaylist from "../../components/common/SpotifyPlaylist";
import Footer from "../../components/layout/Footer";
import InterviewSection from "./InterviewSection";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { useState, useEffect } from "react";
import { getInterview } from "../../services/api";
import Socialmedia from "../../components/common/socialMedia";

function InterviewPage() {
  const [interview, setInterview] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadNews() {
      try {
        const res = await getInterview();
        const interviewsData = Array.isArray(res?.data) ? res.data : null;

        if (!interviewsData) {
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
      <Header />
      <main className="min-h-screen flex flex-col">
        <section className="md:col-span-4 flex flex-col gap-4 items-center">
          <h1 className="text-3xl font-extrabold text-center my-4">
            Últimas entrevistas
          </h1>

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
