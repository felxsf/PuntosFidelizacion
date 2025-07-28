import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getSaldo, redimirPuntos, getHistorial } from "../api/usuario";
import { getDestacados } from "../api/beneficio";
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';

export default function Dashboard() {
  const { token, user, logout } = useAuth();
  const [saldo, setSaldo] = useState(null);
  const [puntosARedimir, setPuntosARedimir] = useState("");
  const [historial, setHistorial] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [destacados, setDestacados] = useState([]);

  const cargarDatos = async () => {
    try {
      const resSaldo = await getSaldo(token);
      setSaldo(resSaldo.data);

      const resHistorial = await getHistorial(token);
      setHistorial(resHistorial.data);

      const resDestacados = await getDestacados(token);
      setDestacados(resDestacados.data);
    } catch (err) {
      alert("Error cargando datos. ¿Sesión vencida?");
      logout();
    }
  };

  const handleRedimir = async () => {
    const cantidad = parseInt(puntosARedimir);
    if (isNaN(cantidad) || cantidad <= 0) {
      toast.warning("Debes ingresar una cantidad válida de puntos mayor a 0");
      return;
    }

    try {
      const res = await redimirPuntos(token, cantidad, "Redención desde Dashboard");
      toast.success(res.data.mensaje);
      setPuntosARedimir("");
      cargarDatos();
    } catch (err) {
      const errorData = err.response?.data;
      if (errorData?.errors) {
        const errores = Object.values(errorData.errors).flat().join(" | ");
        toast.error(errores);
      } else {
        toast.error(errorData?.title || "Error al redimir puntos");
      }
    }
  };

  const handleCanjear = async (beneficioId) => {
  try {
    const res = await fetch("https://localhost:7000/api/Usuario/canjear", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ beneficioId }),
    });

    if (!res.ok) {
      const err = await res.json();
      const errores = err?.errors
        ? Object.values(err.errors).flat().join(" | ")
        : err?.title || "Error al canjear";
      toast.error(errores);
      return;
    }

    const data = await res.json();
    toast.success(data.mensaje || "Canje exitoso");

    // 👇 Actualizar saldo directamente (puedes hacerlo más detallado si tienes ese dato)
    setSaldo((prev) => ({
      ...prev,
      saldoPuntos: prev.saldoPuntos - data.valorDescontado || 0,
    }));

    // 👇 Agregar transacción visualmente
    const nuevaTransaccion = {
      fecha: new Date().toISOString(),
      tipo: "Canje",
      puntos: -1 * destacados.find((b) => b.id === beneficioId).costoEnPuntos,
      observaciones: "Canje de beneficio",
    };
    setHistorial((prev) => [nuevaTransaccion, ...prev]);

    // 👉 Actualizar nuevamente para asegurar estado global actualizado
    // await cargarDatos(); // opcional si ya insertaste arriba
  } catch (error) {
    toast.error("Error inesperado al canjear beneficio");
  }
};



  useEffect(() => {
    cargarDatos();
  }, []);

  return (
    <div className="container mt-4 fade-in">
      <ToastContainer />
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0">Bienvenido, {user?.nombre}</h2>
          <p className="text-muted">Gestiona tus puntos y beneficios</p>
        </div>
        <Link to="/catalogo" className="btn btn-primary d-flex align-items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-gift me-2" viewBox="0 0 16 16">
            <path d="M3 2.5a2.5 2.5 0 0 1 5 0 2.5 2.5 0 0 1 5 0v.006c0 .07 0 .27-.038.494H15a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 14.5V7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h2.038A2.97 2.97 0 0 1 3 2.506zm1.068.5H7v-.5a1.5 1.5 0 1 0-3 0c0 .085.002.274.045.43a.52.52 0 0 0 .023.07M9 3h2.932a.56.56 0 0 0 .023-.07c.043-.156.045-.345.045-.43a1.5 1.5 0 0 0-3 0zM1 4v2h6V4zm8 0v2h6V4zm5 3H9v8h4.5a.5.5 0 0 0 .5-.5zm-7 8V7H2v7.5a.5.5 0 0 0 .5.5z"/>
          </svg>
          Ver Catálogo de Beneficios
        </Link>
      </div>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="dashboard-card card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title mb-0">Saldo actual</h5>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="var(--primary-color)" className="bi bi-coin" viewBox="0 0 16 16">
                  <path d="M5.5 9.511c.076.954.83 1.697 2.182 1.785V12h.6v-.709c1.4-.098 2.218-.846 2.218-1.932 0-.987-.626-1.496-1.745-1.76l-.473-.112V5.57c.6.068.982.396 1.074.85h1.052c-.076-.919-.864-1.638-2.126-1.716V4h-.6v.719c-1.195.117-2.01.836-2.01 1.853 0 .9.606 1.472 1.613 1.707l.397.098v2.034c-.615-.093-1.022-.43-1.114-.9zm2.177-2.166c-.59-.137-.91-.416-.91-.836 0-.47.345-.822.915-.925v1.76h-.005zm.692 1.193c.717.166 1.048.435 1.048.91 0 .542-.412.914-1.135.982V8.518z"/>
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                  <path d="M8 13.5a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11m0 .5A6 6 0 1 0 8 2a6 6 0 0 0 0 12"/>
                </svg>
              </div>
              {saldo ? (
                <div>
                  <h2 className="display-5 fw-bold text-primary mb-1">{saldo.saldoPuntos}</h2>
                  <p className="fs-5 mb-1">puntos disponibles</p>
                  <div className="d-flex align-items-center mt-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-currency-dollar me-1" viewBox="0 0 16 16">
                      <path d="M4 10.781c.148 1.667 1.513 2.85 3.591 3.003V15h1.043v-1.216c2.27-.179 3.678-1.438 3.678-3.3 0-1.59-.947-2.51-2.956-3.028l-.722-.187V3.467c1.122.11 1.879.714 2.07 1.616h1.47c-.166-1.6-1.54-2.748-3.54-2.875V1H7.591v1.233c-1.939.23-3.27 1.472-3.27 3.156 0 1.454.966 2.483 2.661 2.917l.61.162v4.031c-1.149-.17-1.94-.8-2.131-1.718zm3.391-3.836c-1.043-.263-1.6-.825-1.6-1.616 0-.944.704-1.641 1.8-1.828v3.495l-.2-.05zm1.591 1.872c1.287.323 1.852.859 1.852 1.769 0 1.097-.826 1.828-2.2 1.939V8.73z"/>
                    </svg>
                    <span className="text-muted">
                      Equivalente a <strong className="text-success">${saldo.valorMonetario.toLocaleString()}</strong> COP
                    </span>
                  </div>
                </div>
              ) : (
                <div className="d-flex justify-content-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="dashboard-card card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title mb-0">Redimir puntos</h5>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="var(--success-color)" className="bi bi-arrow-down-circle" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293z"/>
                </svg>
              </div>
              <p className="text-muted mb-3">Convierte tus puntos en dinero real</p>
              <div className="input-group mb-3">
                <input
                  type="number"
                  className="form-control form-control-lg"
                  placeholder="Cantidad de puntos"
                  value={puntosARedimir}
                  onChange={(e) => setPuntosARedimir(e.target.value)}
                />
                <button 
                  className="btn btn-success btn-lg" 
                  onClick={handleRedimir}
                  disabled={!puntosARedimir || puntosARedimir <= 0}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-circle me-1" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                    <path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05"/>
                  </svg>
                  Redimir
                </button>
              </div>
              {mensaje && <div className="alert alert-info mt-2 p-2">{mensaje}</div>}
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-12">
          <div className="dashboard-card card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title mb-0">Historial de transacciones</h5>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="var(--primary-color)" className="bi bi-clock-history" viewBox="0 0 16 16">
                  <path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022zm2.004.45a7 7 0 0 0-.985-.299l.219-.976c.383.086.76.2 1.126.342zm1.37.71a7 7 0 0 0-.439-.27l.493-.87a8 8 0 0 1 .979.654l-.615.789a7 7 0 0 0-.418-.302zm1.834 1.79a7 7 0 0 0-.653-.796l.724-.69c.27.285.52.59.747.91l-.818.576zm.744 1.352a7 7 0 0 0-.214-.468l.893-.45a8 8 0 0 1 .45 1.088l-.95.313a7 7 0 0 0-.179-.483m.53 2.507a7 7 0 0 0-.1-1.025l.985-.17c.067.386.106.778.116 1.17l-1 .025zm-.131 1.538c.033-.17.06-.339.081-.51l.993.123a8 8 0 0 1-.23 1.155l-.964-.267c.046-.165.086-.332.12-.501zm-.952 2.379c.184-.29.346-.594.486-.908l.914.405c-.16.36-.345.706-.555 1.038l-.845-.535m-.964 1.205c.122-.122.239-.248.35-.378l.758.653a8 8 0 0 1-.401.432l-.707-.707z"/>
                  <path d="M8 1a7 7 0 1 0 4.95 11.95l.707.707A8.001 8.001 0 1 1 8 0z"/>
                  <path d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5"/>
                </svg>
              </div>
              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Tipo</th>
                      <th>Puntos</th>
                      <th>Observaciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historial.length > 0 ? (
                      historial.map((item, index) => (
                        <tr key={index}>
                          <td>{new Date(item.fecha).toLocaleString()}</td>
                          <td>
                            <span className={`badge ${item.tipo === 'Canje' ? 'bg-warning' : item.puntos > 0 ? 'bg-success' : 'bg-danger'}`}>
                              {item.tipo}
                            </span>
                          </td>
                          <td className={item.puntos > 0 ? 'text-success fw-bold' : 'text-danger fw-bold'}>
                            {item.puntos > 0 ? `+${item.puntos}` : item.puntos}
                          </td>
                          <td>{item.observaciones}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center py-3">No hay transacciones registradas</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 mb-3 d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Beneficios destacados</h5>
        <Link to="/catalogo" className="btn btn-sm btn-outline-primary">
          Ver todos los beneficios
        </Link>
      </div>
      <div className="row">
        {destacados.length > 0 ? (
          destacados.map((b) => (
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
                        <path fillRule="evenodd" d="M10.854 8.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
                        <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z"/>
                      </svg>
                      Canjear
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <div className="alert alert-info">
              No hay beneficios destacados disponibles en este momento.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
