const SITE_URL = "https://adictosaltechno.com";
const API_URL = "https://api.adictosaltechno.com/api";

const staticUrls = [
  { loc: `${SITE_URL}/`, changefreq: "daily", priority: "1.0" },
  { loc: `${SITE_URL}/noticias`, changefreq: "hourly", priority: "0.9" },
  { loc: `${SITE_URL}/eventos`, changefreq: "daily", priority: "0.9" },
  { loc: `${SITE_URL}/entrevistas`, changefreq: "daily", priority: "0.8" },
  { loc: `${SITE_URL}/cultura`, changefreq: "daily", priority: "0.6" },
  { loc: `${SITE_URL}/login`, changefreq: "monthly", priority: "0.3" },
  { loc: `${SITE_URL}/register`, changefreq: "monthly", priority: "0.3" },
];

const fetchJson = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`No se pudo obtener ${url}: ${response.status}`);
  }
  return response.json();
};

const normalizeList = (payload) => (Array.isArray(payload) ? payload : payload?.results || []);

// PLAN.md Fase 6 #4: recorre todas las páginas de la API (el listado
// paginado por defecto trae 20 ítems; sin esto el sitemap se quedaba
// truncado apenas hubiera más de una página de contenido).
const fetchAllPages = async (endpoint) => {
  const items = [];
  let url = `${API_URL}/${endpoint}/`;
  while (url) {
    const payload = await fetchJson(url);
    if (Array.isArray(payload)) {
      items.push(...payload);
      break;
    }
    items.push(...(payload.results || []));
    url = payload.next || null;
  }
  return items;
};

// PLAN.md Fase 6 #4: si la API no está disponible al momento del build, no
// se debe abortar todo `pnpm run build` — se registra el problema y se
// continúa solo con las URLs estáticas, para no bloquear un despliegue por
// una falla transitoria de red.
const fetchAllPagesSafe = async (endpoint) => {
  try {
    return await fetchAllPages(endpoint);
  } catch (error) {
    console.warn(`[sitemap] No se pudieron obtener "${endpoint}" (se omiten del sitemap): ${error.message}`);
    return [];
  }
};

const escapeXml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const urlNode = ({ loc, changefreq, priority, lastmod }) =>
  `  <url>\n    <loc>${escapeXml(loc)}</loc>${
    lastmod ? `\n    <lastmod>${escapeXml(lastmod)}</lastmod>` : ""
  }\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;

const toIsoDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
};

const build = async () => {
  const [noticiasRaw, eventosRaw, entrevistasRaw] = await Promise.all([
    fetchAllPagesSafe("noticias"),
    fetchAllPagesSafe("eventos"),
    fetchAllPagesSafe("entrevistas"),
  ]);

  const noticias = noticiasRaw.map((item) => ({
    loc: `${SITE_URL}/noticias/${item.id}/${item.slug}`,
    changefreq: "weekly",
    priority: item.destacado ? "0.9" : "0.8",
    lastmod: toIsoDate(item.fecha_publicacion),
  }));

  const eventos = eventosRaw.map((item) => ({
    loc: `${SITE_URL}/eventos/${item.id}/${item.slug}`,
    changefreq: "weekly",
    priority: item.destacado ? "0.8" : "0.7",
    lastmod: toIsoDate(item.fecha_hora),
  }));

  const entrevistas = entrevistasRaw.map((item) => ({
    loc: `${SITE_URL}/entrevistas/${item.slug}`,
    changefreq: "monthly",
    priority: item.destacado ? "0.8" : "0.7",
    lastmod: toIsoDate(item.fecha_publicacion),
  }));

  const allUrls = [...staticUrls, ...noticias, ...eventos, ...entrevistas];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${allUrls
    .map(urlNode)
    .join("\n")}\n</urlset>\n`;

  const fs = await import("node:fs/promises");
  await fs.mkdir(new URL("../public/", import.meta.url), { recursive: true });
  await fs.writeFile(new URL("../public/sitemap.xml", import.meta.url), xml, "utf8");
  console.log(`Sitemap generado con ${allUrls.length} URLs.`);
};

build().catch((error) => {
  // Solo un fallo al escribir el archivo (no de red) debe abortar el build.
  console.error("[sitemap] Fallo inesperado generando el sitemap:", error);
  process.exit(1);
});
