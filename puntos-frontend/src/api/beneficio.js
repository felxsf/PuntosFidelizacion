// src/api/beneficio.js
import axios from "axios";

export const getDestacados = (token) =>
  axios.get("https://localhost:7000/api/Beneficio/destacados", {
    headers: { Authorization: `Bearer ${token}` },
  });
