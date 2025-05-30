const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Φορτώνουμε τις μεταβλητές από το .env αρχείο
dotenv.config();

// Δημιουργία express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // για να καταλαβαίνει JSON payloads

// Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api', authRoutes);

const restaurantRoutes = require('./routes/restaurantRoutes');
app.use('/api', restaurantRoutes);

const reservationRoutes = require('./routes/reservationRoutes');
app.use('/api', reservationRoutes);

// Απλό test route
app.get('/', (req, res) => {
  res.send('Server is running 🚀');
});

// Ξεκινάμε τον server — ΜΕΤΑ την προσθήκη των routes
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
