const mongoose = require('mongoose');

const discountSchema = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Tenant',
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    default: 'percentage',
  },
  discountValue: {
    type: Number,
    required: true,
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  conditions: {
    type: String, // e.g., "minimum spend of $50", "valid for first-time customers only"
  },
  serviceIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service', // Apply to specific services
  }],
  categoryIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category', // Apply to specific categories (if we have categories)
  }],
  usageCount: {
    type: Number,
    default: 0,
  },
  maxUsage: {
    type: Number,
  },
  customerSegments: [{
    type: String,
  }],
  isRecurring: {
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
});

const Discount = mongoose.model('Discount', discountSchema);

module.exports = Discount;
