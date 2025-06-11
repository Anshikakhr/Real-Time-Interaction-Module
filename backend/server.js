const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
require("dotenv").config(); 
const connectDatabase = require("./config/connection");
const {
  register,
  login,
  userDetails,
} = require("./controllers/user.controller");
const authenticate = require("./middlewares/auth");
const Vote = require("./models/vote.model");
const isAdmin = require("./middlewares/adminAuth");
const User = require("./models/user.model");
const pollRoutes = require('./routes/poll.routes');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Configure CORS before other middleware
app.use(cors({
  origin: "http://localhost:3000", // Frontend URL
  credentials: true
}));

app.use(express.json());

// Store io instance in app
app.set('io', io);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected');

  // Join poll room
  socket.on('joinPoll', (sessionCode) => {
    socket.join(sessionCode);
    io.to(sessionCode).emit('userJoined', { message: 'New user joined' });
  });

  // Handle new poll creation
  socket.on('createPoll', (pollData) => {
    const { sessionCode } = pollData;
    socket.join(sessionCode);
    io.emit('pollCreated', pollData);
  });

  // Handle vote submission
  socket.on('submitVote', (voteData) => {
    const { sessionCode, option } = voteData;
    io.to(sessionCode).emit('voteReceived', voteData);
    io.to(sessionCode).emit('updateResults', voteData);
  });

  // Handle poll end
  socket.on('endPoll', (sessionCode) => {
    io.to(sessionCode).emit('pollEnded');
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Routes
app.use('/api/polls', pollRoutes);
app.use('/api/auth', require('./routes/auth.routes'));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
