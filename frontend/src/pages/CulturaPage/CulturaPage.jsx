import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import Seo from "../../components/common/Seo";
import SectionHead from "../../components/ui/SectionHead";
import PaginationControls from "../../components/ui/PaginationControls";
import LoadingState from "../../components/ui/LoadingState";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";
import Gallery from "../../components/home/Gallery";
import { getGaleria } from "../../services/api";

/**
 * DECISIONES.md #6: "Cultura" es una página dedicada que reutiliza el
 * mismo agregado de fotos que Gallery del home (`/api/galeria/`), sin un
 * modelo de contenido propio.
 */
function CulturaPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const [state, setState] = useState({ loading: true, results: [], count: 0, next: null, previous: null, error: null });

  useEffect(() => {
    let cancelled = false;
    setState((prev) => ({ ...prev, loading: true }));

    getGaleria({ page }).then((res) => {
      if (cancelled) return;
      setState({ loading: false, ...res });
    });

    return () => {
      cancelled = true;
    };
  }, [page]);

  const updatePage = (nextPage) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", nextPage);
    setSearchParams(params);
  };

  return (
    <>
      <Seo
        title="Cultura y galería techno | Adictos al Techno"
        description="Fotografía documental de la escena techno: eventos, noticias y entrevistas en imágenes."
        canonical="https://adictosaltechno.com/cultura"
        schema={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Cultura y galería techno",
          url: "https://adictosaltechno.com/cultura",
          inLanguage: "es-CL",
        }}
      />

      <section className="wrap py-16">
        <SectionHead kicker="Escena" title="Cultura" />

        {state.loading ? (
          <LoadingState label="Cargando galería…" />
        ) : state.error ? (
          <ErrorState description="No se pudo cargar la galería." />
        ) : state.results.length ? (
          <>
            <Gallery fotos={state.results} />
            <PaginationControls
              page={page}
              hasPrevious={Boolean(state.previous)}
              hasNext={Boolean(state.next)}
              onPrevious={() => updatePage(page - 1)}
              onNext={() => updatePage(page + 1)}
            />
          </>
        ) : (
          <EmptyState description="Todavía no hay fotos publicadas." />
        )}
      </section>
    </>
  );
}

export default CulturaPage;
