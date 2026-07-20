import { useEffect, useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";

import Seo from "../../components/common/Seo";
import SectionHead from "../../components/ui/SectionHead";
import Tag from "../../components/ui/Tag";
import Media from "../../components/ui/Media";
import PaginationControls from "../../components/ui/PaginationControls";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";
import SearchResultsSkeleton from "../../components/content/SearchResultsSkeleton";
import { qk } from "../../queries/keys";
import { fetchBusqueda } from "../../queries/fetchers";
import { formatShortDate } from "../../utils/formatDate";

const TIPO_LABEL = { noticia: "Noticias", evento: "Eventos", entrevista: "Entrevistas" };

const buildHref = (item) => {
  if (item.tipo === "entrevista") return `/entrevistas/${item.slug}`;
  return `/${item.tipo === "noticia" ? "noticias" : "eventos"}/${item.id}/${item.slug}`;
};

/** DECISIONES.md #4: resultados de /api/buscar/ (título/tag). */
function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const page = Number(searchParams.get("page")) || 1;
  const [inputValue, setInputValue] = useState(query);

  useEffect(() => {
    setInputValue(query);
  }, [query]);

  const params = { page };
  const { data, isPending, isError, isPlaceholderData } = useQuery({
    queryKey: qk.busqueda(query, params),
    queryFn: () => fetchBusqueda(query, params),
    enabled: Boolean(query),
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  });

  const updateParams = (next) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(next).forEach(([key, value]) => {
      if (value === null || value === undefined) params.delete(key);
      else params.set(key, value);
    });
    setSearchParams(params);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    updateParams({ q: inputValue.trim() || null, page: null });
  };

  return (
    <>
      <Seo
        title={query ? `Buscar "${query}" | Adictos al Techno` : "Buscar | Adictos al Techno"}
        description="Busca noticias, eventos y entrevistas de techno y cultura electrónica."
        canonical="https://adictosaltechno.com/buscar"
      />

      <section className="wrap py-16">
        <SectionHead kicker="Buscar" title={query ? `Resultados para "${query}"` : "Buscar"} />

        <form role="search" onSubmit={handleSubmit} className="mb-10 flex max-w-lg gap-2">
          <label htmlFor="search-page-input" className="sr-only">
            Buscar noticias, eventos y entrevistas
          </label>
          <input
            id="search-page-input"
            type="search"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            placeholder="Buscar…"
            className="min-h-11 flex-1 rounded-adt border border-control-line bg-surface px-4 text-text focus:border-signal focus:outline-none"
          />
          <button
            type="submit"
            className="min-h-11 rounded-adt bg-text px-6 text-xs font-bold uppercase tracking-[0.06em] text-bg hover:bg-signal hover:text-on-signal"
          >
            Buscar
          </button>
        </form>

        {!query ? (
          <EmptyState description="Escribe un término para buscar en noticias, eventos y entrevistas." />
        ) : isPending ? (
          <SearchResultsSkeleton />
        ) : isError ? (
          <ErrorState description="No se pudo completar la búsqueda." />
        ) : data.results.length ? (
          <div aria-busy={isPlaceholderData}>
            <div className="flex flex-col">
              {data.results.map((item) => (
                <Link
                  key={`${item.tipo}-${item.id}`}
                  to={buildHref(item)}
                  className="group grid grid-cols-[96px_1fr] items-center gap-4 border-b border-line py-4 first:border-t"
                >
                  <Media ratio="43" src={item.imagen} alt="" />
                  <span className="min-w-0">
                    <span className="block font-body text-lg font-bold leading-snug group-hover:text-signal">
                      {item.titulo}
                    </span>
                    <span className="mt-2 flex items-center gap-3">
                      <Tag>{TIPO_LABEL[item.tipo]}</Tag>
                      {item.fecha && (
                        <span className="text-xs text-text-muted">{formatShortDate(item.fecha)}</span>
                      )}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
            <PaginationControls
              page={page}
              hasPrevious={Boolean(data.previous)}
              hasNext={Boolean(data.next)}
              onPrevious={() => updateParams({ page: page - 1 })}
              onNext={() => updateParams({ page: page + 1 })}
            />
          </div>
        ) : (
          <EmptyState description={`No encontramos resultados para "${query}".`} />
        )}
      </section>
    </>
  );
}

export default SearchResultsPage;
