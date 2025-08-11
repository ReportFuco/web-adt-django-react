import instagramIcon from "../../assets/icons/instagram-brands-solid.svg";
import facebookIcon from "../../assets/icons/square-facebook-brands-solid.svg";
import WhatsApp from "../../assets/icons/whatsapp-icon.svg"
import tiktokIcon from "../../assets/icons/tiktok-brands-solid.svg"
import spotifyIcon from "../../assets/icons/spotify-brands-solid.svg"
import React from 'react'

export default function RedesSociales({classNameDiseño}) {
    
    const referencias = (linkPage, altImage, icon) => {
        return (
          <a href={linkPage} className="hover:text-purple-300 transition flex items-center space-x-2" target="_blank" rel="noopener noreferrer">
            <img src={icon} alt={altImage} width="20px" />
          </a>
        );
      };

  return (
    <div className={`flex items-center space-x-3 ${classNameDiseño}`}>
        {referencias("https://www.instagram.com/adictos_al_techno/", "Instagram", instagramIcon)}
        {referencias("https://facebook.com", "Facebook", facebookIcon)}
        {referencias("https://chat.whatsapp.com/EZkSGVq4BrpLc7SCxIHjNz", "WhatsApp", WhatsApp)}
        {referencias("https://www.tiktok.com/@adictos.al.techno?_t=ZM-8vv8jszOOKz&_r=1", "tiktok", tiktokIcon)}
        {referencias("https://open.spotify.com/playlist/4uDeR4NrQHknGI4XMVEwRH?si=65BaoIh9RC-JPxE7NokKdQ", "spotify", spotifyIcon)}
    </div>
  )
}
