// Εισαγωγή της συνάρτησης δημιουργίας κράτησης από το μοντέλο
const { createReservation } = require('../models/reservationModel');

// Συνάρτηση για δημιουργία νέας κράτησης
const makeReservation = async (req, res) => {
  // Λήψη των δεδομένων κράτησης
  const { restaurant_id, date, time, people_count } = req.body;
  // Λήψη του ID του χρήστη
  const userId = req.user.userId;

  // Έλεγχος για απαραίτητα πεδία
  if (!restaurant_id || !date || !time || !people_count) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Δημιουργία της κράτησης μέσω της βάσης
    const reservationId = await createReservation(userId, restaurant_id, date, time, people_count);
    // Επιστροφή επιτυχούς απάντησης
    res.status(201).json({ message: 'Reservation created', reservationId });
  } catch (err) {
    // Καταγραφή του σφάλματος και αποστολή κατάστασης σφάλματος
    console.error('Error creating reservation:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Εισαγωγή της συνάρτησης ανάκτησης κρατήσεων χρήστη
const { getReservationsByUser } = require('../models/reservationModel');

// Συνάρτηση για ανάκτηση κρατήσεων του χρήστη
const getUserReservations = async (req, res) => {
  // Λήψη του ID του χρήστη
  const userId = req.user.userId;

  try {
    // Ανάκτηση των κρατήσεων από τη βάση
    const reservations = await getReservationsByUser(userId);
    // Επιστροφή των κρατήσεων στον χρήστη
    res.json(reservations);
  } catch (err) {
    // Καταγραφή σφάλματος και απάντηση κατάστασης σφάλματος
    console.error('Error fetching reservations:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Εισαγωγή συναρτήσεων ενημέρωσης και διαγραφής κράτησης
const { updateReservation, deleteReservation } = require('../models/reservationModel');

// Συνάρτηση για επεξεργασία υπάρχουσας κράτησης
const editReservation = async (req, res) => {
  // Λήψη νέων δεδομένων κράτησης
  const { date, time, people_count } = req.body;
  // Λήψη ID χρήστη και ID κράτησης
  const userId = req.user.userId;
  const reservationId = req.params.id;

  try {
    // Απόπειρα ενημέρωσης της κράτησης
    const success = await updateReservation(reservationId, userId, date, time, people_count);
    if (success) {
      res.json({ message: 'Reservation updated' });
    } else {
      // Αν η ενημέρωση απέτυχε ή δεν επιτρέπεται
      res.status(403).json({ message: 'Update failed or unauthorized' });
    }
  } catch (err) {
    // Καταγραφή σφάλματος και αποστολή κατάστασης σφάλματος
    console.error('Update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Συνάρτηση για διαγραφή κράτησης
const removeReservation = async (req, res) => {
  // Λήψη ID χρήστη και ID κράτησης 
  const userId = req.user.userId;
  const reservationId = req.params.id;

  try {
    // Διαγραφή της κράτησης
    const success = await deleteReservation(reservationId, userId);
    if (success) {
      res.json({ message: 'Reservation deleted' });
    } else {
      // Αν η διαγραφή απέτυχε ή δεν επιτρέπεται
      res.status(403).json({ message: 'Delete failed or unauthorized' });
    }
  } catch (err) {
    // Καταγραφή σφάλματος και αποστολή κατάστασης σφάλματος
    console.error('Delete error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Εξαγωγή όλων των συναρτήσεων για χρήση από άλλα αρχεία
module.exports = {
  makeReservation,
  getUserReservations,
  editReservation,
  removeReservation,
};
