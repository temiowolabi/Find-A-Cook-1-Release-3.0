const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  cook: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cook',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    //required: true,
  },
  timeSlot: {
    type: String,
    //required: true,
  },
  menuItems: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MenuItem',
    },
 ],
  totalPrice: {
    type: Number,
    //required: true,
  },
  additionalInfo: {
    type: String,
  },
  num_people:{
    type: Number,
  }
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
