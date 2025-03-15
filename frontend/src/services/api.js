import axios from "axios";
import { useAuth } from "../context/AuthContext";

const API_BASE_URL = "/api/";

// Crear una única instancia de axios
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Hook para manejar la API con autenticación
export const useApi = () => {
  const { token } = useAuth();

  // Función para obtener headers de autenticación automáticamente
  const getAuthHeaders = () => ({
    Authorization: token ? `Bearer ${token}` : "",
    "Content-Type": "application/json",
  });

  return {
    // 🔹 Login (autenticación)
    login: async (identifier, password) => {
      try {
        const response = await axios.post(
          `${API_BASE_URL}token/`,
          {
            username: identifier,
            password: password,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const { access, refresh } = response.data;
        localStorage.setItem("accessToken", access);
        localStorage.setItem("refreshToken", refresh);

        return { success: true, token: access };
      } catch (error) {
        return {
          success: false,
          error: error.response?.data?.detail || "Error en el login",
        };
      }
    },

    // 🔹 Registro de usuario
    register: async (userData) => {
      try {
        const response = await axios.post(`${API_BASE_URL}register/`, userData);
        return { success: true, data: response.data };
      } catch (error) {
        return {
          success: false,
          error: error.response?.data || "Error en el registro",
        };
      }
    },

    // 🔹 Noticias
    getNoticias: async () => {
      try {
        return await axiosInstance.get("/noticias/");
      } catch (error) {
        console.error("Error al obtener noticias:", error);
        return [];
      }
    },

    getNews: async (id) => {
      return await axiosInstance.get(`/noticias/${id}`);
    },

    // 🔹 Comentarios
    getComments: async (noticiaId) => {
      return await axiosInstance.get(`/comentarios/?noticia_id=${noticiaId}`, {
        headers: getAuthHeaders(),
      });
    },

    postComment: async (noticiaId, contenido) => {
      return await axiosInstance.post(
        "/comentarios/",
        { noticia: noticiaId, contenido },
        { headers: getAuthHeaders() }
      );
    },

    deleteComment: async (comentarioId) => {
      return await axiosInstance.delete(`/comentarios/${comentarioId}/`, {
        headers: getAuthHeaders(),
      });
    },

    updateComment: async (comentarioId, contenido) => {
      return await axiosInstance.put(
        `/comentarios/${comentarioId}/`,
        { contenido },
        { headers: getAuthHeaders() }
      );
    },

    // 🔹 Eventos
    getEvents: async () => {
      return await axiosInstance.get("/eventos/");
    },
  };
};
