import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import Seo from "../../components/common/Seo";
import SectionHead from "../../components/ui/SectionHead";
import TagFilterRow from "../../components/ui/TagFilterRow";
import PaginationControls from "../../components/ui/PaginationControls";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";
import InterviewGrid from "../../components/content/InterviewGrid";
import InterviewGridSkeleton from "../../components/content/InterviewGridSkeleton";
import { qk } from "../../queries/keys";
import { fetchEntrevistas, fetchTags } from "../../queries/fetchers";

function InterviewPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tag = searchParams.get("tag");
  const page = Number(searchParams.get("page")) || 1;

  const params = { tag: tag || undefined, page };
  const { data, isPending, isError, isPlaceholderData } = useQuery({
    queryKey: qk.entrevistas.list(params),
    queryFn: () => fetchEntrevistas(params),
    placeholderData: keepPreviousData,
  });

  const { data: tagsData } = useQuery({
    queryKey: qk.tags(),
    queryFn: () => fetchTags(),
    staleTime: 30 * 60 * 1000,
  });
  const tags = tagsData?.results ?? [];

  const updateParams = (next) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(next).forEach(([key, value]) => {
      if (value === null || value === undefined) params.delete(key);
      else params.set(key, value);
    });
    setSearchParams(params);
  };

  return (
    <>
      <Seo
        title="Entrevistas de techno y cultura electrónica | Adictos al Techno"
        description="Conversaciones con DJs, productores, artistas y protagonistas de la cultura techno en Chile y el circuito internacional."
        canonical="https://adictosaltechno.com/entrevistas"
        schema={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Entrevistas de techno y cultura electrónica",
          url: "https://adictosaltechno.com/entrevistas",
          inLanguage: "es-CL",
        }}
      />

      <section className="wrap py-16">
        <SectionHead kicker="Entrevistas" title="Voces de la escena" />
        <TagFilterRow
          tags={tags}
          activeTag={tag}
          onSelect={(nextTag) => updateParams({ tag: nextTag, page: null })}
        />

        {isPending ? (
          <InterviewGridSkeleton />
        ) : isError ? (
          <ErrorState description="No se pudieron cargar las entrevistas." />
        ) : data.results.length ? (
          <div aria-busy={isPlaceholderData}>
            <InterviewGrid entrevistas={data.results} />
            <PaginationControls
              page={page}
              hasPrevious={Boolean(data.previous)}
              hasNext={Boolean(data.next)}
              onPrevious={() => updateParams({ page: page - 1 })}
              onNext={() => updateParams({ page: page + 1 })}
            />
          </div>
        ) : (
          <EmptyState description={tag ? `No hay entrevistas con la etiqueta "${tag}".` : "Todavía no hay entrevistas publicadas."} />
        )}
      </section>
    </>
  );
}

export default InterviewPage;
