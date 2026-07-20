import { cn } from "@/lib/utils";
import Kicker from "../ui/Kicker";
import Cta from "../ui/Cta";
import CommunityStatValue from "./CommunityStatValue";
import { ICONS_BY_RED } from "../ui/SocialIcons";
import useRedesSociales from "../../hooks/useRedesSociales";
import useInViewOnce from "../../hooks/useInViewOnce";
import { formatShortDate } from "../../utils/formatDate";

/**
 * Panel de comunidad (DESIGN.md §9.6 — `community-panel`/`stat`). Links y
 * cifras vienen del backend (modelo `RedSocial`, editable desde el admin —
 * ver DECISIONES.md #5, revisada). Solo se muestran las redes con `contador`
 * cargado; la fecha del footnote es la más reciente entre esas ediciones.
 */
function CommunityStats() {
  const [ref, inView] = useInViewOnce();
  const { redes } = useRedesSociales();

  const whatsappUrl = redes.find((r) => r.red === "whatsapp")?.url;
  const stats = redes.filter((r) => r.contador != null);
  const updatedAt = stats
    .map((r) => r.actualizado_en)
    .filter(Boolean)
    .sort()
    .at(-1);

  return (
    <div ref={ref} className="grid border border-line min-[861px]:grid-cols-[1.1fr_1fr]">
      <div
        className={cn(
          "flex flex-col justify-center gap-3 border-b border-line p-8 adt-reveal min-[861px]:border-b-0 min-[861px]:border-r min-[861px]:p-12",
          inView && "is-visible"
        )}
      >
        <Kicker>Comunidad</Kicker>
        <h2 className="text-[clamp(1.75rem,3vw,2.5rem)]">La escena está conectada</h2>
        <p className="max-w-[46ch] text-text-soft">
          Noticias, eventos, entrevistas y cultura electrónica desde una mirada editorial y profunda sobre la
          escena.
        </p>
        {whatsappUrl && (
          <Cta variant="primary" href={whatsappUrl} className="w-max">
            Únete por WhatsApp
          </Cta>
        )}
      </div>
      <div className="grid grid-cols-2">
        {stats.map(({ id, red, label, contador }, index) => {
          const Icon = ICONS_BY_RED[red];
          return (
            <div
              key={id}
              style={{ transitionDelay: inView ? `${80 + index * 70}ms` : undefined }}
              className={cn(
                "flex flex-col gap-2 border-b border-line p-8 adt-reveal",
                index % 2 === 0 ? "border-l-0" : "border-l",
                inView && "is-visible"
              )}
            >
              <Icon className="h-5 w-5 text-signal" />
              <CommunityStatValue value={contador} className="font-display text-2xl font-extrabold" />
              <span className="text-xs uppercase tracking-[0.04em] text-text-muted">{label}</span>
            </div>
          );
        })}
        {updatedAt && (
          <p className="col-span-2 border-t border-line p-2 px-8 text-[0.6875rem] text-text-muted">
            Cifras actualizadas manualmente · última revisión {formatShortDate(updatedAt).toLowerCase()}
          </p>
        )}
      </div>
    </div>
  );
}

export default CommunityStats;
