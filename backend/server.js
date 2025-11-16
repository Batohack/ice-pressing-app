const express = require('express');
const cors = require('cors');
const { db, init } = require('./db');

const app = express();
const PORT = 5000;

// Built-in body parser (no need for body-parser package)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes
const authRoutes = require('./routes/auth');
const customerRoutes = require('./routes/customers');
const orderRoutes = require('./routes/orders');
const inventoryRoutes = require('./routes/inventory');
const paymentRoutes = require('./routes/payments');
const reportRoutes = require('./routes/reports');
const authMiddleware = require('./middleware/auth');

// Public
app.use('/api/auth', authRoutes);

// Protected
app.use('/api/customers', authMiddleware, customerRoutes);
app.use('/api/orders', authMiddleware, orderRoutes);
app.use('/api/inventory', authMiddleware, inventoryRoutes);
app.use('/api/payments', authMiddleware, paymentRoutes);
app.use('/api/reports', authMiddleware, reportRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Ice Pressing API is running!' });
});

// Start
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
  init(); // Initialize DB
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Shutting down...');
  server.close(() => db.close());
});
