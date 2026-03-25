import { useEffect } from "react";

const DEFAULTS = {
  title: "Adictos al Techno | Noticias, eventos y cultura electrónica",
  description:
    "Noticias de techno, eventos, entrevistas y cultura electrónica en Chile y el mundo. Adictos al Techno cubre lanzamientos, artistas, festivales y escena club.",
  image: "https://adictosaltechno.com/assets/logo-adt-o1knstV1.png",
  type: "website",
};

const upsertMeta = (selector, attributes) => {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement("meta");
    Object.entries(attributes)
      .filter(([key]) => key !== "content")
      .forEach(([key, value]) => element.setAttribute(key, value));
    document.head.appendChild(element);
  }
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
};

const upsertLink = (selector, attributes) => {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement("link");
    document.head.appendChild(element);
  }
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
};

export default function Seo({
  title,
  description,
  image,
  canonical,
  type = "website",
  schema,
}) {
  useEffect(() => {
    const resolvedTitle = title || DEFAULTS.title;
    const resolvedDescription = description || DEFAULTS.description;
    const resolvedImage = image || DEFAULTS.image;
    const resolvedCanonical = canonical || window.location.href;

    document.title = resolvedTitle;

    upsertMeta('meta[name="description"]', {
      name: "description",
      content: resolvedDescription,
    });
    upsertMeta('meta[name="robots"]', {
      name: "robots",
      content: "index, follow",
    });
    upsertLink('link[rel="canonical"]', {
      rel: "canonical",
      href: resolvedCanonical,
    });

    upsertMeta('meta[property="og:type"]', {
      property: "og:type",
      content: type || DEFAULTS.type,
    });
    upsertMeta('meta[property="og:site_name"]', {
      property: "og:site_name",
      content: "Adictos al Techno",
    });
    upsertMeta('meta[property="og:locale"]', {
      property: "og:locale",
      content: "es_CL",
    });
    upsertMeta('meta[property="og:title"]', {
      property: "og:title",
      content: resolvedTitle,
    });
    upsertMeta('meta[property="og:description"]', {
      property: "og:description",
      content: resolvedDescription,
    });
    upsertMeta('meta[property="og:url"]', {
      property: "og:url",
      content: resolvedCanonical,
    });
    upsertMeta('meta[property="og:image"]', {
      property: "og:image",
      content: resolvedImage,
    });

    upsertMeta('meta[name="twitter:card"]', {
      name: "twitter:card",
      content: "summary_large_image",
    });
    upsertMeta('meta[name="twitter:title"]', {
      name: "twitter:title",
      content: resolvedTitle,
    });
    upsertMeta('meta[name="twitter:description"]', {
      name: "twitter:description",
      content: resolvedDescription,
    });
    upsertMeta('meta[name="twitter:image"]', {
      name: "twitter:image",
      content: resolvedImage,
    });

    const schemaId = "adt-jsonld";
    const existingSchema = document.getElementById(schemaId);
    if (existingSchema) existingSchema.remove();

    if (schema) {
      const script = document.createElement("script");
      script.id = schemaId;
      script.type = "application/ld+json";
      script.text = JSON.stringify(Array.isArray(schema) ? schema : [schema]);
      document.head.appendChild(script);
    }

    return () => {
      const currentSchema = document.getElementById(schemaId);
      if (currentSchema) currentSchema.remove();
    };
  }, [title, description, image, canonical, type, schema]);

  return null;
}
