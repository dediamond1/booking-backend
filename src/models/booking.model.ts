import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBooking extends Document {
  tenantId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  serviceId: mongoose.Types.ObjectId;
  employeeId?: mongoose.Types.ObjectId;
  bookingTime: Date;
  duration?: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled';
  price?: number;
  notes?: string;
  bookingSource?: string;
  customerTimezone?: string;
  discountId?: mongoose.Types.ObjectId;
  paymentId?: mongoose.Types.ObjectId;
  cancellationReason?: string;
  rescheduleHistory?: Date[];
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema: Schema = new Schema({
  tenantId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Tenant',
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  serviceId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Service',
  },
  employeeId: {
    type: Schema.Types.ObjectId,
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
    type: Schema.Types.ObjectId,
    ref: 'Discount',
  },
  paymentId: {
    type: Schema.Types.ObjectId,
    ref: 'Payment',
  },
  cancellationReason: {
    type: String,
  },
  rescheduleHistory: [{
    type: Date,
  }],
}, {
  timestamps: true, // This will add createdAt and updatedAt fields automatically
});

const Booking: Model<IBooking> = mongoose.model<IBooking>('Booking', bookingSchema);

export default Booking;