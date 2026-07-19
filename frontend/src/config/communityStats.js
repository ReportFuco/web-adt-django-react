import { InstagramIcon, SpotifyIcon, TikTokIcon, WhatsAppIcon } from "../components/ui/SocialIcons";

/**
 * DECISIONES.md #4: no hay endpoint de métricas de comunidad → constante
 * editable a mano en el frontend. Actualizar `updatedAt` junto con los
 * valores para que la footnote del panel de Comunidad no quede desfasada.
 */
export const COMMUNITY_STATS = [
  { id: "instagram", label: "Instagram", value: "35.613", Icon: InstagramIcon },
  { id: "whatsapp", label: "Comunidad WhatsApp", value: "157", Icon: WhatsAppIcon },
  { id: "spotify", label: "Oyentes en Spotify", value: "229", Icon: SpotifyIcon },
  { id: "tiktok", label: "TikTok", value: "280", Icon: TikTokIcon },
];

export const COMMUNITY_STATS_UPDATED_AT = "18 jul 2026";
