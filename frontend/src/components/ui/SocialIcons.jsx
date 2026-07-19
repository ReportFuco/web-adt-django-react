import PropTypes from "prop-types";

/**
 * Íconos sociales monocromos (DESIGN.md §2.3/§8): trazo, `currentColor`,
 * vira a la señal en hover desde el componente que los use. Se mantienen
 * como trazo simple (no logos de marca a color) para que convivan con la
 * paleta neutra en toda la UI general.
 */
const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  "aria-hidden": true,
};

export function InstagramIcon(props) {
  return (
    <svg {...iconProps} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" />
    </svg>
  );
}

export function WhatsAppIcon(props) {
  return (
    <svg {...iconProps} strokeLinejoin="round" {...props}>
      <path d="M21 11.5a8.5 8.5 0 1 1-3.8-7.1L21 3l-1.3 3.9c.8 1.4 1.3 3 1.3 4.6Z" />
      <path d="M8 10.5s.5 3 3.5 4" />
    </svg>
  );
}

export function SpotifyIcon(props) {
  return (
    <svg {...iconProps} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 15.5c2.5-1 5.5-1 8 .3M7.5 12c3-1.2 6.5-1.2 9.5.2M7 8.7c3.5-1.3 7.5-1.3 11 .2" />
    </svg>
  );
}

export function TikTokIcon(props) {
  return (
    <svg {...iconProps} strokeLinejoin="round" {...props}>
      <path d="M14 3v10.5a3.5 3.5 0 1 1-2.5-3.35" />
      <path d="M14 6c1.2 1.6 2.7 2.4 4 2.5" />
    </svg>
  );
}

export const SOCIAL_LINKS = [
  { key: "instagram", label: "Instagram", href: "https://www.instagram.com/adictos_al_techno/", Icon: InstagramIcon },
  { key: "whatsapp", label: "Comunidad de WhatsApp", href: "https://chat.whatsapp.com/EZkSGVq4BrpLc7SCxIHjNz", Icon: WhatsAppIcon },
  { key: "spotify", label: "Spotify", href: "https://open.spotify.com/playlist/4uDeR4NrQHknGI4XMVEwRH?si=65BaoIh9RC-JPxE7NokKdQ", Icon: SpotifyIcon },
  { key: "tiktok", label: "TikTok", href: "https://www.tiktok.com/@adictos.al.techno?_t=ZM-8vv8jszOOKz&_r=1", Icon: TikTokIcon },
];

InstagramIcon.propTypes = WhatsAppIcon.propTypes = SpotifyIcon.propTypes = TikTokIcon.propTypes = {
  className: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
