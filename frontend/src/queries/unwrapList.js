// Convierte el sobre {results, error, ...} de api.js en datos o excepción.
export const unwrapList = (res) => {
  if (res?.error) throw res.error;
  return res; // { results, count, next, previous }
};
