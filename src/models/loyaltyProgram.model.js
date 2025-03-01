const mongoose = require('mongoose');

const loyaltyProgramSchema = new mongoose.Schema({
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
  pointsPerDollar: {
    type: Number,
    default: 1,
  },
  rewardTiers: [{
    tierName: { type: String, required: true },
    pointsNeeded: { type: Number, required: true },
    rewardDescription: { type: String },
    discountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Discount', // Link to a discount
    },
  }],
  enrollmentStartDate: {
    type: Date,
  },
  enrollmentEndDate: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  programType: {
    type: String,
    enum: ['points-based', 'tier-based'],
    default: 'points-based',
  },
  eligibilityCriteria: {
    type: String, // Description of eligibility criteria
  },
  expiryRules: {
    type: String, // Rules for point expiry
  },
  termsAndConditions: {
    type: String, // URL to terms and conditions
  },
});

const LoyaltyProgram = mongoose.model('LoyaltyProgram', loyaltyProgramSchema);

module.exports = LoyaltyProgram;
