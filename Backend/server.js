require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http'); // Socket.io ke liye zaroori
const { Server } = require('socket.io'); // Socket.io Server

// Import Routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const dealerRoutes = require('./routes/dealerRoutes');

const app = express();

const FRONTEND_URL = process.env.FRONTEND_URL;

// --- 1. HTTP SERVER & SOCKET SETUP ---
const server = http.createServer(app); // App ko wrap kiya
const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL, // Socket ab specific frontend ko allow karega
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// --- 2. MIDDLEWARE ---
app.use(express.json());

// ✅ Express CORS bhi update kiya
app.use(cors({
  origin: FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// 🔥 IMPORTANT: Make 'io' accessible in all Controllers
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Socket Connection Logs (Optional - Testing ke liye)
io.on('connection', (socket) => {
  console.log(`⚡ New Client Connected: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log('Client Disconnected');
  });
});

// --- 3. DATABASE CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected to Jalsa Database'))
  .catch(err => console.log('❌ DB Connection Error:', err));

// --- 4. ROUTES MAPPING ---
app.use('/api/auth', authRoutes);       
app.use('/api/products', productRoutes); 
app.use('/api/orders', orderRoutes);     
app.use('/api/dealers', dealerRoutes);   
app.use('/api/applications', require('./routes/applications'));

// --- BASE ROUTE ---
app.get('/', (req, res) => {
  res.send('Jalsa API with Socket.io is Running...');
});

// --- 5. SERVER START (server.listen use karna hai, app.listen nahi) ---
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server (Socket+Express) running on port ${PORT}`));