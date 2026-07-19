import LegalPage from "./LegalPage";

/** Contenido placeholder (DECISIONES.md #13) — a editar por el equipo editorial. */
function CreditosFotograficosPage() {
  return (
    <LegalPage
      kicker="Sitio"
      title="Créditos fotográficos"
      canonical="https://adictosaltechno.com/creditos-fotograficos"
    >
      <p>
        Cuando la fuente de una fotografía es conocida, se indica junto a la imagen (ej. &quot;Foto: Nombre&quot;).
        Si administras los derechos de una imagen publicada en el sitio y falta el crédito correspondiente,
        contáctanos para corregirlo.
      </p>
      <h2>Solicitudes</h2>
      <p>
        Escríbenos a{" "}
        <a href="mailto:adictos.al.techno@gmail.com" className="text-text hover:text-signal">
          adictos.al.techno@gmail.com
        </a>{" "}
        indicando la URL de la publicación y el crédito correcto.
      </p>
    </LegalPage>
  );
}

export default CreditosFotograficosPage;
