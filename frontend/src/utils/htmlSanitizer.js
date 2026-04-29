import DOMPurify from "dompurify";

export const allowedTags = [
  "p", "h1", "h2", "h3", "h4", "h5", "h6", "strong", "em", "u", "s",
  "ul", "ol", "li", "a", "table", "thead", "tbody", "tr", "td", "th",
  "iframe", "img", "figure", "figcaption", "div", "span", "br", "hr",
  "blockquote", "pre", "code"
];

export const allowedAttributes = {
  "*": ["class", "style", "title", "aria-hidden", "data-*"],
  a: ["href", "target", "rel", "name"],
  img: ["src", "alt", "width", "height", "data-mce-src", "data-mce-selected"],
  iframe: ["src", "frameborder", "allowfullscreen", "allow", "width", "height", "data-mce-src"],
  blockquote: ["class", "style", "cite", "data-instgrm-permalink", "data-instgrm-version", "data-instgrm-captioned"],
  div: ["data-mce-object"],
  figure: ["class", "contenteditable"],
  table: ["border", "cellpadding", "cellspacing"],
};

const flatAllowedAttributes = [...new Set(Object.values(allowedAttributes).flat())];

import { API_ORIGIN } from "../config/api";

const INSTAGRAM_URL_PATTERN = /https?:\/\/(?:www\.)?instagram\.com\/(?:p|reel|tv)\/[A-Za-z0-9_-]+\/?(?:\?[^<\s]*)?/gi;
const INSTAGRAM_SHORTCODE_PATTERN = /\[instagram\]\s*(https?:\/\/(?:www\.)?instagram\.com\/(?:p|reel|tv)\/[A-Za-z0-9_-]+\/?(?:\?[^<\s]*)?)\s*\[\/instagram\]/gi;

const normalizeInstagramUrl = (url) => {
  try {
    const parsed = new URL(url.replace(/&amp;/g, "&"));
    return `${parsed.origin}${parsed.pathname}`;
  } catch {
    return url.replace(/&amp;/g, "&").split("?")[0];
  }
};

const buildInstagramEmbed = (url) => {
  const permalink = normalizeInstagramUrl(url);
  return (
    `<blockquote class="instagram-media" data-instgrm-captioned ` +
    `data-instgrm-permalink="${permalink}" data-instgrm-version="14">` +
    `<a href="${permalink}" target="_blank" rel="noopener noreferrer">Ver esta publicación en Instagram</a>` +
    `</blockquote>`
  );
};

const replaceInstagramShortcodes = (html) => (
  html.replace(INSTAGRAM_SHORTCODE_PATTERN, (_match, url) => buildInstagramEmbed(url))
);

const replaceInstagramLinks = (doc) => {
  doc.querySelectorAll("p").forEach((paragraph) => {
    const text = paragraph.textContent.trim();
    if (!text.match(INSTAGRAM_URL_PATTERN)) return;

    const urls = text.match(INSTAGRAM_URL_PATTERN) || [];
    const onlyUrls = text.replace(INSTAGRAM_URL_PATTERN, "").trim() === "";
    if (!onlyUrls || urls.length !== 1) return;

    const wrapper = doc.createElement("div");
    wrapper.innerHTML = buildInstagramEmbed(urls[0]);
    paragraph.replaceWith(wrapper.firstElementChild);
  });
};

export const sanitizeHTML = (dirtyHTML, baseUrl = API_ORIGIN) => {
  const htmlWithInstagramEmbeds = replaceInstagramShortcodes(dirtyHTML || "");

  // Primero sanitiza el HTML
  const sanitized = DOMPurify.sanitize(htmlWithInstagramEmbeds, {
    ALLOWED_TAGS: allowedTags,
    ALLOWED_ATTR: flatAllowedAttributes,
    ADD_ATTR: ["target", "allowfullscreen", "data-*"],
    ADD_TAGS: ["figure", "figcaption"],
    FORCE_BODY: true,
    SAFE_FOR_TEMPLATES: true,
    KEEP_CONTENT: true,
  });

  // Luego procesa las imágenes para corregir las URLs
  const doc = new DOMParser().parseFromString(sanitized, 'text/html');

  replaceInstagramLinks(doc);
  
  doc.querySelectorAll('img[src*="media/"]').forEach(img => {
    // Elimina todos los ../ y reemplaza con la URL base correcta
    const correctedSrc = img.src.replace(/\.\.\//g, '').replace(/\/media\//, 'media/');
    img.src = `${baseUrl}/media/${correctedSrc.split('media/')[1]}`;
  });

  return doc.body.innerHTML;
};
