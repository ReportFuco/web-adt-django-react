const normalizeBaseUrl = (value, fallback) => {
  const raw = (value || fallback || "").trim();
  if (!raw) return "https://api.adictosaltechno.com/api/";
  return raw.endsWith("/") ? raw : `${raw}/`;
};

export const API_BASE_URL = normalizeBaseUrl(
  import.meta.env.VITE_API_URL,
  "https://api.adictosaltechno.com/api/"
);

export const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "").replace(/\/$/, "");
