import axios from "axios";

import { API_BASE_URL } from "../config/api";
import {
  getNoticias,
  getNoticia,
  getEvents,
  getEventBySlug,
  getInterview,
  getComments,
  getTags,
  getGaleria,
  getBusqueda,
  getAnunciosByUbicacion,
  getRedesSociales,
} from "../services/api";
import { unwrapList } from "./unwrapList";

export const fetchNoticias = async (params) => unwrapList(await getNoticias(params));
export const fetchEventos = async (params) => unwrapList(await getEvents(params));
export const fetchEntrevistas = async (params) => unwrapList(await getInterview(params));
export const fetchTags = async (params) => unwrapList(await getTags(params));
export const fetchGaleria = async (params) => unwrapList(await getGaleria(params));
export const fetchAnuncios = async (ubicacion) =>
  unwrapList(await getAnunciosByUbicacion(ubicacion));
export const fetchRedes = async () => unwrapList(await getRedesSociales());

export const fetchBusqueda = async (q, params) => unwrapList(await getBusqueda(q, params));

// getNoticia ya lanza (axios.get crudo con withCredentials).
export const fetchNoticia = async (slug) => getNoticia(slug);

// getEventBySlug devuelve la respuesta axios completa (o undefined si falló y
// tragó el error): normalizamos aquí para lanzar y devolver solo los datos.
export const fetchEvento = async (slug) => {
  const response = await getEventBySlug(slug);
  if (!response) {
    throw new Error(`No se pudo obtener el evento "${slug}"`);
  }
  return response.data;
};

// getInterviewBySlug traga el error y devuelve undefined: la envolvemos con
// axios directo (mismo patrón que getNoticia) para que lance en vez de tragar.
export const fetchEntrevista = async (slug) => {
  const response = await axios.get(`${API_BASE_URL}entrevistas/${slug}`, {
    withCredentials: true,
  });
  return response.data;
};

// getComments ya traga errores y devuelve [] (comportamiento previo intacto).
export const fetchComments = async (noticiaId) => getComments(noticiaId);
