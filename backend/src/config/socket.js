const { Server } = require('socket.io');
const { verifyToken } = require('../utils/jwt');
const { CLIENT_URL } = require('./env');

let io;

function initSocket(httpServer) {
  io = new Server(httpServer, { cors: { origin: CLIENT_URL, credentials: true } });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      const payload = verifyToken(token);
      socket.userId = payload.sub;
      next();
    } catch {
      next(new Error('unauthorized'));
    }
  });

  io.on('connection', (socket) => {
    socket.join(`user:${socket.userId}`);
    console.log(`🔌 Socket connected: ${socket.userId}`);
    socket.on('disconnect', () => console.log(`🔌 Disconnected: ${socket.userId}`));
  });

  return io;
}

function emitToUser(userId, event, data) {
  if (io) io.to(`user:${userId}`).emit(event, data);
}

module.exports = { initSocket, emitToUser };