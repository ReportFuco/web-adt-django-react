import fondo from "../../assets/img/fondo web.png";

export default function SpotifyPlaylist() {
  return (
    <div className="relative w-full flex justify-center items-center py-10">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${fondo})` }}
      ></div>
      <div className="relative backdrop-blur-lg p-6 w-[60%]">
        <h2 className="bg-gray-900/75 rounded-2xl text-2xl font-bold text-white text-center mb-4">
          <span className="text-white text-transparent bg-clip-text w-auto">
            Spotify Playlist
          </span>
        </h2>
        <div className="flex justify-center">
          <iframe
            className="rounded-lg shadow-md w-full md:w-[60%]"
            src="https://open.spotify.com/embed/playlist/4uDeR4NrQHknGI4XMVEwRH?utm_source=generator&theme=0&bg_color=1a1a1a&theme_color=9b59b6"
            width="100%"
            height="352"
            allow="autoplay; clipboard-write; fullscreen; encrypted-media; picture-in-picture"
            loading="eager"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
