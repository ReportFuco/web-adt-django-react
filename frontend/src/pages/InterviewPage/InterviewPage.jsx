import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import Seo from "../../components/common/Seo";
import SectionHead from "../../components/ui/SectionHead";
import TagFilterRow from "../../components/ui/TagFilterRow";
import PaginationControls from "../../components/ui/PaginationControls";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";
import InterviewGrid from "../../components/content/InterviewGrid";
import InterviewGridSkeleton from "../../components/content/InterviewGridSkeleton";
import { getInterview, getTags } from "../../services/api";

function InterviewPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tag = searchParams.get("tag");
  const page = Number(searchParams.get("page")) || 1;

  const [state, setState] = useState({ loading: true, results: [], count: 0, next: null, previous: null, error: null });
  const [tags, setTags] = useState([]);

  useEffect(() => {
    getTags().then((res) => setTags(res.results));
  }, []);

  useEffect(() => {
    let cancelled = false;
    setState((prev) => ({ ...prev, loading: true }));

    getInterview({ tag: tag || undefined, page }).then((res) => {
      if (cancelled) return;
      setState({ loading: false, ...res });
    });

    return () => {
      cancelled = true;
    };
  }, [tag, page]);

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

        {state.loading ? (
          <InterviewGridSkeleton />
        ) : state.error ? (
          <ErrorState description="No se pudieron cargar las entrevistas." />
        ) : state.results.length ? (
          <>
            <InterviewGrid entrevistas={state.results} />
            <PaginationControls
              page={page}
              hasPrevious={Boolean(state.previous)}
              hasNext={Boolean(state.next)}
              onPrevious={() => updateParams({ page: page - 1 })}
              onNext={() => updateParams({ page: page + 1 })}
            />
          </>
        ) : (
          <EmptyState description={tag ? `No hay entrevistas con la etiqueta "${tag}".` : "Todavía no hay entrevistas publicadas."} />
        )}
      </section>
    </>
  );
}

export default InterviewPage;
