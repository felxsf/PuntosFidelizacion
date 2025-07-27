import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getSaldo, redimirPuntos, getHistorial } from "../api/usuario";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


export default function Dashboard() {
  const { token, user, logout } = useAuth();
  const [saldo, setSaldo] = useState(null);
  const [puntosARedimir, setPuntosARedimir] = useState("");
  const [historial, setHistorial] = useState([]);
  const [mensaje, setMensaje] = useState("");

  const cargarDatos = async () => {
    try {
      const resSaldo = await getSaldo(token);
      setSaldo(resSaldo.data);
      const resHistorial = await getHistorial(token);
      setHistorial(resHistorial.data);
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

  useEffect(() => {
    getSaldo(token);
    cargarDatos();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Bienvenido, {user?.nombre}</h2>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="card shadow-sm rounded-3">
            <div className="card-body">
              <h5 className="card-title">Saldo actual</h5>
              {saldo ? (
                <>
                  <p className="fs-4 mb-1">{saldo.saldoPuntos} puntos</p>
                  <p className="text-muted">Equivalente a <strong>${saldo.valorMonetario.toLocaleString()}</strong> COP</p>
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
                <button className="btn btn-success" onClick={handleRedimir}>Redimir</button>
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
    </div>
  );
}
