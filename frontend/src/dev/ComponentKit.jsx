import PropTypes from "prop-types";
import { Calendar, Clock, MapPin } from "lucide-react";
import LinkGlyph from "../components/ui/LinkGlyph";
import Media from "../components/ui/Media";
import Cta from "../components/ui/Cta";
import Tag from "../components/ui/Tag";
import Kicker from "../components/ui/Kicker";
import { MetaRow, MetaItem } from "../components/ui/MetaRow";
import SectionHead from "../components/ui/SectionHead";
import AdSlot, { SponsoredSlot } from "../components/ui/AdSlot";
import AgendaRow from "../components/ui/AgendaRow";
import LoadingState from "../components/ui/LoadingState";
import EmptyState from "../components/ui/EmptyState";
import ErrorState from "../components/ui/ErrorState";

/**
 * Harness de componentes de Fase 2 (docs/rediseño/PLAN.md). Solo se monta en
 * desarrollo (ver App.jsx) — no es una página de producción. Sirve para
 * verificar cada primitivo en dark/light, responsive y con foco visible
 * antes de cablearlos a datos reales en Fase 3+.
 */
function Block({ title, children }) {
  return (
    <section className="border-b border-line py-10">
      <h2 className="mb-6 text-xl">{title}</h2>
      <div className="flex flex-wrap items-start gap-6">{children}</div>
    </section>
  );
}

Block.propTypes = {
  title: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired,
};

export default function ComponentKit() {
  return (
    <div className="wrap min-h-screen bg-bg py-10 text-text">
      <h1 className="mb-2">Kit de UI — harness</h1>
      <p className="mb-6 text-sm text-text-muted">
        Solo dev. Usa el theme-toggle flotante para verificar dark/light.
      </p>

      <Block title="LinkGlyph">
        <LinkGlyph size={40} className="text-signal" />
      </Block>

      <Block title="Media (ar-43, ar-45, ar-11, sin foto)">
        <Media ratio="43" className="w-40" alt="" />
        <Media
          ratio="45"
          className="w-32"
          src="https://picsum.photos/seed/adt/400/500"
          alt="Ejemplo de retrato"
          credit="Foto: Ejemplo"
        />
        <Media ratio="11" className="w-32" />
      </Block>

      <Block title="Cta">
        <Cta variant="primary" href="#">
          Primario
        </Cta>
        <Cta variant="ghost" href="#">
          Ghost
        </Cta>
      </Block>

      <Block title="Tag / Kicker">
        <Tag>Noticias</Tag>
        <Tag active>Eventos activo</Tag>
        <Kicker>Sección</Kicker>
      </Block>

      <Block title="MetaRow">
        <MetaRow>
          <MetaItem icon={Clock}>9 MIN DE LECTURA</MetaItem>
          <MetaItem icon={Calendar}>17 JUL 2026</MetaItem>
          <MetaItem icon={MapPin}>Santiago</MetaItem>
        </MetaRow>
      </Block>

      <Block title="SectionHead">
        <div className="w-full">
          <SectionHead kicker="Noticias" title="Últimas noticias" linkTo="/noticias" linkLabel="Ver todas" />
        </div>
      </Block>

      <Block title="AdSlot / SponsoredSlot">
        <div className="w-full max-w-md">
          <AdSlot variant="leaderboard" title="Reserva anticipada — Ejemplo" href="#" note="Espacio publicitario" />
        </div>
        <div className="w-full max-w-md">
          <SponsoredSlot title="Contenido patrocinado de ejemplo" href="#" />
        </div>
      </Block>

      <Block title="AgendaRow">
        <div className="w-full">
          <AgendaRow to="#" day="16" month="AGO" title="Sam Paganini en formato Basel" meta="Santiago · Space" />
        </div>
      </Block>

      <Block title="Loading / Empty / Error">
        <div className="w-full max-w-sm">
          <LoadingState />
        </div>
        <div className="w-full max-w-sm">
          <EmptyState description="No hay contenido para mostrar todavía." />
        </div>
        <div className="w-full max-w-sm">
          <ErrorState description="Intenta de nuevo en unos minutos." onRetry={() => {}} />
        </div>
      </Block>
    </div>
  );
}
