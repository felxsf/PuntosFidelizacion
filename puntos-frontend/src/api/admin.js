import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7000/api",
});

export function getUsuarios(token) {
  return api.get("/Admin/usuarios", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function otorgarPuntos(token, usuarioId, puntos, observaciones) {
  return api.post(
    "/Admin/otorgar",
    { usuarioId, puntos, observaciones },
    { headers: { Authorization: `Bearer ${token}` } }
  );
}

export function getHistorialGeneral(token) {
  return api.get("/Admin/historial", {
    headers: { Authorization: `Bearer ${token}` },
  });
}
