# Pre-entrega 7: Sistema Backend de Turnos y Reservas

API REST para la gestión de **servicios**, **reservas** y **mensajes**, con persistencia en **MongoDB Atlas** mediante **Mongoose**, **vistas server-side con Handlebars** y **comunicación en tiempo real con Socket.io**. Construida con **Node.js** y **Express** usando módulos ES (ESM).

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
    socket.config.js           # Configuración de Socket.io y eventos en tiempo real
  container.js                 # Inyección de dependencias (DAO → repository → service)
  models/
    service.model.js           # Schema de Service
    booking.model.js           # Schema de Booking (services con ObjectId)
    message.model.js           # Schema de Message
  controllers/
    services.controller.js     # Controladores del recurso services
    bookings.controller.js     # Controladores del recurso bookings
    messages.controller.js     # Controladores del recurso messages
    views.controller.js        # Renderiza las vistas (usa los mismos services)
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
    views.router.js            # Rutas de las vistas (/views/services, /views/availability)
  views/
    layouts/main.handlebars    # Layout principal
    services.handlebars        # Vista del listado de servicios
    availability.handlebars    # Vista de disponibilidad / reservas
  public/
    css/styles.css             # Estilos de las vistas
    js/socket.js               # Lógica de cliente de Socket.io
  utils/error.util.js          # Normalización de errores para las respuestas HTTP
  app.js                       # Configuración de Express, Handlebars y estáticos
  server.js                    # Conexión a MongoDB, Socket.io y arranque del servidor
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

## Vistas (Handlebars)

Handlebars está configurado como motor de vistas (`layouts/main.handlebars` como layout). Las vistas
se alimentan de datos reales de MongoDB a través de las mismas capas que la API
(`views.controller → service → repository → DAO → model`), sin datos hardcodeados.

| Método | Ruta                    | Descripción                                                                 |
|--------|-------------------------|-----------------------------------------------------------------------------|
| GET    | `/views/services`       | Listado de servicios (nombre, descripción, duración, precio, categoría y disponibilidad) |
| GET    | `/views/availability`   | Reservas actuales con su estado y cantidad de servicios                     |

## Tiempo real (Socket.io)

Socket.io se configura en `src/config/socket.config.js` y comparte la misma instancia de Express
mediante `http.createServer(app)`.

Acción real del sistema que dispara eventos:

- **Crear un servicio** (`POST /api/services`) → emite `service:created` a todos los clientes.
- **Actualizar un servicio** (`PUT /api/services/:sid`) → emite `service:updated`.
- **Eliminar un servicio** (`DELETE /api/services/:sid`) → emite `service:deleted`.
- **Cambiar disponibilidad** (botón en la vista, `socket.emit('service:toggle-availability')`) → el servidor
  actualiza vía el service y emite `service:updated`.
- **Crear una reserva** (`POST /api/bookings`) → emite `booking:created`.

El archivo `src/public/js/socket.js` escucha esos eventos y actualiza el DOM sin recargar la página.

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
