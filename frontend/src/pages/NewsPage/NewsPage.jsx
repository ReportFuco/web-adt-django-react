import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import Seo from "../../components/common/Seo";
import SectionHead from "../../components/ui/SectionHead";
import TagFilterRow from "../../components/ui/TagFilterRow";
import PaginationControls from "../../components/ui/PaginationControls";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";
import NewsList from "../../components/content/NewsList";
import NewsListSkeleton from "../../components/content/NewsListSkeleton";
import { qk } from "../../queries/keys";
import { fetchNoticias, fetchTags } from "../../queries/fetchers";

function NewsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tag = searchParams.get("tag");
  const page = Number(searchParams.get("page")) || 1;

  const params = { tag: tag || undefined, page };
  const { data, isPending, isError, isPlaceholderData } = useQuery({
    queryKey: qk.noticias.list(params),
    queryFn: () => fetchNoticias(params),
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

        {isPending ? (
          <NewsListSkeleton />
        ) : isError ? (
          <ErrorState description="No se pudieron cargar las noticias." />
        ) : data.results.length ? (
          <div aria-busy={isPlaceholderData}>
            <NewsList noticias={data.results} />
            <PaginationControls
              page={page}
              hasPrevious={Boolean(data.previous)}
              hasNext={Boolean(data.next)}
              onPrevious={() => updateParams({ page: page - 1 })}
              onNext={() => updateParams({ page: page + 1 })}
            />
          </div>
        ) : (
          <EmptyState description={tag ? `No hay noticias con la etiqueta "${tag}".` : "Todavía no hay noticias publicadas."} />
        )}
      </section>
    </>
  );
}

export default NewsPage;
