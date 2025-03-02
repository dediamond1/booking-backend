import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDropIn extends Document {
  tenantId: mongoose.Types.ObjectId;
  serviceId: mongoose.Types.ObjectId;
  customerName: string;
  customerPhone?: string;
  status: 'waiting' | 'in-service' | 'completed' | 'cancelled';
  estimatedWaitTime?: number;
  startTime?: Date;
  endTime?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  userId?: mongoose.Types.ObjectId;
  employeeId?: mongoose.Types.ObjectId;
  queuePosition?: number;
  notificationSent: boolean;
}

const dropInSchema: Schema = new Schema({
  tenantId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Tenant',
  },
  serviceId: {
    type: Schema.Types.ObjectId,
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
    type: Number,
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
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  employeeId: {
    type: Schema.Types.ObjectId,
    ref: 'Employee',
  },
  queuePosition: {
    type: Number,
  },
  notificationSent: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

const DropIn: Model<IDropIn> = mongoose.model<IDropIn>('DropIn', dropInSchema);

export default DropIn;