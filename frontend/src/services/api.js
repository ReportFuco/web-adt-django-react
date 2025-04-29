import axios from "axios";

const apiBaseUrl = "http://10.0.165.80:8000/api/";

export const api = axios.create({
  baseURL: apiBaseUrl,
  headers: { "Content-Type": "application/json" },
});

const getAuthHeaders = () => {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const register = async (userData) => {
  try {
    const response = await api.post("register/", userData);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response.data };
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

export const getNoticia = async (slug) => {
  try {
    const response = await axios.get(`${apiBaseUrl}noticias/${slug}/`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener la noticia:", error);
    throw error;
  }
};

export const getNoticias = async () => {
  try {
    const response = await api.get("noticias/");
    return response;
  } catch {
    console.error("Error al obtener las noticias");
    return [];
  }
};

export const getInterview = async () => {
  try {
    const response = await api.get("entrevistas/");
    return response;
  } catch {
    console.error("Error al obtener las entrevistas");
    return [];
  }
};

export const getInterviewBySlug = async (slug) => {
  try {
    const response = await api.get(`entrevistas/${slug}`);
    return response;
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

export const getEvents = async () => {
  try {
    const response = await api.get("eventos/");
    return response;
  } catch (error) {
    console.error("Error al obtener los datos", error);
  }
};

export const getEventBySlug = async (slug) => {
  try {
    return await api.get(`eventos/${slug}`);
  } catch (error) {
    console.error("Error al obtener el evento", error);
  }
};
