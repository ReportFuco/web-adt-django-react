const formatter = new Intl.NumberFormat("es-CL");

/** Formatea una cifra de comunidad con separador de miles es-CL (Fase 7 §D.3). */
export function formatCommunityStat(value) {
  return formatter.format(value);
}
