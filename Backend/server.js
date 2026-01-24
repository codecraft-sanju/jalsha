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
const applicationRoutes = require('./routes/applications');

const app = express();

// --- CONFIGURATION ---
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const DB_URI = process.env.MONGO_URI; // ✅ Sirf tumhara wala variable

// --- DEBUG LOGS (Server start hote hi dikhenge) ---
console.log("-----------------------------------------");
console.log("🚀 Server Starting...");
console.log(`🔗 Allowed Frontend: ${FRONTEND_URL}`);
console.log(`🗄️  Database URI (MONGO_URI): ${DB_URI ? "✅ Loaded" : "❌ MISSING"}`);
console.log("-----------------------------------------");

if (!DB_URI) {
    console.error("❌ CRITICAL ERROR: process.env.MONGO_URI is undefined.");
    // Server chalne denge taaki logs dikh sakein, par DB fail hoga
}

// --- 1. HTTP SERVER & SOCKET SETUP ---
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});

// --- 2. MIDDLEWARE ---
app.use(express.json());

// ✅ Express CORS
app.use(cors({
  origin: FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// 🔥 Socket.io ko Controllers tak pahunchana
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Socket Connection Logs
io.on('connection', (socket) => {
  console.log(`⚡ New Socket Client Connected: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log('Client Disconnected');
  });
});

// --- 3. DATABASE CONNECTION ---
mongoose.connect(DB_URI)
  .then(() => console.log('✅ MongoDB Connected to Jalsa Database'))
  .catch(err => {
      console.error('❌ MongoDB Connection Error:', err.message);
  });

// --- 4. ROUTES MAPPING ---
app.use('/api/auth', authRoutes);       
app.use('/api/products', productRoutes); 
app.use('/api/orders', orderRoutes);     
app.use('/api/dealers', dealerRoutes);   
app.use('/api/applications', applicationRoutes);

// --- BASE ROUTE ---
app.get('/', (req, res) => {
  res.send(`Jalsa API is Running... (Frontend: ${FRONTEND_URL})`);
});

// --- 5. SERVER START ---
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));