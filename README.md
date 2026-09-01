# Pre-entrega 2: Sistema Backend de Turnos y Reservas

API REST para la gestión del recurso `services`. Construida con **Node.js** y **Express** usando módulos ES (ESM).

**Curso:** Programacion Backend I: Desarrollo Avanzado de Backend

**Comision:** #95150

**Estudiante:** Nicolas Vergara

## Requisitos

- Node.js >= 18
- npm

## Instalación

```bash
npm install
cp .env.example .env
```

## Ejecución

```bash
npm start
# o en modo desarrollo
npm run dev
```

El servidor corre en el puerto definido en `.env` (por defecto `3000`).

## Estructura

```
src/
  config/env.config.js      # Configuración de variables de entorno
  managers/ServiceManager.js # Lógica de negocios del recurso services
  routes/services.router.js  # Definición de rutas REST
  app.js                     # Configuración de Express
  server.js                  # Punto de entrada del servidor
```

## Endpoints

| Método | Ruta                | Descripción                                                             |
|--------|---------------------|-------------------------------------------------------------------------|
| GET    | `/api/services`     | Obtiene todos los servicios. Filtros: `?category=salud`, `?available=true` |
| GET    | `/api/services/:sid`| Obtiene un servicio por id (200 si existe, 404 si no)                    |
| POST   | `/api/services`     | Crea un servicio (201 si se crea, 400 si faltan campos)                  |
| PUT    | `/api/services/:sid`| Actualiza un servicio (200 si existe, 404 si no). No permite cambiar el id |
| DELETE | `/api/services/:sid`| Elimina un servicio (200 si existe, 404 si no)                           |

## Ejemplos de uso

### Crear un servicio

```bash
curl -X POST http://localhost:3000/api/services \
  -H "Content-Type: application/json" \
  -d '{"name":"Consulta General","description":"Consulta médica","category":"salud","price":5000}'
```

### Listar servicios con filtro

```bash
curl "http://localhost:3000/api/services?category=salud&available=true"
```

### Obtener un servicio por id

```bash
curl http://localhost:3000/api/services/:sid
```

### Actualizar un servicio

```bash
curl -X PUT http://localhost:3000/api/services/:sid \
  -H "Content-Type: application/json" \
  -d '{"price":6000}'
```

### Eliminar un servicio

```bash
curl -X DELETE http://localhost:3000/api/services/:sid
```
