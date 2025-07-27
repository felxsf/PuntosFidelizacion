import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7000/api",
});

export async function login(correo, password) {
  const res = await api.post("/Auth/login", { correo, password });
  return res.data;
}

export async function register(correo, password) {
  const res = await api.post("/Auth/register", { correo, password });
  return res.data;
}
