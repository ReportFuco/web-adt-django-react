function Maps({ direccion }) {
  if (!direccion || typeof direccion !== 'string') {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-500">
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
      className="w-full h-full border-0"
      aria-label="Mapa"
    />
  );
}

export default Maps;