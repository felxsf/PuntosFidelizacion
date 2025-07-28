# Puntos de Fidelización - Frontend

Sistema de gestión de puntos de fidelización desarrollado en React con navegación mejorada y autenticación robusta.

## 🚀 Características

- **Autenticación segura** con JWT tokens
- **Navegación mejorada** con rutas protegidas
- **Interfaz responsiva** con Bootstrap 5
- **Gestión de roles** (Usuario y Administrador)
- **Dashboard interactivo** con estadísticas en tiempo real
- **Catálogo de beneficios** con filtros y paginación
- **Panel de administración** para gestión de usuarios
- **Notificaciones** con react-toastify

## 🛠️ Tecnologías Utilizadas

- **React 19** - Framework de JavaScript
- **React Router DOM 7** - Navegación y enrutamiento
- **Bootstrap 5** - Framework CSS
- **Axios** - Cliente HTTP
- **React Toastify** - Notificaciones
- **Vite** - Build tool

## 📁 Estructura del Proyecto

```
src/
├── api/                 # Servicios de API
├── components/          # Componentes reutilizables
│   ├── LoadingSpinner.jsx
│   ├── Navbar.jsx
│   ├── PrivateRoute.jsx
│   └── PublicRoute.jsx
├── context/            # Contexto de autenticación
│   └── AuthContext.jsx
├── pages/              # Páginas de la aplicación
│   ├── AdminPanel.jsx
│   ├── Catalogo.jsx
│   ├── Dashboard.jsx
│   ├── Login.jsx
│   ├── NotFound.jsx
│   └── Register.jsx
├── App.jsx             # Componente principal
├── main.jsx           # Punto de entrada
└── index.css          # Estilos globales
```

## 🔧 Instalación y Configuración

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd puntos-frontend
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   ```

4. **Construir para producción**
   ```bash
   npm run build
   ```

## 🔐 Sistema de Autenticación

### Roles de Usuario
- **Rol 0**: Usuario regular (acceso a Dashboard y Catálogo)
- **Rol 1**: Administrador (acceso completo incluyendo Panel de Admin)

### Rutas Protegidas
- `/dashboard` - Solo usuarios autenticados (rol 0)
- `/catalogo` - Solo usuarios autenticados (rol 0)
- `/admin` - Solo administradores (rol 1)

### Rutas Públicas
- `/` - Página de login
- `/register` - Página de registro

## 🎨 Mejoras Implementadas

### 1. Navegación Mejorada
- ✅ Eliminación de rutas duplicadas en `App.jsx`
- ✅ Implementación de dropdown funcional sin dependencias externas
- ✅ Manejo de clics fuera del dropdown para cerrarlo
- ✅ Navegación responsiva en dispositivos móviles

### 2. Sistema de Autenticación Robusto
- ✅ Validación de token al cargar la aplicación
- ✅ Manejo de errores en el parseo de datos de usuario
- ✅ Limpieza completa del localStorage al cerrar sesión
- ✅ Estados de loading durante la verificación de autenticación

### 3. Componentes de Ruta Mejorados
- ✅ `PrivateRoute` con validación de roles y redirección inteligente
- ✅ `PublicRoute` con redirección automática según el rol del usuario
- ✅ Componente `LoadingSpinner` reutilizable
- ✅ Manejo de estados de carga

### 4. Interfaz de Usuario
- ✅ Estilos CSS personalizados para mejor experiencia visual
- ✅ Animaciones suaves para transiciones
- ✅ Diseño responsivo para todos los dispositivos
- ✅ Iconos SVG de Bootstrap para mejor consistencia visual

### 5. Correcciones de Errores
- ✅ Importación faltante de `Link` en `Catalogo.jsx`
- ✅ Manejo correcto del cierre de sesión
- ✅ Eliminación de dependencias innecesarias de Bootstrap JS

## 🔄 Flujo de Navegación

1. **Usuario no autenticado** → Redirigido a `/` (Login)
2. **Login exitoso** → Redirigido según rol:
   - Rol 0 → `/dashboard`
   - Rol 1 → `/admin`
3. **Acceso a rutas protegidas** → Validación automática de permisos
4. **Cierre de sesión** → Limpieza completa y redirección a login

## 📱 Responsive Design

La aplicación está completamente optimizada para:
- 📱 Dispositivos móviles
- 💻 Tablets
- 🖥️ Escritorio

## 🚨 Solución de Problemas

### Problema: Dropdown no funciona
**Solución**: El dropdown ahora funciona sin dependencias de Bootstrap JS, usando estado local de React.

### Problema: No se puede cerrar sesión
**Solución**: Implementado manejo completo del logout con limpieza de localStorage y redirección.

### Problema: Páginas no cargan correctamente
**Solución**: Corregidas las rutas duplicadas y mejorado el sistema de enrutamiento.

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Para soporte técnico o preguntas sobre el proyecto, contacta al equipo de desarrollo. 