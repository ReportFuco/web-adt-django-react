import PropTypes from "prop-types";
import { Instagram } from "lucide-react";
import { FaSpotify, FaTiktok, FaWhatsapp } from "react-icons/fa";

/**
 * Íconos sociales monocromos (DESIGN.md §2.3/§8): `currentColor`, vira a la
 * señal en hover desde el componente que los use. Instagram usa el ícono de
 * trazo de `lucide-react` (librería preferida por DESIGN.md §8). WhatsApp,
 * Spotify y TikTok no existen en lucide (se removieron del set por
 * trademark) así que usan sus glifos de marca reales de `react-icons/fa` en
 * un solo color — sin colores de marca, siguen siendo "monocromos" en el
 * sentido de DESIGN.md §7, solo que de trazo relleno en vez de stroke.
 */
export const InstagramIcon = Instagram;

function brandIcon(ReactIconComponent) {
  function BrandIcon({ width, height, size, ...rest }) {
    return <ReactIconComponent size={size ?? width ?? height ?? 24} aria-hidden {...rest} />;
  }
  BrandIcon.propTypes = {
    className: PropTypes.string,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  };
  return BrandIcon;
}

export const WhatsAppIcon = brandIcon(FaWhatsapp);
export const SpotifyIcon = brandIcon(FaSpotify);
export const TikTokIcon = brandIcon(FaTiktok);

/** Mapea el campo `red` del backend (modelo `RedSocial`) a su componente de ícono. */
export const ICONS_BY_RED = {
  instagram: InstagramIcon,
  whatsapp: WhatsAppIcon,
  spotify: SpotifyIcon,
  tiktok: TikTokIcon,
};
