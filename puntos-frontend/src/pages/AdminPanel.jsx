import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getUsuarios, otorgarPuntos, getHistorialGeneral } from "../api/admin";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';



export default function AdminPanel() {
  const { token, logout } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState("");
  const [puntos, setPuntos] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [mensaje, setMensaje] = useState("");
  
  const cargarDatos = async () => {
    try {
      const resUsuarios = await getUsuarios(token);
      setUsuarios(resUsuarios.data);
      const resHistorial = await getHistorialGeneral(token);
      setHistorial(resHistorial.data);
    } catch (err) {
      alert("Error cargando datos.");
      logout();
    }
  };

  const handleOtorgar = async () => {
  const cantidad = parseInt(puntos);

  // ✅ Validaciones previas
  if (!usuarioSeleccionado) {
    toast.warning("Debes seleccionar un usuario");
    return;
  }

  if (isNaN(cantidad) || cantidad <= 0) {
    toast.warning("Debes ingresar una cantidad válida de puntos mayor a 0");
    return;
  }

  try {
    await otorgarPuntos(token, parseInt(usuarioSeleccionado), cantidad, observaciones);
    toast.success("Puntos otorgados exitosamente");
    setPuntos("");
    setObservaciones("");
    setUsuarioSeleccionado("");
    cargarDatos();
  } catch (err) {
    const errorData = err.response?.data;
    if (errorData?.errors) {
      const errores = Object.values(errorData.errors).flat().join(" | ");
      toast.error(errores);
    } else {
      toast.error(errorData?.title || "Error al otorgar puntos");
    }
  }
};


  useEffect(() => {
    cargarDatos();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Panel del Administrador</h2>

      <div className="card shadow-sm rounded-3 mb-4">
        <div className="card-body">
          <h5 className="card-title mb-3">Otorgar puntos a un usuario</h5>
          <div className="row g-3 align-items-end">
            <div className="col-md-4">
              <select
                className="form-select"
                value={usuarioSeleccionado}
                onChange={(e) => setUsuarioSeleccionado(e.target.value)}
              >
                <option value="">Selecciona un usuario</option>
                {usuarios.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.nombre} ({u.correo})
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <input
                type="number"
                className="form-control"
                placeholder="Puntos"
                value={puntos}
                onChange={(e) => setPuntos(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <input
                className="form-control"
                placeholder="Observaciones"
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <button className="btn btn-primary w-100" onClick={handleOtorgar}>
                Otorgar
              </button>
            </div>
          </div>
          {mensaje && <div className="alert alert-info mt-3 p-2">{mensaje}</div>}
        </div>
      </div>

      <div className="card shadow-sm rounded-3 mb-4">
        <div className="card-body">
          <h5 className="card-title mb-3">Lista de usuarios</h5>
          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead className="table-light">
                <tr>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Rol</th>
                  <th>Saldo</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u) => (
                  <tr key={u.id}>
                    <td>{u.nombre}</td>
                    <td>{u.correo}</td>
                    <td>{u.rol === 1 ? "Admin" : "Usuario"}</td>
                    <td>{u.saldoPuntos}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="card shadow-sm rounded-3">
        <div className="card-body">
          <h5 className="card-title mb-3">Historial de transacciones global</h5>
          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead className="table-light">
                <tr>
                  <th>Fecha</th>
                  <th>Usuario</th>
                  <th>Correo</th>
                  <th>Tipo</th>
                  <th>Puntos</th>
                  <th>Observaciones</th>
                </tr>
              </thead>
              <tbody>
                {historial.map((item, i) => (
                  <tr key={i}>
                    <td>{new Date(item.fecha).toLocaleString()}</td>
                    <td>{item.usuario}</td>
                    <td>{item.correo}</td>
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
