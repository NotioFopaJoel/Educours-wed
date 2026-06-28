const { Server } = require('socket.io');
const { verifyAccessToken } = require('../utils/generateToken');

let io = null;

const initializeSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.query.token;
      if (!token) {
        return next(new Error('Authentication required'));
      }
      const decoded = verifyAccessToken(token);
      socket.userId = decoded.id;
      socket.userRole = decoded.role;
      next();
    } catch (error) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.userId} (${socket.userRole})`);

    socket.join(`user:${socket.userId}`);

    if (socket.userRole === 'admin') {
      socket.join('admin');
    }

    socket.on('join-conversation', (conversationId) => {
      socket.join(`conversation:${conversationId}`);
    });

    socket.on('leave-conversation', (conversationId) => {
      socket.leave(`conversation:${conversationId}`);
    });

    socket.on('typing', ({ conversationId, userId }) => {
      socket.to(`conversation:${conversationId}`).emit('user-typing', { userId });
    });

    socket.on('stop-typing', ({ conversationId, userId }) => {
      socket.to(`conversation:${conversationId}`).emit('user-stop-typing', { userId });
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.userId}`);
    });
  });

  return io;
};

const getIO = () => io;

module.exports = { initializeSocket, getIO };
