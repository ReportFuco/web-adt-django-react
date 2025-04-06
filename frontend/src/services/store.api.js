import axios from "axios";

const baseURL = "http://localhost:8000/api/store/";

export const api = axios.create({
  baseURL: baseURL,
  headers: { "Content-Type": "application/json" },
});

export const getProductos = async () => {
  try{
    return await api.get("productos/");
  } catch (error) {
    console.error("Error al obtener los productos", error)
  }
}