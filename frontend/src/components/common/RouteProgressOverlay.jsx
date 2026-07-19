import { useSyncExternalStore } from "react";
import logoHeader from "../../assets/logo-final-header-cropped.png";
import { routeProgress } from "../../utils/routeProgress";

/**
 * Overlay de progreso 0-100 para carga de rutas (Fase 7 §B), montado fuera
 * del boundary de <Suspense> en App.jsx para poder mantener el 100 visible
 * un instante antes de ocultarse. El ancho de la barra usa una transición
 * CSS, así que el guard global de prefers-reduced-motion (que pone
 * transition-duration en 0) ya la vuelve un salto directo sin JS adicional.
 */
function RouteProgressOverlay() {
  const state = useSyncExternalStore(routeProgress.subscribe, routeProgress.getSnapshot);

  if (!state.visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-[#050505] text-white"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(state.value)}
      aria-label="Cargando página"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_30%)]" />
      <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:40px_40px]" />

      <div className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <div className="relative flex items-center justify-center">
          <div className="absolute h-28 w-28 rounded-full border border-white/8 animate-ping" />
          <div className="absolute h-36 w-36 rounded-full border border-white/10 animate-[spin_16s_linear_infinite]" />
          <div className="absolute h-20 w-20 rounded-full border border-white/10 animate-[spin_11s_linear_infinite_reverse]" />

          <div className="relative rounded-full border border-white/10 bg-black/70 px-8 py-6 shadow-[0_0_60px_rgba(0,0,0,0.45)] backdrop-blur-md">
            <img
              src={logoHeader}
              alt="Adictos al Techno"
              className="h-8 md:h-10 w-auto object-contain opacity-95"
            />
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-white/70">
            Cargando página
          </p>
          <div className="h-1 w-48 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-white transition-[width] duration-200 ease-out"
              style={{ width: `${state.value}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default RouteProgressOverlay;
