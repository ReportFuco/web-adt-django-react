import fondo from "../../assets/img/fondo web.png";

export default function SpotifyPlaylist() {
  return (
    <div className="relative w-full flex justify-center items-center">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${fondo})` }}
      ></div>
      <div className="relative">
        <iframe
          className="rounded-lg shadow-md w-full"
          src="https://open.spotify.com/embed/playlist/4uDeR4NrQHknGI4XMVEwRH?utm_source=generator&theme=0&bg_color=1a1a1a&theme_color=9b59b6"
          width="150%"
          height="600"
          allow="autoplay; clipboard-write; fullscreen; encrypted-media; picture-in-picture"
          loading="eager"
        ></iframe>
      </div>
    </div>
  );
}
