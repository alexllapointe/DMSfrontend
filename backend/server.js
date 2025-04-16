const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Import routes
const employeeRoutes = require('./routes/employeeRoutes');

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3002",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/delivery-management', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Message Schema
const messageSchema = new mongoose.Schema({
  senderId: String,
  receiverId: String,
  content: String,
  timestamp: Date,
  senderType: String
});

const Message = mongoose.model('Message', messageSchema);

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-chat', ({ managerId, driverId }) => {
    const roomId = `chat_${managerId}_${driverId}`;
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });

  socket.on('send-message', async (messageData) => {
    try {
      // Save message to database
      const message = new Message({
        ...messageData,
        timestamp: new Date(messageData.timestamp)
      });
      await message.save();

      // Emit message to the specific chat room
      const roomId = `chat_${messageData.senderId}_${messageData.receiverId}`;
      io.to(roomId).emit('receive-message', messageData);
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  socket.on('leave-chat', ({ managerId, driverId }) => {
    const roomId = `chat_${managerId}_${driverId}`;
    socket.leave(roomId);
    console.log(`User left room: ${roomId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// API Routes
app.get('/api/chat/history/:managerId/:driverId', async (req, res) => {
  try {
    const { managerId, driverId } = req.params;
    const messages = await Message.find({
      $or: [
        { senderId: managerId, receiverId: driverId },
        { senderId: driverId, receiverId: managerId }
      ]
    }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
});

app.post('/api/chat/message', async (req, res) => {
  try {
    const message = new Message({
      ...req.body,
      timestamp: new Date(req.body.timestamp)
    });
    await message.save();
    res.status(201).json(message);
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ error: 'Failed to save message' });
  }
});

// Routes
app.use('/api/employees', employeeRoutes);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../build', 'index.html'));
  });
}

// Start server
server.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
}); 