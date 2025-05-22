import axios from "axios";

const baseURL = "http://209.126.1.114/api/";

export const api = axios.create({
  baseURL: baseURL,
  headers: { "Content-Type": "application/json" },
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
