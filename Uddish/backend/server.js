const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const moderationRoutes = require('./routes/moderation');
const reportRoutes = require('./routes/reports');
const aiRoutes = require('./routes/ai');
const { verifyToken } = require('./middleware/auth');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', verifyToken, postRoutes);
app.use('/api/moderation', verifyToken, moderationRoutes);
app.use('/api/reports', verifyToken, reportRoutes);
app.use('/api/ai', verifyToken, aiRoutes);

// Socket.IO
io.on('connection', (socket) => {
  console.log('New client connected');

  // Join room for user
  socket.on('join', (userId) => {
    socket.join(`user_${userId}`);
  });

  // Handle post creation and broadcast
  socket.on('newPost', (post) => {
    io.emit('postAdded', post);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
