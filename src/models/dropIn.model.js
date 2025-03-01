const mongoose = require('mongoose');

const dropInSchema = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Tenant',
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Service',
  },
  customerName: {
    type: String,
    required: true,
  },
  customerPhone: {
    type: String,
  },
  status: {
    type: String,
    enum: ['waiting', 'in-service', 'completed', 'cancelled'],
    default: 'waiting',
  },
  estimatedWaitTime: {
    type: Number, // Estimated wait time in minutes
  },
  startTime: {
    type: Date,
  },
  endTime: {
    type: Date,
  },
  notes: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Optional, in case drop-in customer becomes a user
  },
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee', // Optional, to assign employee to drop-in
  },
  queuePosition: {
    type: Number, // Position in the drop-in queue
  },
  notificationSent: {
    type: Boolean,
    default: false,
  },
});

const DropIn = mongoose.model('DropIn', dropInSchema);

module.exports = DropIn;
