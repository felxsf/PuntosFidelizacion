import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Catalogo = () => {
  const [beneficios, setBeneficios] = useState([]);
  const [filtroTexto, setFiltroTexto] = useState("");
  const [minPuntos, setMinPuntos] = useState("");
  const [maxPuntos, setMaxPuntos] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  const fetchBeneficios = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("https://localhost:7000/api/Beneficio", {
        headers: { Authorization: `Bearer ${token}` },
      });

      let filtrados = response.data.filter((b) => {
        const texto = filtroTexto.toLowerCase();
        const matchTexto =
          b.nombre.toLowerCase().includes(texto) ||
          b.descripcion.toLowerCase().includes(texto);
        const matchMin = minPuntos === "" || b.costoEnPuntos >= parseInt(minPuntos);
        const matchMax = maxPuntos === "" || b.costoEnPuntos <= parseInt(maxPuntos);
        return matchTexto && matchMin && matchMax;
      });

      const itemsPorPagina = 6;
      const inicio = (paginaActual - 1) * itemsPorPagina;
      const paginados = filtrados.slice(inicio, inicio + itemsPorPagina);
      setBeneficios(paginados);
      setTotalPaginas(Math.ceil(filtrados.length / itemsPorPagina));
    } catch (error) {
      toast.error("Error cargando beneficios");
    }
  };

  const handleCanjear = async (beneficioId) => {
    try {
      const token = localStorage.getItem("token");
      console.log(localStorage.getItem("token"));
        console.log(token)

      const response = await axios.post(
  "https://localhost:7000/api/Usuario/canjear",
  { beneficioId },
  { headers: { Authorization: `Bearer ${token}` } }
);

      toast.success(response.data.mensaje || "Canje exitoso");
      fetchBeneficios(); // refrescar catálogo
    } catch (error) {
      const err = error.response?.data;
      if (err?.errors) {
        const errores = Object.values(err.errors).flat().join(" | ");
        toast.error(errores);
      } else {
        toast.error(err?.title || err || "Error al canjear beneficio");
      }
    }
  };

  useEffect(() => {
    fetchBeneficios();
  }, [filtroTexto, minPuntos, maxPuntos, paginaActual]);

  return (
    <div className="container mt-4">
      <ToastContainer />
      <h2>Catálogo de Beneficios</h2>
      <div className="row g-2 mb-3">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por nombre o descripción"
            value={filtroTexto}
            onChange={(e) => {
              setPaginaActual(1);
              setFiltroTexto(e.target.value);
            }}
          />
        </div>
        <div className="col-md-2">
          <input
            type="number"
            className="form-control"
            placeholder="Mín. puntos"
            value={minPuntos}
            onChange={(e) => {
              setPaginaActual(1);
              setMinPuntos(e.target.value);
            }}
          />
        </div>
        <div className="col-md-2">
          <input
            type="number"
            className="form-control"
            placeholder="Máx. puntos"
            value={maxPuntos}
            onChange={(e) => {
              setPaginaActual(1);
              setMaxPuntos(e.target.value);
            }}
          />
        </div>
      </div>

      <div className="row">
        {beneficios.map((b) => (
          <div className="col-md-4 mb-4" key={b.id}>
            <div className="card shadow-sm h-100">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{b.nombre}</h5>
                <p className="card-text">{b.descripcion}</p>
                <p className="card-text">
                  <strong>Puntos:</strong> {b.costoEnPuntos}
                </p>
                <button
                  className="btn btn-success mt-auto"
                  onClick={() => handleCanjear(b.id)}
                >
                  Canjear
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="d-flex justify-content-center mt-4">
        <nav>
          <ul className="pagination">
            {Array.from({ length: totalPaginas }, (_, i) => (
              <li key={i} className={`page-item ${paginaActual === i + 1 ? "active" : ""}`}>
                <button className="page-link" onClick={() => setPaginaActual(i + 1)}>
                  {i + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Catalogo;
