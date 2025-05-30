const express = require('express');
const router = express.Router();
const {
  makeReservation,
  getUserReservations,
  editReservation,
  removeReservation
} = require('../controllers/reservationController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/reservations', verifyToken, makeReservation);
router.get('/user/reservations', verifyToken, getUserReservations);
router.put('/reservations/:id', verifyToken, editReservation);
router.delete('/reservations/:id', verifyToken, removeReservation);

module.exports = router;
