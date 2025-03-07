import axios, { mergeConfig } from "axios";

const API_URL = "/api/";

export const login = async (identifier, password) => {
  try {
      const response = await axios.post("http://127.0.0.1:8000/api/token/", {
          username: identifier,
          password: password,
      });

      const { access, refresh } = response.data;

      // Guardar tokens en localStorage
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);

      console.log("Autenticación exitosa:", response.data);
      return { success: true, token: access };
  } catch (error) {
      console.error("Error en la autenticación:", error.response?.data || error.message);
      return { success: false, error: error.response?.data?.detail || "Error en el login" };
  }
};

export const register = async (userData) => {
  try {
    const response = await axios.post("http://127.0.0.1:8000/api/register/", userData);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response.data };
  }
};


export const getNoticias = async () => {
  try {
    const response = await axios.get(`${API_URL}noticias/`);
    return response
  } catch (error) {
    console.error("Error al obtener noticias:", error);
    return [];
  }
};
