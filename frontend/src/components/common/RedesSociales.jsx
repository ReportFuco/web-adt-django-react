import instagramIcon from "../../assets/icons/instagram-brands-solid.svg";
import WhatsApp from "../../assets/icons/whatsapp-icon.svg";
import tiktokIcon from "../../assets/icons/tiktok-brands-solid.svg";
import spotifyIcon from "../../assets/icons/spotify-brands-solid.svg";

export default function RedesSociales({ classNameDiseño, dark = false }) {
  const base = dark
    ? "border-white/15 bg-transparent hover:bg-white text-white"
    : "border-black/8 bg-neutral-50 hover:bg-neutral-100 text-black";

  const referencias = (linkPage, altImage, icon) => {
    return (
      <a
        href={linkPage}
        className={`flex h-10 w-10 items-center justify-center border transition ${base}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={altImage}
      >
        <img src={icon} alt={altImage} width="17" className={dark ? "brightness-0 invert opacity-85" : "opacity-85"} />
      </a>
    );
  };

  return (
    <div className={`flex items-center space-x-2 ${classNameDiseño || ""}`}>
      {referencias("https://www.instagram.com/adictos_al_techno/", "Instagram", instagramIcon)}
      {referencias("https://chat.whatsapp.com/EZkSGVq4BrpLc7SCxIHjNz", "WhatsApp", WhatsApp)}
      {referencias("https://www.tiktok.com/@adictos.al.techno?_t=ZM-8vv8jszOOKz&_r=1", "TikTok", tiktokIcon)}
      {referencias("https://open.spotify.com/playlist/4uDeR4NrQHknGI4XMVEwRH?si=65BaoIh9RC-JPxE7NokKdQ", "Spotify", spotifyIcon)}
    </div>
  );
}
