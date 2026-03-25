import axios from "axios";

import { API_BASE_URL } from "../config/api";
import { ensureValidAccessToken } from "./api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(async (config) => {
  const token = await ensureValidAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getProductos = async () => {
  try {
    return await api.get("store/productos/");
  } catch (error) {
    console.error("Error al obtener los productos", error);
  }
};

export const getCategorias = async () => {
  try {
    return await api.get("store/categorias/");
  } catch (error) {
    console.error("Error al obtener los productos", error);
  }
};

export const getProductoBySlug = async (slug) => {
  try {
    return await api.get(`store/productos/${slug}/`);
  } catch (error) {
    console.error("Error al leer los datos", error);
  }
};

export const crearPreferenciaPago = async (carrito) => {
  const token = localStorage.getItem("accessToken");

  try {
    const response = await api.post(
      "crear-pago/",
      { carrito },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error al crear preferencia de pago:",
      error.response?.data || error.message
    );
    throw error;
  }
};
