import PropTypes from "prop-types";
import backgroundImage from "../../assets/fondo-web.jpg";
import LinkGlyph from "../../components/ui/LinkGlyph";

/** Layout compartido de las páginas de auth (PLAN.md Fase 5). */
function AuthLayout({ title, children, footer }) {
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-cover bg-center px-4 py-16"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-black/80" />
      <div className="relative z-10 w-full max-w-md border border-line bg-surface/95 p-8 text-text backdrop-blur-lg">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <LinkGlyph size={28} className="text-signal" />
          <h1 className="text-2xl">{title}</h1>
        </div>
        {children}
        {footer && <div className="mt-6 flex flex-col items-center gap-2 text-sm text-text-muted">{footer}</div>}
      </div>
    </div>
  );
}

AuthLayout.propTypes = {
  title: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired,
  footer: PropTypes.node,
};

export default AuthLayout;
