import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import { config } from '../config';

let io: Server;

export const initSocket = (server: HttpServer) => {
  // Build allowed origins from env (comma-separated) or allow all in dev
  const allowedOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map(o => o.trim())
    : '*';

  io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      methods: ['GET', 'POST']
    },
    // Render's free tier proxy needs polling fallback before upgrading to ws
    transports: ['websocket', 'polling'],
    allowEIO3: true,
  });


  io.on('connection', (socket) => {
    console.log('📱 Socket connected:', socket.id);

    // Identify and join role-based rooms
    socket.on('join-room', (payload: any) => {
      let role = typeof payload === 'string' ? payload : payload.role;
      let token = typeof payload === 'string' ? null : payload.token;

      // Granular authentication check
      if (['INSURER', 'ADMIN'].includes(role)) {
        if (!token) {
          console.warn(`⚠️ Socket ${socket.id} access denied to room: ${role} (Missing Auth Token)`);
          socket.emit('auth-error', { message: 'Unauthorized access to restricted room' });
          return;
        }

        // TODO: In production, verify JWT token and extract user role
        // For development/demo, we allow if a token string is present, indicating authentication
        if (token.length < 10) {
          console.warn(`⚠️ Socket ${socket.id} access denied to room: ${role} (Invalid Token)`);
          socket.emit('auth-error', { message: 'Invalid authentication token' });
          return;
        }
      }

      socket.join(role);
      console.log(`👤 Socket ${socket.id} joined securely room: ${role}`);
    });

    // Handle cross-app communications
    // ... rest of the events untouched ...
    // 1. Claim Submission (User -> Insurer/Admin)
    socket.on('submit-claim', (claimData: any) => {
      console.log('📝 Claim submitted:', claimData.id);
      io.to('INSURER').to('ADMIN').emit('new-claim', claimData);
    });

    // 2. Claim Status Update (Insurer -> User/Admin)
    socket.on('update-claim-status', (updateData: any) => {
      console.log('⚡ Claim status update:', updateData.id, updateData.status);
      io.to('USER').to(`user-${updateData.userId}`).to('ADMIN').emit('claim-update', updateData);
    });

    // 3. Global Announcement (Admin -> All)
    socket.on('send-announcement', (announcement: any) => {
      console.log('📢 Admin announcement:', announcement.title);
      io.emit('announcement', announcement);
    });

    // 4. Trigger Alert (System -> All)
    socket.on('system-trigger', (triggerData: any) => {
      io.emit('trigger-alert', triggerData);
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

// Global broadcast helpers
export const broadcastTrigger = (trigger: any) => {
  if (io) io.emit('trigger-alert', trigger);
};

export const broadcastClaim = (claim: any) => {
  if (io) io.to('INSURER').to('ADMIN').emit('new-claim', claim);
};

// Helper to broadcast global health updates
export const broadcastHealth = (data: any) => {
  if (io) {
    io.emit('health-update', data);
  }
};
