import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import { config } from '../config';

let io: Server;

export const initSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: '*', // In production, replace with specific origins
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('📱 Socket connected:', socket.id);

    // Join a room for city-specific updates
    socket.on('join-city', (city: string) => {
      socket.join(city);
      console.log(`📍 Socket ${socket.id} joined city: ${city}`);
    });

    socket.on('disconnect', () => {
      console.log('❌ Socket disconnected:', socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

// Helper to broadcast global health updates
export const broadcastHealth = (data: any) => {
  if (io) {
    io.emit('health-update', data);
  }
};
