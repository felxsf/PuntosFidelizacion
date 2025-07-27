import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const containerStyle = {
    height: "100vh",
    backgroundColor: "#f8f9fa",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    padding: "2rem",
  };

  const iconStyle = {
    fontSize: "4rem",
    marginBottom: "1rem",
  };

  const titleStyle = {
    fontSize: "6rem",
    fontWeight: "bold",
    margin: 0,
  };

  const messageStyle = {
    fontSize: "1.25rem",
    marginBottom: "1rem",
  };

  return (
    <div style={containerStyle}>
      <div style={iconStyle}>🚧</div>
      <h1 style={titleStyle}>404</h1>
      <p style={messageStyle}>La página que estás buscando no existe.</p>
      <Link to="/" className="btn btn-primary mt-3">
        Volver al inicio
      </Link>
    </div>
  );
};

export default NotFound;
