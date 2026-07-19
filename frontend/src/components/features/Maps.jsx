import PropTypes from "prop-types";

function Maps({ direccion }) {
  if (!direccion || typeof direccion !== "string") {
    return (
      <div className="w-full h-full flex items-center justify-center text-white/40 uppercase tracking-[0.18em] text-xs bg-[#0a0a0a]">
        No hay dirección disponible
      </div>
    );
  }

  return (
    <iframe
      loading="eager"
      allowFullScreen
      src={`https://www.google.com/maps?q=${encodeURIComponent(direccion)}&output=embed`}
      title="Mapa de la ubicación"
      className="w-full h-full border-0 grayscale contrast-125"
      aria-label="Mapa"
    />
  );
}

Maps.propTypes = {
  direccion: PropTypes.string,
};

export default Maps;
