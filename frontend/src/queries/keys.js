export const qk = {
  noticias: {
    list: (params = {}) => ["noticias", "list", params],
    detail: (slug) => ["noticias", "detail", slug],
  },
  eventos: {
    list: (params = {}) => ["eventos", "list", params],
    detail: (slug) => ["eventos", "detail", slug],
  },
  entrevistas: {
    list: (params = {}) => ["entrevistas", "list", params],
    detail: (slug) => ["entrevistas", "detail", slug],
  },
  tags: () => ["tags"],
  galeria: (params = {}) => ["galeria", params],
  busqueda: (q, params = {}) => ["busqueda", q, params],
  anuncios: (ubicacion) => ["anuncios", ubicacion],
  redes: () => ["redes-sociales"],
  comments: (noticiaId) => ["comments", noticiaId],
  home: {
    heroNews: () => ["home", "heroNews"],
    ads: () => ["home", "ads"],
  },
};
