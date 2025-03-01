const mongoose = require('mongoose');

const businessHoursSchema = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Tenant',
  },
  dayOfWeek: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true,
  },
  startTime: {
    type: String, // e.g., "09:00"
  },
  endTime: {
    type: String, // e.g., "17:00"
  },
  isClosed: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  timeZone: {
    type: String, // Time zone for these business hours
  },
  exceptions: {
    type: mongoose.Schema.Types.Mixed, // To handle exceptions like holidays
  },
  employeeSpecific: {
    type: Boolean,
    default: false, // If true, these hours apply to a specific employee
  },
});

const BusinessHours = mongoose.model('BusinessHours', businessHoursSchema);

module.exports = BusinessHours;
