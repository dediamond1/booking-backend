import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPayment extends Document {
  tenantId: mongoose.Types.ObjectId;
  bookingId: mongoose.Types.ObjectId;
  paymentMethod: 'creditCard' | 'debitCard' | 'paypal' | 'cash' | 'other';
  amount: number;
  currency?: string;
  paymentDate: Date;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  paymentGateway?: string;
  paymentDetails?: any;
  refundId?: mongoose.Types.ObjectId;
  invoiceId?: string;
}

const paymentSchema: Schema = new Schema({
  tenantId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Tenant',
  },
  bookingId: {
    type: Schema.Types.ObjectId,
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
    type: String,
  },
  notes: {
    type: String,
  },
  paymentGateway: {
    type: String,
  },
  paymentDetails: {
    type: Schema.Types.Mixed,
  },
  refundId: {
    type: Schema.Types.ObjectId,
    ref: 'Refund',
  },
  invoiceId: {
    type: String,
  },
}, {
  timestamps: true,
});

const Payment: Model<IPayment> = mongoose.model<IPayment>('Payment', paymentSchema);

export default Payment;