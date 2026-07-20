import axios from "axios";
import { jwtDecode } from "jwt-decode";

import { API_BASE_URL } from "../config/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Fase 0 (docs/rediseño/AUDITORIA.md #4): normaliza la forma paginada del
// backend sin descartar count/next/previous, para que loading/empty/error
// sean distinguibles y los listados puedan paginar.
const normalizeListResponse = (response) => {
  const payload = response?.data;
  if (Array.isArray(payload)) {
    return { results: payload, count: payload.length, next: null, previous: null };
  }
  if (payload && Array.isArray(payload.results)) {
    return {
      results: payload.results,
      count: payload.count ?? payload.results.length,
      next: payload.next ?? null,
      previous: payload.previous ?? null,
    };
  }
  return { results: [], count: 0, next: null, previous: null };
};

// Resultado de error explícito: `error` truthy distingue "fallo" de "vacío"
// (un vacío real trae error: null y results: []).
const emptyListResult = (error) => ({
  results: [],
  count: 0,
  next: null,
  previous: null,
  error,
});

const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const { exp } = jwtDecode(token);
    if (!exp) return true;
    return exp * 1000 <= Date.now() + 5000;
  } catch {
    return true;
  }
};

export const clearAuthStorage = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken || isTokenExpired(refreshToken)) {
    clearAuthStorage();
    return null;
  }

  try {
    const response = await axios.post(`${API_BASE_URL}token/refresh/`, {
      refresh: refreshToken,
    });
    const accessToken = response.data?.access;
    if (!accessToken) {
      clearAuthStorage();
      return null;
    }
    localStorage.setItem("accessToken", accessToken);
    // Fase 0 / DECISIONES.md: ROTATE_REFRESH_TOKENS=True en el backend
    // invalida (blacklist) el refresh usado y devuelve uno nuevo. Si no lo
    // persistimos aquí, la siguiente renovación falla porque el refresh
    // guardado ya fue invalidado.
    const rotatedRefreshToken = response.data?.refresh;
    if (rotatedRefreshToken) {
      localStorage.setItem("refreshToken", rotatedRefreshToken);
    }
    return accessToken;
  } catch {
    clearAuthStorage();
    return null;
  }
};

export const ensureValidAccessToken = async () => {
  const token = localStorage.getItem("accessToken");
  if (token && !isTokenExpired(token)) {
    return token;
  }
  return refreshAccessToken();
};

const getAuthHeaders = () => {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

api.interceptors.request.use(async (config) => {
  const token = await ensureValidAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.warn("Token expirado o inválido. Cerrando sesión...");
      clearAuthStorage();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const register = async (userData) => {
  try {
    const response = await api.post("register/", userData);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response.data };
  }
};

export const franjaMensaje = async () => {
  try {
    const response = await api.get("franjasuperior/latest/");
    return response.data;
  } catch (e) {
    console.error("Error al tener la franja", e);
  }
};

export const trackFranjaClick = async (franjaId) => {
  try {
    if (!franjaId) return null;
    const response = await api.post(`franjasuperior/${franjaId}/track-click/`);
    return response.data;
  } catch (e) {
    console.error("Error al registrar click de la franja", e);
    return null;
  }
};


export const getAnunciosByUbicacion = async (ubicacion) => {
  try {
    const response = await api.get(`anuncios/?ubicacion=${ubicacion}`);
    return { ...normalizeListResponse(response), error: null };
  } catch (e) {
    console.error("Error al obtener anuncios", e);
    return emptyListResult(e);
  }
};

export const trackAnuncioClick = async (anuncioId) => {
  try {
    if (!anuncioId) return null;
    const response = await api.post(`anuncios/${anuncioId}/track-click/`);
    return response.data;
  } catch (e) {
    console.error("Error al registrar click del anuncio", e);
    return null;
  }
};

export const getLogin = async (identifier, password) => {
  try {
    const response = await api.post("token/", {
      username: identifier,
      password: password,
    });

    const { access, refresh } = response.data;

    return {
      success: true,
      access,
      refresh,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.detail || "Error en el login",
    };
  }
};

export const postContact = async (payload) => {
  return api.post("contacto/", payload);
};

export const getNoticia = async (slug) => {
  try {
    const response = await axios.get(`${API_BASE_URL}noticias/${slug}/`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener la noticia:", error);
    throw error;
  }
};

export const getNoticias = async (params = {}) => {
  try {
    const response = await api.get("noticias/", { params });
    return { ...normalizeListResponse(response), error: null };
  } catch (error) {
    console.error("Error al obtener las noticias", error);
    return emptyListResult(error);
  }
};

export const getInterview = async (params = {}) => {
  try {
    const response = await api.get("entrevistas/", { params });
    return { ...normalizeListResponse(response), error: null };
  } catch (error) {
    console.error("Error al obtener las entrevistas", error);
    return emptyListResult(error);
  }
};

export const getInterviewBySlug = async (slug) => {
  try {
    const response = await api.get(`entrevistas/${slug}`);
    return response.data;
  } catch (error) {
    console.error("Error al extraer la entrevista", error);
  }
};

export const getComments = async (id) => {
  try {
    return (await api.get(`comentarios/?noticia=${id}`)).data;
  } catch {
    console.error("Error al obtener los comentarios");
    return [];
  }
};

export const postComment = async (noticiaId, contenido) => {
  try {
    const response = await api.post(
      "comentarios/",
      { noticia: noticiaId, contenido },
      { headers: getAuthHeaders() }
    );
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.detail || "Error al comentar",
    };
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await api.post("register/", userData);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || "Error desconocido",
    };
  }
};

export const getTags = async (params = {}) => {
  try {
    const response = await api.get("tags/", { params });
    return { ...normalizeListResponse(response), error: null };
  } catch (error) {
    console.error("Error al obtener los tags", error);
    return emptyListResult(error);
  }
};

export const getEvents = async (params = {}) => {
  try {
    const response = await api.get("eventos/", { params });
    return { ...normalizeListResponse(response), error: null };
  } catch (error) {
    console.error("Error al obtener los eventos", error);
    return emptyListResult(error);
  }
};

// Fase 0 / DECISIONES.md #11: endpoint agregado liviano de fotos
// (noticias/eventos/entrevistas), usado por Gallery (home) y /cultura.
export const getGaleria = async (params = {}) => {
  try {
    const response = await api.get("galeria/", { params });
    return { ...normalizeListResponse(response), error: null };
  } catch (error) {
    console.error("Error al obtener la galería", error);
    return emptyListResult(error);
  }
};

// Fase 0 / DECISIONES.md #4: búsqueda básica por título/tag.
export const getBusqueda = async (query, params = {}) => {
  try {
    const response = await api.get("buscar/", { params: { ...params, q: query } });
    return { ...normalizeListResponse(response), error: null };
  } catch (error) {
    console.error("Error al buscar", error);
    return emptyListResult(error);
  }
};

export const getRedesSociales = async (params = {}) => {
  try {
    const response = await api.get("redes-sociales/", { params });
    return { ...normalizeListResponse(response), error: null };
  } catch (error) {
    console.error("Error al obtener las redes sociales", error);
    return emptyListResult(error);
  }
};

export const getEventBySlug = async (slug) => {
  try {
    return await api.get(`eventos/${slug}`);
  } catch (error) {
    console.error("Error al obtener el evento", error);
  }
};
