const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Tenant',
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
  },
  serviceIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
  }],
  availability: {
    type: mongoose.Schema.Types.Mixed, // Could be an object defining working hours, days off, etc.
  },
  employeeType: {
    type: String, // e.g., 'full-time', 'part-time', 'contractor'
  },
  specializations: [{
    type: String,
  }],
  profilePicture: {
    type: String, // URL for profile picture
  },
  bio: {
    type: String,
  },
  address: {
    type: String,
  },
  commissionRate: {
    type: Number, // Commission rate, if applicable
  },
  breakTimes: {
    type: mongoose.Schema.Types.Mixed, // To manage employee breaks
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
