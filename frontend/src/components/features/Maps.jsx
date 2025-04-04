import React from "react";

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
        className="grid border-black border-1 rounded-sm"
      ></iframe>
    </div>
  );
}

export default Maps;
