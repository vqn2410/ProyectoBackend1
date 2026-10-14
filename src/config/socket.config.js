import { Server } from 'socket.io';
import { servicesService } from '../container.js';

let io = null;

export function initSocket(server) {
  io = new Server(server);

  io.on('connection', socket => {
    console.log('Cliente conectado (socket):', socket.id);

    socket.on('disconnect', () => {
      console.log('Cliente desconectado (socket):', socket.id);
    });

    // Acción real del cliente: cambiar la disponibilidad de un servicio
    socket.on('service:toggle-availability', async sid => {
      try {
        const service = await servicesService.getServiceById(sid);
        if (!service) {
          return;
        }

        const updated = await servicesService.updateService(sid, {
          available: !service.available
        });

        broadcast('service:updated', updated);
      } catch (error) {
        console.error('Error al cambiar disponibilidad:', error.message);
      }
    });
  });

  return io;
}

export function broadcast(event, payload) {
  if (io) {
    io.emit(event, payload);
  }
}
