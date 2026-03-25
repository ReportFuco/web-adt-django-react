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
  div: ["data-mce-object"],
  figure: ["class", "contenteditable"],
  table: ["border", "cellpadding", "cellspacing"],
};

import { API_ORIGIN } from "../config/api";

export const sanitizeHTML = (dirtyHTML, baseUrl = API_ORIGIN) => {
  // Primero sanitiza el HTML
  const sanitized = DOMPurify.sanitize(dirtyHTML, {
    ALLOWED_TAGS: allowedTags,
    ALLOWED_ATTRIBUTES: allowedAttributes,
    ADD_ATTR: ["target", "allowfullscreen", "data-*"],
    ADD_TAGS: ["figure", "figcaption"],
    FORCE_BODY: true,
    SAFE_FOR_TEMPLATES: true,
    KEEP_CONTENT: true,
  });

  // Luego procesa las imágenes para corregir las URLs
  const doc = new DOMParser().parseFromString(sanitized, 'text/html');
  
  doc.querySelectorAll('img[src*="media/"]').forEach(img => {
    // Elimina todos los ../ y reemplaza con la URL base correcta
    const correctedSrc = img.src.replace(/\.\.\//g, '').replace(/\/media\//, 'media/');
    img.src = `${baseUrl}/media/${correctedSrc.split('media/')[1]}`;
  });

  return doc.body.innerHTML;
};