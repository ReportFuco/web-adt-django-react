import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

/**
 * Marco global del sitio (DESIGN.md §9.4/§9.8, PLAN.md Fase 3): skip-link +
 * Header (con Ticker) + `main#main` + Footer, montado una sola vez por
 * `App.jsx` en vez de que cada página arme su propio Header/Footer.
 */
function AppShell() {
  return (
    <>
      <a href="#main" className="skip-link">
        Saltar al contenido
      </a>
      <Header />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default AppShell;
