const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Tenant',
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  duration: {
    type: Number, // Duration in minutes
    required: true,
  },
  category: {
    type: String,
  },
  images: [{
    type: String, // URLs of service images
  }],
  availability: {
    type: mongoose.Schema.Types.Mixed, // Flexible availability definition
  },
  unit: {
    type: String, // Price unit, e.g., USD, EUR
  },
  SKU: {
    type: String, // Stock Keeping Unit
  },
  serviceCode: {
    type: String, // Alternative service code
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  variants: [{
    name: { type: String }, // Variant name, e.g., "Men's", "Women's"
    price: { type: Number },
    duration: { type: Number },
    description: { type: String },
    // Add more variant-specific fields as needed
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

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
