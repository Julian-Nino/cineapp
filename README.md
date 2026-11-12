# 🎬 CineApp — Frontend de Gestión de Películas y Series

> **Proyecto Integrado II**  
> **Institución Universitaria Digital de Antioquia (IU Digital)**  
> **Autor:** Julian David Niño Cuervo  
> **Año:** 2026  

---

## 📌 Descripción del Proyecto

**CineApp** es una Single Page Application (SPA) desarrollada en **React** y estilizada con **Tailwind CSS v4**, diseñada para administrar el catálogo de contenidos audiovisuales (películas y series) de una plataforma de entretenimiento.

La aplicación permite gestionar el ciclo de vida completo (CRUD: Crear, Consultar, Actualizar y Eliminar) de los contenidos multimedia y de sus entidades maestras relacionadas: **Géneros**, **Directores**, **Productoras**, **Tipos de Contenido** y **Media**.

Cuenta con una arquitectura modular desacoplada mediante una **capa de abstracción de servicios**, permitiendo alternar entre **datos simulados en memoria (Modo Mock)** y una **API REST real en Node.js/Express con MySQL (Modo Live)** sin alterar los componentes visuales.

---

## 🚀 Tecnologías Utilizadas

| Tecnología | Rol en el Proyecto |
| :--- | :--- |
| **React 18+** | Biblioteca base para la construcción de interfaces declarativas basadas en componentes. |
| **Vite** | Entorno de desarrollo y empaquetador ultrarrápido (build time < 200 ms). |
| **Tailwind CSS v4** | Framework utilitario para diseño moderno, tema oscuro estilo streaming y diseño responsivo. |
| **React Router DOM v6** | Enrutamiento del lado del cliente y navegación SPA con layouts anidados. |
| **Axios** | Cliente HTTP con interceptores para consumo de la API REST del backend. |

---

## 📂 Estructura del Código Fuente

```text
cineapp/
├── .env                          # Configuración de variables de entorno (URL y Modo Mock)
├── index.html                    # Plantilla base HTML con favicon personalizado
├── vite.config.js                # Configuración de Vite con plugins de React y Tailwind
└── src/
    ├── App.jsx                   # Componente raíz con ErrorBoundary y ToastProvider
    ├── index.css                 # Importación de Tailwind CSS y animaciones globales
    ├── main.jsx                  # Punto de entrada de la aplicación
    ├── components/
    │   └── common/
    │       ├── ConfirmDialog.jsx # Modal de confirmación para eliminaciones seguras
    │       ├── ErrorBoundary.jsx # Capturador global de errores para evitar pantallas en blanco
    │       ├── Modal.jsx         # Ventana modal genérica para formularios
    │       ├── Spinner.jsx       # Indicador visual de carga
    │       └── ToastProvider.jsx # Sistema de notificaciones flotantes (éxito, error, info)
    ├── hooks/
    │   └── useCrud.js            # Custom Hook que encapsula la lógica CRUD y normalización de IDs
    ├── layouts/
    │   └── MainLayout.jsx        # Estructura fija: Sidebar lateral, Navbar y badge Mock/Live
    ├── modules/
    │   ├── directores/
    │   │   └── DirectoresPage.jsx    # CRUD de Directores con estado Activo/Inactivo
    │   ├── generos/
    │   │   └── GenerosPage.jsx       # CRUD de Géneros cinematográficos
    │   ├── media/
    │   │   └── MediaPage.jsx         # Catálogo visual de Cards, filtros y form relacional
    │   ├── productoras/
    │   │   └── ProductorasPage.jsx   # CRUD de Productoras con slogan y descripción
    │   └── tipos/
    │       └── TiposPage.jsx         # CRUD de Tipos de contenido (Película, Serie, etc.)
    ├── routes/
    │   └── AppRoutes.jsx         # Definición centralizada de rutas de navegación
    ├── services/
    │   ├── api.js                # Instancia de Axios e interceptores HTTP
    │   ├── mockData.js           # Base de datos simulada en memoria para desarrollo autónomo
    │   ├── directorService.js    # Servicio HTTP para Directores
    │   ├── generoService.js      # Servicio HTTP para Géneros
    │   ├── mediaService.js       # Servicio HTTP para Media (Películas/Series)
    │   ├── productoraService.js  # Servicio HTTP para Productoras
    │   └── tipoService.js        # Servicio HTTP para Tipos
    └── utils/
        └── tw.js                 # Constantes de clases Tailwind reutilizables
```

---

## 🧩 Módulos y Funcionalidades

