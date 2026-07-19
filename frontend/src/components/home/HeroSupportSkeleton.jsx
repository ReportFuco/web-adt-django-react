import Skeleton from "../ui/Skeleton";

/**
 * Forma de HeroSupport.jsx mientras heroNews está loading (Fase 7): 2 filas
 * visibles en mobile, 4 desde sm — igual que la disposición real.
 */
function HeroSupportSkeleton() {
  return (
    <aside
      role="status"
      aria-busy="true"
      aria-label="Cargando enlaces de apoyo a la historia principal"
      className="flex flex-col border border-line bg-surface px-4 pb-1 pt-4 sm:px-6 sm:pb-2 sm:pt-6"
    >
      <span className="sr-only">Cargando…</span>
      <Skeleton className="mb-4 h-3 w-28" />
      {Array.from({ length: 4 }, (_, index) => (
        <div
          key={index}
          className={`flex items-start gap-4 border-b border-line py-3 last:border-b-0 sm:flex sm:py-4 ${
            index < 2 ? "flex" : "hidden"
          }`}
        >
          <Skeleton className="h-6 w-6 shrink-0" />
          <Skeleton className="aspect-square w-12 shrink-0 sm:w-16" />
          <div className="min-w-0 flex-1">
            <Skeleton className="mb-2 h-4 w-full" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      ))}
    </aside>
  );
}

export default HeroSupportSkeleton;
