const { createReservation } = require('../models/reservationModel');

const makeReservation = async (req, res) => {
  const { restaurant_id, date, time, people_count } = req.body;
  const userId = req.user.userId; // από το JWT

  if (!restaurant_id || !date || !time || !people_count) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const reservationId = await createReservation(userId, restaurant_id, date, time, people_count);
    res.status(201).json({ message: 'Reservation created', reservationId });
  } catch (err) {
    console.error('Error creating reservation:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const { getReservationsByUser } = require('../models/reservationModel');

const getUserReservations = async (req, res) => {
  const userId = req.user.userId;

  try {
    const reservations = await getReservationsByUser(userId);
    res.json(reservations);
  } catch (err) {
    console.error('Error fetching reservations:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const { updateReservation, deleteReservation } = require('../models/reservationModel');

const editReservation = async (req, res) => {
  const { date, time, people_count } = req.body;
  const userId = req.user.userId;
  const reservationId = req.params.id;

  try {
    const success = await updateReservation(reservationId, userId, date, time, people_count);
    if (success) {
      res.json({ message: 'Reservation updated' });
    } else {
      res.status(403).json({ message: 'Update failed or unauthorized' });
    }
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const removeReservation = async (req, res) => {
  const userId = req.user.userId;
  const reservationId = req.params.id;

  try {
    const success = await deleteReservation(reservationId, userId);
    if (success) {
      res.json({ message: 'Reservation deleted' });
    } else {
      res.status(403).json({ message: 'Delete failed or unauthorized' });
    }
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  makeReservation,
  getUserReservations,
  editReservation,
  removeReservation,
};
