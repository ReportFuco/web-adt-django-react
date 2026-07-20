import LegalPage from "./LegalPage";

/** Contenido placeholder (DECISIONES.md #13) — a editar por el equipo editorial. */
function PoliticaDePrivacidadPage() {
  return (
    <LegalPage
      kicker="Sitio"
      title="Política de privacidad"
      canonical="https://adictosaltechno.com/politica-de-privacidad"
    >
      <p>
        Adictos al Techno respeta la privacidad de quienes visitan el sitio. Esta página explica qué datos se
        recogen y cómo se usan.
      </p>
      <h2>Datos de cuenta</h2>
      <p>
        Si te registras para comentar, guardamos tu correo y nombre de usuario. Nunca compartimos estos datos con
        terceros con fines comerciales.
      </p>
      <h2>Cookies y publicidad</h2>
      <p>
        Este sitio usa Google AdSense para mostrar publicidad. Google y sus socios publicitarios pueden usar
        cookies u otras tecnologías similares para mostrar anuncios en función de tus visitas anteriores a este u
        otros sitios web. Puedes inhabilitar el uso de cookies de personalización de anuncios visitando los{" "}
        <a
          href="https://adssettings.google.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-text hover:text-signal"
        >
          ajustes de anuncios de Google
        </a>
        , y consultar cómo Google usa los datos en{" "}
        <a
          href="https://policies.google.com/technologies/partner-sites"
          target="_blank"
          rel="noopener noreferrer"
          className="text-text hover:text-signal"
        >
          esta página
        </a>
        .
      </p>
      <h2>Analítica</h2>
      <p>
        Usamos Google Analytics para entender cómo se usa el sitio (páginas visitadas, tiempo de permanencia,
        origen del tráfico). Este servicio también usa cookies y puede recibir datos como tu dirección IP. Puedes
        inhabilitar el seguimiento de Google Analytics instalando el{" "}
        <a
          href="https://tools.google.com/dlpage/gaoptout"
          target="_blank"
          rel="noopener noreferrer"
          className="text-text hover:text-signal"
        >
          complemento de inhabilitación para navegadores
        </a>
        .
      </p>
      <h2>Contacto</h2>
      <p>
        Para consultas sobre tus datos, escríbenos a{" "}
        <a href="mailto:adictos.al.techno@gmail.com" className="text-text hover:text-signal">
          adictos.al.techno@gmail.com
        </a>
        .
      </p>
    </LegalPage>
  );
}

export default PoliticaDePrivacidadPage;
