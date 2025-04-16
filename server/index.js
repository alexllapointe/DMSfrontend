const express = require('express');
const http = require('http');
const cors = require('cors');
const initializeSocket = require('./socket');
const messageRoutes = require('./routes/messages');
const sequelize = require('./config/database');

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = initializeSocket(server);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/messages', messageRoutes);

// Sync database
const syncDatabase = async () => {
  try {
    await sequelize.sync();
    console.log('Database synced successfully');
  } catch (error) {
    console.error('Error syncing database:', error);
  }
};

syncDatabase();

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 