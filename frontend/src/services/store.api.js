import axios from "axios";

const baseURL = "http://192.168.1.85:8000/api/store/";

export const api = axios.create({
  baseURL: baseURL,
  headers: { "Content-Type": "application/json" },
});

export const getProductos = async () => {
  try {
    return await api.get("productos/");
  } catch (error) {
    console.error("Error al obtener los productos", error);
  }
};

export const getCategorias = async () => {
  try {
    return await api.get("categorias/");
  } catch (error) {
    console.error("Error al obtener los productos", error);
  }
};

export const getProductoBySlug = async (slug) => {
  try {
    return await api.get(`productos/${slug}/`);
  } catch (error) {
    console.error("Error al leer los datos", error);
  }
};
