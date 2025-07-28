import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import NotFound from "./pages/NotFound";
import Catalogo from './pages/Catalogo';


export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* RUTAS PÚBLICAS: login y registro */}
          <Route element={<PublicRoute />}>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* RUTAS PRIVADAS */}
          <Route element={<PrivateRoute allowedRoles={[0]} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/catalogo" element={<Catalogo />} />
          </Route>

          <Route element={<PrivateRoute allowedRoles={[1]} />}>
            <Route path="/admin" element={<AdminPanel />} />
          </Route>

          {/* Ruta 404 para rutas no encontradas */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
      </BrowserRouter>
    </AuthProvider>
  );
}