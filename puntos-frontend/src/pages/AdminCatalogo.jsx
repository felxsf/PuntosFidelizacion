
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AdminCatalogo = () => {
  const [beneficios, setBeneficios] = useState([]);
  const [modoEditar, setModoEditar] = useState(false);
  const [form, setForm] = useState({ nombre: "", descripcion: "", costoEnPuntos: "" });
  const [beneficioId, setBeneficioId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchBeneficios = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get("https://localhost:7000/api/Beneficio", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBeneficios(res.data);
    } catch (error) {
      toast.error("Error al cargar los beneficios");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBeneficios();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modoEditar) {
        await axios.put(`https://localhost:7000/api/Beneficio/${beneficioId}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Beneficio actualizado exitosamente");
      } else {
        await axios.post("https://localhost:7000/api/Beneficio/crear", form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Beneficio creado exitosamente");
      }
      fetchBeneficios();
      setForm({ nombre: "", descripcion: "", costoEnPuntos: "" });
      setModoEditar(false);
      setBeneficioId(null);
    } catch (err) {
      toast.error("Error al guardar beneficio");
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este beneficio?")) return;
    try {
      await axios.delete(`https://localhost:7000/api/Beneficio/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Beneficio eliminado exitosamente");
      fetchBeneficios();
    } catch (error) {
      toast.error("Error al eliminar el beneficio");
    }
  };

  const handleEditar = (beneficio) => {
    setModoEditar(true);
    setForm({
      nombre: beneficio.nombre,
      descripcion: beneficio.descripcion,
      costoEnPuntos: beneficio.costoEnPuntos,
    });
    setBeneficioId(beneficio.id);
  };

  const handleCancelar = () => {
    setModoEditar(false);
    setForm({ nombre: "", descripcion: "", costoEnPuntos: "" });
    setBeneficioId(null);
  };

  if (isLoading) {
    return (
      <div className="admin-catalogo-container">
        <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-catalogo-container">
      <div className="container-fluid py-4">
        {/* Header */}
        <div className="admin-header mb-4">
          <div className="d-flex align-items-center mb-3">
            <div className="admin-icon me-3">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <h2 className="admin-title mb-1">Administración del Catálogo</h2>
              <p className="admin-subtitle">Gestiona los beneficios disponibles para los usuarios</p>
            </div>
          </div>
        </div>

        <div className="row">
          {/* Formulario */}
          <div className="col-lg-4 mb-4">
            <div className="admin-form-card">
              <div className="card-header-modern">
                <h5 className="mb-0" style={{color: "white"}}>
                  {modoEditar ? (
                    <>
                      <svg className="me-2" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M18.5 2.50023C18.8978 2.1025 19.4374 1.87891 20 1.87891C20.5626 1.87891 21.1022 2.1025 21.5 2.50023C21.8978 2.89795 22.1214 3.43762 22.1214 4.00023C22.1214 4.56284 21.8978 5.1025 21.5 5.50023L12 15.0002L8 16.0002L9 12.0002L18.5 2.50023Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Editar Beneficio
                    </>
                  ) : (
                    <>
                      <svg className="me-2" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Nuevo Beneficio
                    </>
                  )}
                </h5>
              </div>
              <div className="card-body-modern">
                <form onSubmit={handleSubmit}>
                  <div className="form-group-modern mb-3">
                    <label className="form-label-modern">Nombre del Beneficio</label>
                    <input
                      type="text"
                      className="form-control-modern"
                      placeholder="Ej: Descuento 20% en restaurante"
                      value={form.nombre}
                      onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="form-group-modern mb-3">
                    <label className="form-label-modern">Descripción</label>
                    <textarea
                      className="form-control-modern"
                      rows="3"
                      placeholder="Describe el beneficio..."
                      value={form.descripcion}
                      onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="form-group-modern mb-4">
                    <label className="form-label-modern">Costo en Puntos</label>
                    <div className="input-group-modern">
                      <input
                        type="number"
                        className="form-control-modern"
                        placeholder="100"
                        value={form.costoEnPuntos}
                        onChange={(e) => setForm({ ...form, costoEnPuntos: e.target.value })}
                        required
                        min="1"
                      />
                      <span className="input-group-text-modern">pts</span>
                    </div>
                  </div>
                  
                  <div className="d-flex gap-2">
                    <button className="btn-modern btn-primary-modern" type="submit">
                      {modoEditar ? "Actualizar" : "Crear"}
                    </button>
                    {modoEditar && (
                      <button 
                        type="button" 
                        className="btn-modern btn-secondary-modern"
                        onClick={handleCancelar}
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Lista de Beneficios */}
          <div className="col-lg-8">
            <div className="admin-list-card">
              <div className="card-header-modern">
                <h5 className="mb-0" style={{color: "white"}}>
                  <svg className="me-2" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 11H15M9 15H15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Beneficios ({beneficios.length})
                </h5>
              </div>
              <div className="card-body-modern">
                {beneficios.length === 0 ? (
                  <div className="empty-state">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-3">
                      <path d="M20 7L10 17L5 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <h6>No hay beneficios registrados</h6>
                    <p className="text-muted">Crea el primer beneficio usando el formulario</p>
                  </div>
                ) : (
                  <div className="beneficios-grid">
                    {beneficios.map((beneficio) => (
                      <div key={beneficio.id} className="beneficio-card">
                        <div className="beneficio-header">
                          <h6 className="beneficio-nombre">{beneficio.nombre}</h6>
                          <div className="beneficio-puntos">
                            <span className="puntos-badge">{beneficio.costoEnPuntos} pts</span>
                          </div>
                        </div>
                        <p className="beneficio-descripcion">{beneficio.descripcion}</p>
                        <div className="beneficio-actions">
                          <button 
                            className="btn-action btn-edit"
                            onClick={() => handleEditar(beneficio)}
                            title="Editar"
                          >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16.862 5.487a2.25 2.25 0 0 1 3.182 3.182l-9.75 9.75a2 2 0 0 1-.707.464l-4.11 1.37a.5.5 0 0 1-.632-.632l1.37-4.11a2 2 0 0 1 .464-.707l9.75-9.75zm2.121-2.121a4.25 4.25 0 0 0-6.01 0l-9.75 9.75A4 4 0 0 0 2.7 16.7l-1.37 4.11A2 2 0 0 0 4.19 23.67l4.11-1.37a4 4 0 0 0 1.584-.964l9.75-9.75a4.25 4.25 0 0 0 0-6.01z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                          </svg>
                          </button>
                          <button 
                            className="btn-action btn-delete"
                            onClick={() => handleEliminar(beneficio.id)}
                            title="Eliminar"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCatalogo;
