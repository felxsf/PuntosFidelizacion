import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7000/api",
});

export function getSaldo(token) {
  return api.get("/Usuario/saldo", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function redimirPuntos(token, puntos, observaciones) {
  return api.post(
    "/Usuario/redimir",
    { puntosARedimir: puntos, observaciones },
    { headers: { Authorization: `Bearer ${token}` } }
  );
}

export function getHistorial(token) {
  return api.get("/Usuario/historial", {
    headers: { Authorization: `Bearer ${token}` },
  });
}
