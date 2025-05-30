const db = require('../config/db');

const createReservation = async (userId, restaurantId, date, time, peopleCount) => {
  const [result] = await db.query(
    'INSERT INTO reservations (user_id, restaurant_id, date, time, people_count) VALUES (?, ?, ?, ?, ?)',
    [userId, restaurantId, date, time, peopleCount]
  );
  return result.insertId;
};

const getReservationsByUser = async (userId) => {
  const [rows] = await db.query(
    `SELECT r.reservation_id, r.date, r.time, r.people_count,
            res.name AS restaurant_name, res.location
     FROM reservations r
     JOIN restaurants res ON r.restaurant_id = res.restaurant_id
     WHERE r.user_id = ?
     ORDER BY r.date DESC, r.time DESC`,
    [userId]
  );
  return rows;
};

const updateReservation = async (reservationId, userId, date, time, peopleCount) => {
  const [result] = await db.query(
    `UPDATE reservations
     SET date = ?, time = ?, people_count = ?
     WHERE reservation_id = ? AND user_id = ?`,
    [date, time, peopleCount, reservationId, userId]
  );
  return result.affectedRows > 0;
};

const deleteReservation = async (reservationId, userId) => {
  const [result] = await db.query(
    `DELETE FROM reservations WHERE reservation_id = ? AND user_id = ?`,
    [reservationId, userId]
  );
  return result.affectedRows > 0;
};

module.exports = {
  createReservation,
  getReservationsByUser,
  updateReservation,
  deleteReservation,
};
