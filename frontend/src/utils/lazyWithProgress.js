import { lazy } from "react";
import { routeProgress } from "./routeProgress";

/**
 * Envuelve React.lazy para avisarle a routeProgress cuándo empieza y termina
 * cada import() de ruta (Fase 7 §B). React.lazy solo invoca `importer` una
 * vez por componente y cachea la promesa, así que start()/done() se disparan
 * una sola vez por chunk real, no en cada render.
 */
export function lazyWithProgress(importer) {
  return lazy(() => {
    routeProgress.start();
    return importer().then(
      (mod) => {
        routeProgress.done();
        return mod;
      },
      (error) => {
        routeProgress.fail();
        throw error;
      }
    );
  });
}
