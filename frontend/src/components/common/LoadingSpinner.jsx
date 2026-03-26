import logoHeader from "../../assets/logo-final-header-cropped.png";

export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#050505] text-white">
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
            Cargando escena
          </p>
          <p className="max-w-md text-sm md:text-base text-white/45">
            Noticias, eventos y cultura <span className="text-white/70">techno</span> tomando forma.
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-white/70 animate-bounce [animation-delay:-0.25s]" />
            <span className="h-2 w-2 rounded-full bg-white/55 animate-bounce [animation-delay:-0.1s]" />
            <span className="h-2 w-2 rounded-full bg-white/40 animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  );
}
