import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import Seo from "../../components/common/Seo";
import SectionHead from "../../components/ui/SectionHead";
import TagFilterRow from "../../components/ui/TagFilterRow";
import PaginationControls from "../../components/ui/PaginationControls";
import LoadingState from "../../components/ui/LoadingState";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";
import NewsList from "../../components/content/NewsList";
import { getNoticias, getTags } from "../../services/api";

function NewsPage() {
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

    getNoticias({ tag: tag || undefined, page }).then((res) => {
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
        title="Noticias de techno y música electrónica | Adictos al Techno"
        description="Últimas noticias de techno, lanzamientos, artistas, festivales y cultura electrónica en Chile y el mundo."
        canonical="https://adictosaltechno.com/noticias"
        schema={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Noticias de techno y música electrónica",
          url: "https://adictosaltechno.com/noticias",
          inLanguage: "es-CL",
        }}
      />

      <section className="wrap py-16">
        <SectionHead kicker="Noticias" title="Últimas noticias de techno" />
        <TagFilterRow
          tags={tags}
          activeTag={tag}
          onSelect={(nextTag) => updateParams({ tag: nextTag, page: null })}
        />

        {state.loading ? (
          <LoadingState label="Cargando noticias…" />
        ) : state.error ? (
          <ErrorState description="No se pudieron cargar las noticias." />
        ) : state.results.length ? (
          <>
            <NewsList noticias={state.results} />
            <PaginationControls
              page={page}
              hasPrevious={Boolean(state.previous)}
              hasNext={Boolean(state.next)}
              onPrevious={() => updateParams({ page: page - 1 })}
              onNext={() => updateParams({ page: page + 1 })}
            />
          </>
        ) : (
          <EmptyState description={tag ? `No hay noticias con la etiqueta "${tag}".` : "Todavía no hay noticias publicadas."} />
        )}
      </section>
    </>
  );
}

export default NewsPage;
