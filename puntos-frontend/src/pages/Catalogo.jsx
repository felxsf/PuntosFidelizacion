import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
    <div className="container mt-4 fade-in">
      <ToastContainer />
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0">Catálogo de Beneficios</h2>
          <p className="text-muted">Explora y canjea tus puntos por increíbles beneficios</p>
        </div>
        <Link to="/dashboard" className="btn btn-outline-primary d-flex align-items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left me-2" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
          </svg>
          Volver al Dashboard
        </Link>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title mb-3">Filtrar beneficios</h5>
          <div className="row g-3">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                  </svg>
                </span>
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
            </div>
            <div className="col-md-3">
              <div className="input-group">
                <span className="input-group-text">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-down-short" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4"/>
                  </svg>
                </span>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Mínimo puntos"
                  value={minPuntos}
                  onChange={(e) => {
                    setPaginaActual(1);
                    setMinPuntos(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="col-md-3">
              <div className="input-group">
                <span className="input-group-text">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-up-short" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5"/>
                  </svg>
                </span>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Máximo puntos"
                  value={maxPuntos}
                  onChange={(e) => {
                    setPaginaActual(1);
                    setMaxPuntos(e.target.value);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {beneficios.length > 0 ? (
        <div className="row">
          {beneficios.map((b) => (
            <div className="col-md-6 col-lg-4 mb-4" key={b.id}>
              <div className="catalog-card card h-100">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{b.nombre}</h5>
                  <p className="card-text flex-grow-1">{b.descripcion}</p>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <span className="badge bg-primary">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" className="bi bi-star-fill me-1" viewBox="0 0 16 16">
                        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                      </svg>
                      {b.costoEnPuntos} puntos
                    </span>
                    <button 
                      className="btn btn-success" 
                      onClick={() => handleCanjear(b.id)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bag-check me-1" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M10.854 8.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
                        <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z"/>
                      </svg>
                      Canjear
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="alert alert-info">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-info-circle me-2" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
            <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
          </svg>
          No se encontraron beneficios con los criterios de búsqueda actuales.
        </div>
      )}

      {totalPaginas > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <nav aria-label="Navegación de páginas">
            <ul className="pagination">
              <li className={`page-item ${paginaActual === 1 ? 'disabled' : ''}`}>
                <button 
                  className="page-link" 
                  onClick={() => setPaginaActual(paginaActual - 1)}
                  disabled={paginaActual === 1}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-left" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"/>
                  </svg>
                </button>
              </li>
              
              {Array.from({ length: totalPaginas }, (_, i) => {
                // Mostrar solo 5 páginas a la vez
                if (
                  i === 0 || // Primera página
                  i === totalPaginas - 1 || // Última página
                  (i >= paginaActual - 2 && i <= paginaActual) || // 2 páginas antes de la actual
                  (i >= paginaActual && i <= paginaActual + 1) // 1 página después de la actual
                ) {
                  return (
                    <li key={i} className={`page-item ${paginaActual === i + 1 ? "active" : ""}`}>
                      <button className="page-link" onClick={() => setPaginaActual(i + 1)}>
                        {i + 1}
                      </button>
                    </li>
                  );
                } else if (
                  (i === 1 && paginaActual > 3) || // Mostrar puntos suspensivos después de la primera página
                  (i === totalPaginas - 2 && paginaActual < totalPaginas - 2) // Mostrar puntos suspensivos antes de la última página
                ) {
                  return (
                    <li key={i} className="page-item disabled">
                      <span className="page-link">...</span>
                    </li>
                  );
                }
                return null;
              })}
              
              <li className={`page-item ${paginaActual === totalPaginas ? 'disabled' : ''}`}>
                <button 
                  className="page-link" 
                  onClick={() => setPaginaActual(paginaActual + 1)}
                  disabled={paginaActual === totalPaginas}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-right" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/>
                  </svg>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};

export default Catalogo;
