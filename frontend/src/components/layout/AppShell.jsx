import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

/**
 * Marco global del sitio (DESIGN.md §9.4/§9.8, PLAN.md Fase 3): skip-link +
 * Header (con Ticker) + `main#main` + Footer, montado una sola vez por
 * `App.jsx` en vez de que cada página arme su propio Header/Footer.
 *
 * El `overflow-x-hidden` (red de seguridad contra contenido más ancho que
 * el viewport — tablas, URLs largas en `.rich-content`, etc.) vive en este
 * wrapper y NO en html/body: cualquier ancestro de <Header> con overflow-x
 * (u overflow-y) distinto de `visible` rompe su `position: sticky` en iOS
 * Safari. Envolviendo solo <main>/<Footer> —hermanos de <Header>, no
 * ancestros— el header queda fuera de esa cadena y su scrollport sigue
 * siendo el viewport real.
 */
function AppShell() {
  return (
    <>
      <a href="#main" className="skip-link">
        Saltar al contenido
      </a>
      <Header />
      <div className="overflow-x-hidden">
        <main id="main">
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
}

export default AppShell;
