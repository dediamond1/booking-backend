const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Tenant',
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Booking',
  },
  paymentMethod: {
    type: String,
    enum: ['creditCard', 'debitCard', 'paypal', 'cash', 'other'],
    default: 'creditCard',
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
  },
  paymentDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending',
  },
  transactionId: {
    type: String, // Transaction ID from payment gateway
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
  paymentGateway: {
    type: String, // e.g., 'Stripe', 'PayPal'
  },
  paymentDetails: {
    type: mongoose.Schema.Types.Mixed, // Store sensitive payment details securely
  },
  refundId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Refund', // Reference to a Refund model (not yet created)
  },
  invoiceId: {
    type: String, // Reference to an invoice
  },
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
