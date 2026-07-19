import Skeleton from "../ui/Skeleton";

/**
 * Forma de Headlines.jsx mientras el grupo `events` está loading (Fase 7).
 * Puramente decorativo: el estado de carga ya se anuncia por
 * EventCardsSkeleton más abajo (misma fuente de datos), así que no duplica
 * el aviso con otro role="status".
 */
function HeadlinesSkeleton() {
  return (
    <section aria-hidden="true" className="wrap border-y border-line py-6">
      <Skeleton className="mb-4 h-3 w-40" />
      <div className="grid gap-8 min-[761px]:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <div
            key={index}
            className={`grid grid-cols-[9px_1fr] items-start gap-4 ${
              index > 0
                ? "border-t border-line pt-4 min-[761px]:border-l min-[761px]:border-t-0 min-[761px]:pl-8 min-[761px]:pt-0"
                : ""
            }`}
          >
            <Skeleton className="mt-1.5 h-[9px] w-[9px] rounded-full" />
            <div className="min-w-0 flex-1">
              <Skeleton className="mb-2 h-4 w-full" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default HeadlinesSkeleton;
