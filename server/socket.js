const socketIO = require('socket.io');

function initializeSocket(server) {
  const io = socketIO(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('joinRoom', ({ roomId, driverId, managerId }) => {
      // Join both the specific room and a general manager room
      socket.join(roomId);
      socket.join('manager_room');
      console.log(`User joined rooms: ${roomId}, manager_room`);
    });

    socket.on('sendMessage', (messageData) => {
      const { roomId } = messageData;
      
      // Emit to specific room
      io.to(roomId).emit('receiveMessage', messageData);
      
      // If message is from driver, also emit to manager room
      if (messageData.senderId.startsWith('driver_')) {
        io.to('manager_room').emit('receiveMessage', messageData);
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  return io;
}

module.exports = initializeSocket; 