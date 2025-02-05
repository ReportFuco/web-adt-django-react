import fondo from "../assets/fondo.webp";

export default function SpotifyPlaylist() {
  return (
    <div className="relative w-full flex justify-center items-center py-10">
      {/* Imagen de fondo */}
      <div className="absolute inset-0 bg-cover bg-center opacity-70" 
           style={{ backgroundImage: `url(${fondo})` }}>
      </div>

      {/* Contenedor Principal */}
      <div className="relative bg-gray-900/80 backdrop-blur-lg shadow-lg rounded-xl p-6 max-w-4xl w-full">
        
        {/* Título con Decoración */}
        <h2 className="text-2xl font-bold text-white text-center mb-4">
          <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
            Spotify Playlist
          </span>
        </h2>

        {/* Línea Decorativa */}
        <div className="w-20 mx-auto border-b-4 border-purple-500 mb-4"></div>

        {/* Iframe de Spotify */}
        <div className="flex justify-center">
          <iframe
            className="rounded-lg w-[80%] shadow-md"
            src="https://open.spotify.com/embed/playlist/4uDeR4NrQHknGI4XMVEwRH?utm_source=generator"
            height="352"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
