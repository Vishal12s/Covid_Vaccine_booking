const mongoose = require('mongoose');

// Define the schema for the booked centers
const bookedCenterSchema = new mongoose.Schema({
  centerName: {
    type: String,
    required: true
  }
});

// Create the bookedCenter model
const BookedCenter = mongoose.model('BookedCenter', bookedCenterSchema);

module.exports = BookedCenter;
