/**
 * Deriva texto plano de HTML rico para bajadas/meta descriptions. Mismo
 * patrón ya usado en InterviewDetailPage/NewsDetailPage para meta tags;
 * aquí se reutiliza para el hero del home (docs/rediseño/AUDITORIA.md
 * bloqueo #5 — "Hero: no hay contrato explícito de bajada/tiempo de
 * lectura"). No sustituye un campo de bajada editorial dedicado: es una
 * aproximación explícita, no una verdad de contenido.
 */
export function stripHtml(html = "") {
  if (!html) return "";
  // DOMParser decodifica entidades (&eacute;, &uacute;…) además de quitar
  // tags; un regex de solo-tags dejaba el texto con entidades crudas
  // (contenido real autoría con &aacute;/&eacute;/etc. sin normalizar).
  const doc = new DOMParser().parseFromString(html, "text/html");
  return (doc.body.textContent || "").replace(/\s+/g, " ").trim();
}

export function excerpt(html, length = 160) {
  const text = stripHtml(html);
  return text.length > length ? `${text.slice(0, length).trimEnd()}…` : text;
}

export function readingTimeMinutes(html, wordsPerMinute = 200) {
  const text = stripHtml(html);
  const words = text ? text.split(" ").filter(Boolean).length : 0;
  return Math.max(1, Math.round(words / wordsPerMinute));
}
