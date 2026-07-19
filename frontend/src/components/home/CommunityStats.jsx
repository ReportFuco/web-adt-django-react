import Kicker from "../ui/Kicker";
import Cta from "../ui/Cta";
import { COMMUNITY_STATS, COMMUNITY_STATS_UPDATED_AT } from "../../config/communityStats";
import { SOCIAL_LINKS } from "../ui/SocialIcons";

const WHATSAPP_COMMUNITY_URL = SOCIAL_LINKS.find((link) => link.key === "whatsapp")?.href;

/**
 * Panel de comunidad (DESIGN.md §9.6 — `community-panel`/`stat`). Las
 * cifras son manuales (DECISIONES.md #4): sin endpoint, se editan en
 * `src/config/communityStats.js`.
 */
function CommunityStats() {
  return (
    <div className="grid border border-line min-[861px]:grid-cols-[1.1fr_1fr]">
      <div className="flex flex-col justify-center gap-3 border-b border-line p-8 min-[861px]:border-b-0 min-[861px]:border-r min-[861px]:p-12">
        <Kicker>Comunidad</Kicker>
        <h2 className="text-[clamp(1.75rem,3vw,2.5rem)]">La escena está conectada</h2>
        <p className="max-w-[46ch] text-text-soft">
          Noticias, eventos, entrevistas y cultura electrónica desde una mirada editorial y profunda sobre la
          escena.
        </p>
        {WHATSAPP_COMMUNITY_URL && (
          <Cta variant="primary" href={WHATSAPP_COMMUNITY_URL} className="w-max">
            Únete por WhatsApp
          </Cta>
        )}
      </div>
      <div className="grid grid-cols-2">
        {COMMUNITY_STATS.map(({ id, label, value, Icon }, index) => (
          <div
            key={id}
            className={`flex flex-col gap-2 border-b border-line p-8 ${index % 2 === 0 ? "border-l-0" : "border-l"}`}
          >
            <Icon className="h-5 w-5 text-signal" />
            <span className="font-display text-2xl font-extrabold">{value}</span>
            <span className="text-xs uppercase tracking-[0.04em] text-text-muted">{label}</span>
          </div>
        ))}
        <p className="col-span-2 border-t border-line p-2 px-8 text-[0.6875rem] text-text-muted">
          Cifras actualizadas manualmente · última revisión {COMMUNITY_STATS_UPDATED_AT}
        </p>
      </div>
    </div>
  );
}

export default CommunityStats;
