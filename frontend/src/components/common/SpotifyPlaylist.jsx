import fondo from "../../assets/fondo-web.jpg";

export default function SpotifyPlaylist() {
  return (
    <div className="relative w-full flex justify-center items-center py-10">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${fondo})` }}
      ></div>
      <div className="relative bg-gray-900/75 rounded-2xl backdrop-blur-lg shadow-lg p-6 max-w-4xl w-full">
        <h2 className="text-2xl font-bold text-white text-center mb-4">
          <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
            Spotify Playlist
          </span>
        </h2>
        <div className="w-20 mx-auto border-b-4 border-purple-500 mb-4"></div>
        <div className="flex justify-center">
          <iframe
            className="rounded-lg shadow-md w-full md:w-[60%]" 
            src="https://open.spotify.com/embed/playlist/4uDeR4NrQHknGI4XMVEwRH?utm_source=generator&theme=0&bg_color=1a1a1a&theme_color=9b59b6"
            height="352"
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
            loading="eager"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
