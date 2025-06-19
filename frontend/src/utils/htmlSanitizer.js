import DOMPurify from "dompurify";

export const allowedTags = [
  "p",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "strong",
  "em",
  "u",
  "s",
  "ul",
  "ol",
  "li",
  "a",
  "table",
  "thead",
  "tbody",
  "tr",
  "td",
  "th",
  "iframe",
  "img",
  "figure",
  "figcaption",
  "div",
  "span",
  "br",
  "hr",
  "blockquote",
  "pre",
  "code",
];

export const allowedAttributes = {
  "*": ["class", "style", "title", "aria-hidden", "data-*"],
  a: ["href", "target", "rel", "name"],
  img: ["src", "alt", "width", "height", "data-mce-src", "data-mce-selected"],
  iframe: [
    "src",
    "frameborder",
    "allowfullscreen",
    "allow",
    "width",
    "height",
    "data-mce-src",
  ],
  div: ["data-mce-object"],
  figure: ["class", "contenteditable"],
  table: ["border", "cellpadding", "cellspacing"],
};

export const sanitizeHTML = (dirtyHTML) => {
  return DOMPurify.sanitize(dirtyHTML, {
    ALLOWED_TAGS: allowedTags,
    ALLOWED_ATTR: allowedAttributes,
    ADD_ATTR: ["target", "allowfullscreen", "data-*"],
    ADD_TAGS: ["figure", "figcaption"],
    FORCE_BODY: true,
    WHOLE_DOCUMENT: false,
    SAFE_FOR_TEMPLATES: true,
  });
};
