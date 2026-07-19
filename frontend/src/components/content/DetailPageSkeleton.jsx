import PropTypes from "prop-types";
import Skeleton from "../ui/Skeleton";

/** Forma de DetailHero.jsx mientras la página de detalle carga — Fase 7. */
function DetailHeroSkeleton() {
  return (
    <div className="relative flex min-h-[68vh] items-end overflow-hidden border-b border-line bg-surface">
      <div className="wrap relative z-10 w-full py-16">
        <Skeleton className="mb-6 h-3 w-48" />
        <Skeleton className="mb-5 h-6 w-24" />
        <Skeleton className="mb-4 h-10 w-full max-w-3xl sm:h-14" />
        <Skeleton className="h-4 w-64" />
      </div>
    </div>
  );
}

/**
 * Forma de las páginas de detalle (noticia/evento/entrevista) — Fase 7 C.
 * Espeja DetailHero + la composición de cuerpo de cada
 * NewsDetailPage/EventsDetailPage/InterviewDetailPage.
 */
function DetailPageSkeleton({ type = "noticia" }) {
  return (
    <div role="status" aria-busy="true">
      <span className="sr-only">Cargando…</span>
      <DetailHeroSkeleton />
      {type === "entrevista" ? (
        <div className="wrap flex flex-col gap-10 py-12">
          <Skeleton className="h-16 w-full max-w-2xl" />
          <Skeleton className="h-64 w-full sm:h-96" />
        </div>
      ) : (
        <div className="wrap grid grid-cols-1 gap-8 py-12 min-[1101px]:grid-cols-[minmax(0,2fr)_380px]">
          <div className="flex flex-col gap-8">
            <Skeleton className="h-64 w-full sm:h-96" />
            {type === "evento" && (
              <div className="grid gap-6 min-[721px]:grid-cols-2">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            )}
          </div>
          <div className="flex flex-col gap-4">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      )}
    </div>
  );
}

DetailPageSkeleton.propTypes = {
  type: PropTypes.oneOf(["noticia", "evento", "entrevista"]),
};

export default DetailPageSkeleton;
