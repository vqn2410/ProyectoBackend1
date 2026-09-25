# Pre-entrega 4: Sistema Backend de Turnos y Reservas

API REST para la gestión de **servicios** y **reservas**, con persistencia en archivos JSON (FileSystem). Construida con **Node.js** y **Express** usando módulos ES (ESM).

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

Los datos se persisten en `src/data/services.json` y `src/data/bookings.json`, por lo que **no se pierden al reiniciar el servidor**.

## Estructura

```
src/
  config/env.config.js       # Configuración de variables de entorno
  controllers/
    services.controller.js    # Controladores del recurso services
    bookings.controller.js    # Controladores del recurso bookings
  services/
    services.service.js       # Reglas de negocio de services
    bookings.service.js       # Reglas de negocio de bookings
  repositories/
    services.repository.js    # Acceso abstracto a services
    bookings.repository.js    # Acceso abstracto a bookings
  dao/
    services.dao.js            # Lectura/escritura de services.json
    bookings.dao.js            # Lectura/escritura de bookings.json
  routes/services.router.js   # Rutas del recurso services
  routes/bookings.router.js   # Rutas del recurso bookings
  data/                       # Archivos JSON de persistencia
  app.js                      # Configuración de Express
  server.js                   # Punto de entrada del servidor
```

## Arquitectura en capas

Las solicitudes siguen el flujo:

```text
Router → Controller → Service → Repository → DAO → archivo JSON
```

- **Router:** define las URLs y conecta cada endpoint con su controller.
- **Controller:** lee `req`, llama al service y responde con `res`.
- **Service:** contiene las validaciones y reglas de negocio, como incrementar `quantity` al repetir un servicio en una reserva.
- **Repository:** expone operaciones de acceso a datos sin reglas de negocio.
- **DAO:** lee y escribe directamente los archivos JSON.

## Recurso services

Cada servicio tiene: `id` (autogenerado), `name`, `description`, `duration`, `price`, `category`, `available`.

### Endpoints de services

| Método | Ruta                    | Descripción                                                        |
|--------|-------------------------|--------------------------------------------------------------------|
| GET    | `/api/services`         | Devuelve todos los servicios. Filtros: `?category=`, `?available=` |
| GET    | `/api/services/:sid`    | Devuelve un servicio por id (200 si existe, 404 si no)             |
| POST   | `/api/services`         | Crea un servicio (201 si se crea, 400 si faltan campos). El id se genera internamente |
| PUT    | `/api/services/:sid`    | Actualiza un servicio (200 si existe, 404 si no). No permite modificar el id |
| DELETE | `/api/services/:sid`    | Elimina un servicio (200 si existe, 404 si no)                     |

## Recurso bookings

Cada reserva tiene: `id` (autogenerado), `clientName`, `clientEmail`, `date`, `time`, `status`, `services: []`. Dentro del array los servicios se guardan como `{ service: idDelServicio, quantity: 1 }`; si el mismo servicio se agrega dos veces, se incrementa `quantity`.

### Endpoints de bookings

| Método | Ruta                               | Descripción                                                                   |
|--------|------------------------------------|-------------------------------------------------------------------------------|
| POST   | `/api/bookings`                    | Crea una reserva (201 si se crea, 400 si faltan campos). Puede iniciar con `services` vacío |
| GET    | `/api/bookings/:bid`               | Devuelve una reserva por id (200 si existe, 404 si no)                         |
| POST   | `/api/bookings/:bid/services/:sid` | Agrega un servicio a una reserva existente (200). Valida que ambos existan (404) |

## Ejemplos de uso

### Crear un servicio

```bash
curl -X POST http://localhost:3000/api/services \
  -H "Content-Type: application/json" \
  -d '{"name":"Consulta General","description":"Consulta médica","duration":30,"price":5000,"category":"salud","available":true}'
```

### Crear una reserva

```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{"clientName":"Ana Pérez","clientEmail":"ana@mail.com","date":"2026-09-10","time":"10:30"}'
```

### Agregar un servicio a una reserva

```bash
curl -X POST http://localhost:3000/api/bookings/:bid/services/:sid
```
