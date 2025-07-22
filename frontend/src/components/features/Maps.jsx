
function Maps({ direccion }) {
  return (
    <div className="flex justify-center items-center my-6 rounded-sm">
      <iframe
        loading="eager"
        allowfullscreen
        src={`https://www.google.com/maps?q=${encodeURIComponent(
          direccion
        )}&output=embed`}
        title="Mapa"
        
      ></iframe>
    </div>
  );
}

export default Maps;
