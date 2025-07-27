# Sistema de Gestión de Puntos (Programa de Fidelización)

Este es un sistema web completo para gestionar un programa de fidelización empresarial, donde los usuarios pueden acumular y redimir puntos, y los administradores pueden otorgar puntos a través de un panel administrativo.

---

## 🚀 Tecnologías Utilizadas

### Backend (.NET)
- ASP.NET Core Web API (.NET 6+)
- Entity Framework Core (SQL Server)
- Autenticación con JWT
- CORS habilitado
- Swagger para pruebas

### Frontend (React + Vite)
- React 18
- Axios para peticiones HTTP
- React Router DOM para rutas
- Context API para manejo de sesión
- Bootstrap 5 + react-toastify para estilos y notificaciones

---

## ⚙️ Funcionalidades

### Usuario Regular (`Rol = 0`)
- Registro e inicio de sesión
- Visualización de saldo en puntos y valor monetario
- Redención de puntos
- Historial de transacciones

### Administrador (`Rol = 1`)
- Panel para otorgar puntos a usuarios
- Listado de usuarios (sin mostrarse a sí mismo)
- Historial global de transacciones

---

## 🧑‍💻 Instalación y ejecución local

### Backend

1. Abre la solución en Visual Studio.
2. Revisa el archivo `appsettings.json` con tu cadena de conexión.
3. Ejecuta las migraciones:
   ```
   Add-Migration InitialCreate
   Update-Database
   ```
4. Ejecuta el backend (F5 o Ctrl + F5) y prueba en Swagger (`https://localhost:7000/swagger`).

### Frontend

1. Ve a la carpeta del frontend:
   ```
   cd puntos-frontend
   ```
2. Instala dependencias:
   ```
   npm install
   ```
3. Ejecuta en modo desarrollo:
   ```
   npm run dev
   ```

---

## 🔒 Seguridad

- Los endpoints están protegidos con JWT.
- Los roles determinan acceso a funcionalidades.
- Frontend evita acceso a rutas no permitidas con rutas protegidas (`PrivateRoute`) y públicas (`PublicRoute`).

---

## ✅ Mejores prácticas aplicadas

- Separación de responsabilidades (auth, usuario, admin)
- Validación de entrada en backend y frontend
- Uso de `toast` para mensajes al usuario
- Protección contra acceso no autorizado
- Redirección automática según el rol

---

## 📦 Despliegue sugerido

- **Frontend**: Vercel o Netlify
- **Backend**: Azure App Service, Render o Railway
- **Base de datos**: Azure SQL, Railway, SQL Server local

---

## 📁 Estructura de carpetas

```
/backend
  /Controllers
  /Models
  /DTOs
  /Services
  /Data
  Program.cs

/frontend
  /src
    /api
    /components
    /context
    /pages
    App.jsx
    main.jsx
```

---

## 📝 Autor

Desarrollado por Felix Sanchez Fandiño como solución completa para fidelización de clientes usando tecnologías modernas y buenas prácticas de desarrollo web.
