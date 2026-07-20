import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import Seo from "../../components/common/Seo";
import SectionHead from "../../components/ui/SectionHead";
import PaginationControls from "../../components/ui/PaginationControls";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";
import Gallery from "../../components/home/Gallery";
import GallerySkeleton from "../../components/home/GallerySkeleton";
import { qk } from "../../queries/keys";
import { fetchGaleria } from "../../queries/fetchers";

/**
 * DECISIONES.md #6: "Cultura" es una página dedicada que reutiliza el
 * mismo agregado de fotos que Gallery del home (`/api/galeria/`), sin un
 * modelo de contenido propio.
 */
function CulturaPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;

  const params = { page };
  const { data, isPending, isError, isPlaceholderData } = useQuery({
    queryKey: qk.galeria(params),
    queryFn: () => fetchGaleria(params),
    placeholderData: keepPreviousData,
  });

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

        {isPending ? (
          <GallerySkeleton />
        ) : isError ? (
          <ErrorState description="No se pudo cargar la galería." />
        ) : data.results.length ? (
          <div aria-busy={isPlaceholderData}>
            <Gallery fotos={data.results} />
            <PaginationControls
              page={page}
              hasPrevious={Boolean(data.previous)}
              hasNext={Boolean(data.next)}
              onPrevious={() => updatePage(page - 1)}
              onNext={() => updatePage(page + 1)}
            />
          </div>
        ) : (
          <EmptyState description="Todavía no hay fotos publicadas." />
        )}
      </section>
    </>
  );
}

export default CulturaPage;
