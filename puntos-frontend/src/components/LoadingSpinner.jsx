import React from 'react';

export default function LoadingSpinner({ message = "Cargando..." }) {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: "100vh" }}>
      <div className="spinner-border text-primary mb-3" role="status" style={{ width: "3rem", height: "3rem" }}>
        <span className="visually-hidden">{message}</span>
      </div>
      <p className="text-muted">{message}</p>
    </div>
  );
} 