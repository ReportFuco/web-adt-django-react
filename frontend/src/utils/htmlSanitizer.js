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

export const sanitizeHTML = (dirtyHTML) => {
  let cleanedHTML = dirtyHTML;

  cleanedHTML = cleanedHTML.replace(
  /src="(?:\.\.\/)+media\//g,
  'src="/media/'
);

  // 3. Sanitizar con DOMPurify
  const sanitized = DOMPurify.sanitize(cleanedHTML, {
    ALLOWED_TAGS: allowedTags,
    ALLOWED_ATTRIBUTES: allowedAttributes,
    ADD_ATTR: ["target", "allowfullscreen", "data-*"],
    ADD_TAGS: ["figure", "figcaption"],
    FORCE_BODY: true,
    SAFE_FOR_TEMPLATES: true,
    KEEP_CONTENT: true,
  });

  return sanitized;
};
