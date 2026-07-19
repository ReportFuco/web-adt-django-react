import PropTypes from "prop-types";
import Seo from "../../components/common/Seo";
import Kicker from "../../components/ui/Kicker";

/**
 * Plantilla para páginas legales estáticas (DECISIONES.md #13: contenido
 * placeholder genérico a editar por el dueño, sin backend).
 */
function LegalPage({ kicker, title, canonical, children }) {
  return (
    <>
      <Seo title={`${title} | Adictos al Techno`} canonical={canonical} />
      <section className="wrap max-w-3xl py-16">
        <Kicker>{kicker}</Kicker>
        <h1 className="mb-8 text-[clamp(1.75rem,3vw,2.75rem)]">{title}</h1>
        <div className="flex flex-col gap-4 text-text-soft [&_h2]:mt-6 [&_h2]:text-xl [&_h2]:text-text">
          {children}
        </div>
      </section>
    </>
  );
}

LegalPage.propTypes = {
  kicker: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  canonical: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default LegalPage;
