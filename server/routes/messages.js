const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const Message = require('../models/Message');

// Get chat history for a specific driver
router.get('/:driverId', async (req, res) => {
  try {
    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId: req.params.driverId },
          { receiverId: req.params.driverId }
        ]
      },
      order: [['timestamp', 'ASC']]
    });
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Store a new message
router.post('/', async (req, res) => {
  try {
    const { senderId, receiverId, message, timestamp, roomId, orderDetails } = req.body;
    
    const newMessage = await Message.create({
      senderId,
      receiverId,
      message,
      timestamp,
      roomId,
      orderDetails
    });

    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ error: 'Failed to save message' });
  }
});

module.exports = router; 