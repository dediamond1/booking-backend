const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Tenant',
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Service',
  },
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee', // Optional, as some bookings might not be employee-specific
  },
  bookingTime: {
    type: Date,
    required: true,
  },
  duration: {
    type: Number, // Duration in minutes, could be derived from service or specified directly
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled', 'rescheduled'],
    default: 'pending',
  },
  price: {
    type: Number,
  },
  notes: {
    type: String,
  },
  bookingSource: {
    type: String, // e.g., 'web', 'app', 'admin', 'drop-in'
  },
  customerTimezone: {
    type: String,
  },
  discountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Discount',
  },
  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment',
  },
  cancellationReason: {
    type: String,
  },
  rescheduleHistory: [{
    type: Date,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
