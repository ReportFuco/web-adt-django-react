import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { MapPin } from "lucide-react";

import Seo from "../../components/common/Seo";
import SectionHead from "../../components/ui/SectionHead";
import TagFilterRow from "../../components/ui/TagFilterRow";
import PaginationControls from "../../components/ui/PaginationControls";
import LoadingState from "../../components/ui/LoadingState";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";
import AgendaRow from "../../components/ui/AgendaRow";
import { getEvents, getTags } from "../../services/api";
import { getEventDateItems, getLocalDate } from "../../utils/eventDates";

const isToday = (date) => {
  const today = new Date();
  return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
};

function EventsPage() {
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

    getEvents({ tag: tag || undefined, proximos: true, page }).then((res) => {
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
        title="Eventos techno y música electrónica | Adictos al Techno"
        description="Agenda de eventos, fiestas y festivales de techno y música electrónica en Chile y el mundo."
        canonical="https://adictosaltechno.com/eventos"
        schema={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Eventos techno y música electrónica",
          url: "https://adictosaltechno.com/eventos",
          inLanguage: "es-CL",
        }}
      />

      <section className="wrap py-16">
        <SectionHead kicker="Eventos" title="Calendario de eventos" />
        <TagFilterRow
          tags={tags}
          activeTag={tag}
          onSelect={(nextTag) => updateParams({ tag: nextTag, page: null })}
        />

        {state.loading ? (
          <LoadingState label="Cargando eventos…" />
        ) : state.error ? (
          <ErrorState description="No se pudieron cargar los eventos." />
        ) : state.results.length ? (
          <>
            <div className="border-t border-line">
              {state.results.map((evento) => {
                const dateItems = getEventDateItems(evento);
                const primaryDate = getLocalDate(dateItems[0]?.fecha || evento.fecha_hora);
                return (
                  <AgendaRow
                    key={evento.id}
                    to={`/eventos/${evento.id}/${evento.slug}`}
                    day={primaryDate ? primaryDate.getDate() : "—"}
                    month={
                      primaryDate
                        ? primaryDate.toLocaleDateString("es-ES", { month: "short" }).replace(".", "").toUpperCase()
                        : ""
                    }
                    isToday={primaryDate ? isToday(primaryDate) : false}
                    title={evento.nombre}
                    meta={
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="h-3 w-3" strokeWidth={2} />
                        {evento.lugar}
                      </span>
                    }
                  />
                );
              })}
            </div>
            <PaginationControls
              page={page}
              hasPrevious={Boolean(state.previous)}
              hasNext={Boolean(state.next)}
              onPrevious={() => updateParams({ page: page - 1 })}
              onNext={() => updateParams({ page: page + 1 })}
            />
          </>
        ) : (
          <EmptyState description={tag ? `No hay eventos próximos con la etiqueta "${tag}".` : "No hay eventos próximos por ahora."} />
        )}
      </section>
    </>
  );
}

export default EventsPage;
