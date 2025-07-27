import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getSaldo, redimirPuntos, getHistorial } from "../api/usuario";
import { getDestacados } from "../api/beneficio";
import { toast, ToastContainer } from "react-toastify";
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
    <div className="container mt-4">
      <ToastContainer />
      <h2 className="mb-2">Bienvenido, {user?.nombre}</h2>

      <button
        className="btn btn-primary mt-2 mb-4"
        onClick={() => (window.location.href = "/catalogo")}
      >
        Ver Catálogo de Beneficios
      </button>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="card shadow-sm rounded-3">
            <div className="card-body">
              <h5 className="card-title">Saldo actual</h5>
              {saldo ? (
                <>
                  <p className="fs-4 mb-1">{saldo.saldoPuntos} puntos</p>
                  <p className="text-muted">
                    Equivalente a{" "}
                    <strong>${saldo.valorMonetario.toLocaleString()}</strong> COP
                  </p>
                </>
              ) : (
                <p>Cargando saldo...</p>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-sm rounded-3">
            <div className="card-body">
              <h5 className="card-title">Redimir puntos</h5>
              <div className="input-group mb-2">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Cantidad de puntos"
                  value={puntosARedimir}
                  onChange={(e) => setPuntosARedimir(e.target.value)}
                />
                <button className="btn btn-success" onClick={handleRedimir}>
                  Redimir
                </button>
              </div>
              {mensaje && <div className="alert alert-info mt-2 p-2">{mensaje}</div>}
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm rounded-3 mt-4">
        <div className="card-body">
          <h5 className="card-title mb-3">Historial de transacciones</h5>
          <div className="table-responsive">
            <table className="table table-striped table-bordered">
              <thead className="table-light">
                <tr>
                  <th>Fecha</th>
                  <th>Tipo</th>
                  <th>Puntos</th>
                  <th>Observaciones</th>
                </tr>
              </thead>
              <tbody>
                {historial.map((item, index) => (
                  <tr key={index}>
                    <td>{new Date(item.fecha).toLocaleString()}</td>
                    <td>{item.tipo}</td>
                    <td>{item.puntos}</td>
                    <td>{item.observaciones}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <h5 className="mt-5 mb-3">Beneficios destacados</h5>
      <div className="row">
        {destacados.map((b) => (
          <div className="col-md-6" key={b.id}>
            <div className="card mb-3 shadow-sm border-primary">
              <div className="card-body">
                <h6 className="card-title">{b.nombre}</h6>
                <p className="card-text">{b.descripcion}</p>
                <span className="badge bg-primary mb-2">{b.costoEnPuntos} puntos</span>
                <br />
                <button className="btn btn-outline-success" onClick={() => handleCanjear(b.id)}>
                  Canjear
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
