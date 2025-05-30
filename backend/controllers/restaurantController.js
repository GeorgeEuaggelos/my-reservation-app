const { getAllRestaurants } = require('../models/restaurantModel');

const getRestaurants = async (req, res) => {
  try {
    const restaurants = await getAllRestaurants();
    res.json(restaurants);
  } catch (err) {
    console.error('Error fetching restaurants:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getRestaurants,
};
