import axios from "axios";

const eventApi = axios.create({
  baseURL: "/api/eventos/",
});

export const getEvents = () =>{ 
  const response = eventApi.get("/");
  return response
}