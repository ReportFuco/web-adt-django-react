import Skeleton from "../ui/Skeleton";

/** Forma del Hero real (Hero.jsx) mientras heroNews está loading (Fase 7). */
function HeroSkeleton() {
  return (
    <div
      role="status"
      aria-busy="true"
      className="relative flex min-h-[380px] flex-col justify-end overflow-hidden border border-line bg-surface px-5 pb-6 pt-10 sm:min-h-[clamp(440px,66vh,660px)] sm:px-8 sm:pb-10 sm:pt-24"
    >
      <span className="sr-only">Cargando historia destacada…</span>
      <Skeleton className="mb-3 h-3 w-32" />
      <Skeleton className="mb-2 h-8 w-full sm:h-12 sm:w-4/5" />
      <Skeleton className="mb-4 hidden h-6 w-2/3 sm:block" />
      <Skeleton className="mb-6 h-3 w-40" />
      <Skeleton className="h-11 w-36" />
    </div>
  );
}

export default HeroSkeleton;
