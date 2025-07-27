# 🎁 Sistema de Fidelización de Puntos

Este sistema permite a los usuarios acumular, visualizar y canjear puntos por beneficios. Incluye autenticación con JWT, redención de puntos, catálogo de beneficios, historial de transacciones y roles de usuario.

---

## 🧱 Tecnologías Utilizadas

### Backend (API REST - ASP.NET Core)
- .NET 8
- Entity Framework Core
- SQL Server
- JWT (Json Web Tokens) para autenticación
- AutoMapper (opcional para DTOs)
- CORS habilitado

### Frontend (SPA - React)
- React 18 con Hooks
- Bootstrap 5
- Axios
- React Router DOM
- React Toastify

---

## 🚀 Funcionalidades

### 👤 Autenticación
- Login con validación JWT.
- Roles por usuario (`Admin`, `Cliente`, etc.).
- Protecciones con `[Authorize]` en controladores.

### 🎁 Beneficios
- Listado de beneficios disponibles.
- Filtros por texto, descripción y rango de puntos.
- Paginación por 6 elementos por página.
- Botón de `Canjear` visible solo si el usuario tiene puntos suficientes.

### 💰 Redención de Puntos
- Canje de beneficios desde el **Catálogo** o el **Dashboard**.
- Actualización automática del saldo.
- Registro visual en el historial de transacciones.

### 📊 Dashboard del Usuario
- Saldo actual en puntos y su equivalente en pesos.
- Redención libre de puntos (manual).
- Transacciones visibles (tipo, puntos, fecha, observación).
- Visualización de beneficios destacados.

---

## 🗂 Estructura del Proyecto

```
/backend
  ├── Controllers
  ├── Data
  ├── DTOs
  ├── Helpers
  ├── Models
  └── Program.cs

/frontend
  ├── src/
      ├── components/
      ├── context/AuthContext.jsx
      ├── pages/
          ├── Dashboard.jsx
          ├── Catalogo.jsx
      ├── api/
          ├── usuario.js
          ├── beneficio.js
```

---

## ⚙️ Configuración del Proyecto

### 🧪 Base de datos

1. En `appsettings.json`, configura la conexión a SQL Server:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=PuntosFidelizacion;Trusted_Connection=True;"
}
```

2. Ejecuta migraciones:

```bash
dotnet ef migrations add InitialCreate
dotnet ef database update
```

3. Si deseas poblar datos iniciales:

```csharp
DbInitializer.Seed(context);
```

---

## ▶️ Iniciar la aplicación

### Backend

```bash
cd backend
dotnet run
```

La API estará disponible en `https://localhost:7000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

El cliente estará en `http://localhost:5173`.

---

## 🔒 Autenticación y Seguridad

- Al hacer login exitoso, el token se guarda en `localStorage`.
- Las llamadas a la API incluyen el `Authorization: Bearer {token}`.
- El servidor protege rutas usando `[Authorize]`, y opcionalmente `[Authorize(Roles = "0")]`.

---

## 📦 Endpoints Principales

### Usuario
- `POST /api/Usuario/login`
- `GET /api/Usuario/saldo`
- `POST /api/Usuario/canjear`
- `GET /api/Usuario/historial`

### Beneficio
- `GET /api/Beneficio`
- `GET /api/Beneficio/destacados`

---

## 🧪 Datos de prueba

```json
Usuario: cliente@ejemplo.com
Contraseña: 123456
Rol: 0 (Cliente)
```

---

## 🛠 Manual de Uso

1. **Ingreso al sistema:**
   - Navega a la URL principal.
   - Inicia sesión con el usuario de prueba o uno existente.

2. **Dashboard:**
   - Consulta el saldo actual de puntos.
   - Redime puntos libremente o canjea beneficios destacados.

3. **Catálogo:**
   - Explora los beneficios disponibles.
   - Usa el buscador por nombre, descripción o rango de puntos.
   - Haz clic en “Canjear” para obtener un beneficio.

4. **Historial:**
   - Revisa todas tus transacciones en orden cronológico.

---

## 👨‍💻 Autor

Desarrollado por Felix Sanchez Fandiño  
© 2025 — Todos los derechos reservados
