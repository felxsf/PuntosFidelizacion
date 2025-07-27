import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PublicRoute() {
  const { user } = useAuth();

  if (user) {
    return user.rol === 1 ? <Navigate to="/admin" replace /> : <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
