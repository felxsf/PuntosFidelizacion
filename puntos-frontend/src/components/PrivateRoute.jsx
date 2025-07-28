import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

export default function PrivateRoute({ allowedRoles }) {
  const { user, isLoading } = useAuth();

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return <LoadingSpinner message="Verificando autenticación..." />;
  }

  // Si no hay usuario, redirigir al login
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Si hay roles específicos y el usuario no tiene permisos
  if (allowedRoles && !allowedRoles.includes(user.rol)) {
    // Redirigir según el rol del usuario
    if (user.rol === 1) {
      return <Navigate to="/admin" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <Outlet />;
}
