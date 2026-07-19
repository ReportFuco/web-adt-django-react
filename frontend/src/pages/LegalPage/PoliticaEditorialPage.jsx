import LegalPage from "./LegalPage";

/** Contenido placeholder (DECISIONES.md #13) — a editar por el equipo editorial. */
function PoliticaEditorialPage() {
  return (
    <LegalPage kicker="Sitio" title="Política editorial" canonical="https://adictosaltechno.com/politica-editorial">
      <p>
        Adictos al Techno cubre noticias, eventos, entrevistas y cultura electrónica desde una mirada editorial
        independiente, con foco en la escena techno de Chile y el mundo.
      </p>
      <h2>Criterios de cobertura</h2>
      <p>
        Priorizamos contenido verificable, con fuentes identificables cuando es posible, y separamos claramente el
        contenido editorial de la publicidad (rotulada siempre como &quot;Publicidad&quot;).
      </p>
      <h2>Correcciones</h2>
      <p>
        Si encuentras un error en una publicación, escríbenos a{" "}
        <a href="mailto:adictos.al.techno@gmail.com" className="text-text hover:text-signal">
          adictos.al.techno@gmail.com
        </a>{" "}
        y lo revisamos a la brevedad.
      </p>
    </LegalPage>
  );
}

export default PoliticaEditorialPage;