### 1. Catálogo de Media (`/media`)
- **Dashboard Estadístico:** Tarjetas con conteo total de producciones, películas, series, géneros activos y productoras activas.
- **Cuadrícula de Tarjetas (Cards):** Visualización tipo cartelera con póster, badge de tipo (*Película* o *Serie*), año de estreno, director, género y botón directo para reproducir la URL del contenido.
- **Buscador y Filtros en Tiempo Real:** Filtro reactivo por título, serial, tipo de producción y género.
- **Formulario Relacional Estricto:** Modal con validación de los 10 campos requeridos por el backend:
  - `serial`, `titulo`, `sinopsis`, `url`, `portada`, `anio_estreno` (1888 - año actual).
  - Selectores desplegables dinámicos que solo muestran **géneros, directores y productoras en estado "Activo"**.

### 2. Módulos Maestros (`/generos`, `/directores`, `/productoras`, `/tipos`)
- Listado en tablas oscuras responsivas con búsqueda integrada.
- Badges visuales de estado (*Activo* en verde, *Inactivo* en gris).
- Modales para creación y edición inmediata.
- Diálogo de confirmación previo a la eliminación para evitar pérdidas accidentales.

---

## ⚙️ Configuración y Puesta en Marcha

### Prerrequisitos
- **Node.js** (versión 18.0 o superior recomendada).
- **npm** (incluido con Node.js).

### 1. Instalación de Dependencias
Dentro de la carpeta `cineapp`, ejecuta:
```bash
npm install
```

### 2. Variables de Entorno (`.env`)
El proyecto incluye un archivo `.env` en la raíz con la siguiente configuración:

```env
# URL base de la API REST del backend
VITE_API_URL=http://localhost:3000/api

# Interruptor de Modo:
# 'true'  -> Usa datos locales en memoria (no requiere backend encendido)
# 'false' -> Se conecta a la base de datos real a través de Express y MySQL
VITE_USE_MOCK=false
```

### 3. Ejecución en Modo Desarrollo
Inicia el servidor local de desarrollo:
```bash
npm run dev
```
La aplicación estará disponible por defecto en: [http://localhost:5173](http://localhost:5173).

### 4. Compilación para Producción
Para generar los archivos optimizados y minificados para despliegue:
```bash
npm run build
```
Los archivos de producción se crearán en la carpeta `dist/`.

---

## 🔌 Conexión con la API REST Backend

La aplicación está diseñada para conectarse directamente a la API REST desarrollada en **Node.js, Express y MySQL** en el puerto `3000`.

### Matriz de Endpoints Consumidos

| Módulo | Endpoint Backend | Métodos HTTP | Descripción |
| :--- | :--- | :--- | :--- |
| **Géneros** | `/api/generos` | `GET`, `POST`, `PUT /:id`, `DELETE /:id` | Gestión de géneros cinematográficos. |
| **Directores** | `/api/directores` | `GET`, `POST`, `PUT /:id`, `DELETE /:id` | Gestión de directores. |
| **Productoras** | `/api/productoras` | `GET`, `POST`, `PUT /:id`, `DELETE /:id` | Gestión de casas productoras. |
| **Tipos** | `/api/tipos` | `GET`, `POST`, `PUT /:id`, `DELETE /:id` | Gestión de categorías (Película/Serie). |
| **Media** | `/api/media` | `GET`, `POST`, `PUT /:id`, `DELETE /:id` | Catálogo de producciones multimedia. |

### Esquema de Datos para Creación de Media (POST `/api/media`)
```json
{
  "serial": "PEL001",
  "titulo": "Interestelar",
  "sinopsis": "Un grupo de exploradores viaja a través de un agujero de gusano.",
  "url": "https://ejemplo.com/interestelar",
  "portada": "https://ejemplo.com/interestelar.jpg",
  "anio_estreno": 2014,
  "id_genero": 2,
  "id_director": 2,
  "id_productora": 2,
  "id_tipo": 2
}
```

---

## 🛡️ Robustez y Manejo de Errores

- **Error Boundary:** Captura fallos imprevistos en tiempo de ejecución en componentes de React, evitando la pantalla en blanco y ofreciendo una tarjeta de recuperación amigable con botón de recarga.
- **Normalización Inteligente de Claves Primarias:** El hook `useCrud` resuelve automáticamente variantes de IDs (`id`, `id_genero`, `id_director`, `id_productora`, `id_tipo`, `id_media`, `_id`), garantizando que las rutas de actualización y eliminación nunca apunten a `/undefined`.
- **Validaciones Cruzadas:** Notificaciones flotantes (*Toasts*) que informan al usuario sobre campos obligatorios faltantes o errores de integridad referencial devueltos por el backend (por ejemplo, seriales duplicados o dependencias foráneas activas).
