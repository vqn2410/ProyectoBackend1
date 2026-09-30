# Pre-entrega 6: Sistema Backend de Turnos y Reservas

API REST para la gestión de **servicios**, **reservas** y **mensajes**, con persistencia en **MongoDB Atlas** mediante **Mongoose**. Construida con **Node.js** y **Express** usando módulos ES (ESM).

**Curso:** Programacion Backend I: Desarrollo Avanzado de Backend

**Comision:** #95150

**Estudiante:** Nicolas Vergara

## Requisitos

- Node.js >= 18
- npm
- Una base de datos en MongoDB Atlas (o local)

## Instalación

```bash
npm install
cp .env.example .env
```

Completar `MONGO_URI` en `.env` con la cadena de conexión de MongoDB Atlas:

```env
PORT=3000
NODE_ENV=development
MONGO_URI=mongodb+srv://usuario:password@cluster.mongodb.net/turnos?retryWrites=true&w=majority
```

## Ejecución

```bash
npm start
# o en modo desarrollo
npm run dev
```

El servidor se conecta a MongoDB y luego escucha en el puerto definido en `.env` (por defecto `3000`).

## Estructura

```
src/
  config/
    env.config.js              # Variables de entorno (PORT, MONGO_URI)
    db.config.js               # Conexión a MongoDB con Mongoose
  models/
    service.model.js           # Schema de Service
    booking.model.js           # Schema de Booking (services con ObjectId)
    message.model.js           # Schema de Message
  controllers/
    services.controller.js     # Controladores del recurso services
    bookings.controller.js     # Controladores del recurso bookings
    messages.controller.js     # Controladores del recurso messages
  services/
    services.service.js        # Reglas de negocio de services
    bookings.service.js        # Reglas de negocio de bookings
    messages.service.js        # Reglas de negocio de messages
  repositories/
    services.repository.js     # Acceso abstracto a services
    bookings.repository.js     # Acceso abstracto a bookings
    messages.repository.js     # Acceso abstracto a messages
  dao/
    services.dao.js            # Acceso a la colección de services con Mongoose
    bookings.dao.js            # Acceso a la colección de bookings con Mongoose
    messages.dao.js            # Acceso a la colección de messages con Mongoose
  routes/
    services.router.js         # Rutas del recurso services
    bookings.router.js         # Rutas del recurso bookings
    messages.router.js         # Rutas del recurso messages
  utils/error.util.js          # Normalización de errores para las respuestas HTTP
  app.js                       # Configuración de Express
  server.js                    # Conexión a MongoDB y arranque del servidor
```

## Arquitectura en capas

Las solicitudes siguen el flujo:

```text
Router → Controller → Service → Repository → DAO → MongoDB (Mongoose)
```

- **Router:** define las URLs y conecta cada endpoint con su controller.
- **Controller:** lee `req`, llama al service y responde con `res`.
- **Service:** contiene las validaciones y reglas de negocio, como incrementar `quantity` al repetir un servicio en una reserva.
- **Repository:** expone operaciones de acceso a datos sin reglas de negocio.
- **DAO:** es la única capa que interactúa con Mongoose y las colecciones de MongoDB.

En `booking`, los servicios se referencian con `ObjectId`:

```js
services: [{ service: ObjectId, quantity: Number }]
```

## Recurso services

Cada servicio tiene: `id` (autogenerado por MongoDB), `name`, `description`, `duration`, `price`, `category`, `available`.

### Endpoints de services

| Método | Ruta                    | Descripción                                                        |
|--------|-------------------------|--------------------------------------------------------------------|
| GET    | `/api/services`         | Devuelve todos los servicios. Filtros: `?category=`, `?available=` |
| GET    | `/api/services/:sid`    | Devuelve un servicio por id (200 si existe, 404 si no)             |
| POST   | `/api/services`         | Crea un servicio (201 si se crea, 400 si faltan campos). El id se genera internamente |
| PUT    | `/api/services/:sid`    | Actualiza un servicio (200 si existe, 404 si no). No permite modificar el id |
| DELETE | `/api/services/:sid`    | Elimina un servicio (200 si existe, 404 si no)                     |

## Recurso bookings

Cada reserva tiene: `id` (autogenerado por MongoDB), `clientName`, `clientEmail`, `date`, `time`, `status`, `services: []`. Dentro del array los servicios se guardan como `{ service: ObjectId, quantity: 1 }`; si el mismo servicio se agrega dos veces, se incrementa `quantity`.

### Endpoints de bookings

| Método | Ruta                               | Descripción                                                                   |
|--------|------------------------------------|-------------------------------------------------------------------------------|
| POST   | `/api/bookings`                    | Crea una reserva (201 si se crea, 400 si faltan campos). Puede iniciar con `services` vacío |
| GET    | `/api/bookings/:bid`               | Devuelve una reserva por id (200 si existe, 404 si no)                         |
| POST   | `/api/bookings/:bid/services/:sid` | Agrega un servicio a una reserva existente (200). Valida que ambos existan (404) |

## Recurso messages

Cada mensaje tiene: `id` (autogenerado por MongoDB), `user`, `message`, `createdAt`.

### Endpoints de messages

| Método | Ruta                    | Descripción                                              |
|--------|-------------------------|----------------------------------------------------------|
| GET    | `/api/messages`         | Devuelve todos los mensajes                              |
| GET    | `/api/messages/:mid`    | Devuelve un mensaje por id (200 si existe, 404 si no)    |
| POST   | `/api/messages`         | Crea un mensaje (201 si se crea, 400 si faltan campos)   |

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
