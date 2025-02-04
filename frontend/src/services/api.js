import axios from 'axios';

const API_URL = '/api/';

export const getNoticias = async () => {
  try {
    const response = await axios.get(`${API_URL}noticias/`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener noticias:', error);
    return [];
  }
};