# Pre-entrega 1: Administrador de Servicios

Proyecto Node.js con ES Modules para administrar los servicios de un sistema de turnos y reservas.

**Curso:** Programacion Backend I: Desarrollo Avanzado de Backend

**Comision:** #95150

**Estudiante:** Nicolas Vergara

## Tecnologias

- Node.js
- ES Modules (`import` / `export`)
- dotenv

## Instalacion

```bash
npm install
```

## Configuracion

Copiar `.env.example` como `.env` y completar las variables requeridas:

```env
PORT=8080
NODE_ENV=development
```

`.env` contiene configuracion local y esta excluido de Git. `.env.example` documenta las variables necesarias sin incluir valores sensibles.

## Ejecucion

```bash
npm start
```

Para desarrollo con reinicio automatico:

```bash
npm run dev
```

## Recurso services

Cada servicio tiene esta forma:

```js
{
  id: 1,
  name: 'Consulta general',
  description: 'Atencion inicial',
  duration: 30,
  price: 12000,
  category: 'salud',
  available: true,
}
```

El `id` se genera internamente al crear el servicio y no puede modificarse durante una actualizacion.

## Uso de ServiceManager

```js
import ServiceManager from './src/managers/ServiceManager.js';

const manager = new ServiceManager();

const service = manager.addService({
  name: 'Consulta general',
  description: 'Atencion inicial',
  duration: 30,
  price: 12000,
  category: 'salud',
  available: true,
});

manager.getServices();
manager.getServiceById(service.id);
manager.updateService(service.id, { price: 14000, available: false });
manager.deleteService(service.id);
```

`addService` rechaza datos incompletos. `getServiceById`, `updateService` y `deleteService` retornan `null` cuando el servicio no existe.
