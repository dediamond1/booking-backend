import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBusinessHours extends Document {
  tenantId: mongoose.Types.ObjectId;
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  startTime?: string;
  endTime?: string;
  isClosed: boolean;
  createdAt: Date;
  updatedAt: Date;
  timeZone?: string;
  exceptions?: any;
  employeeSpecific: boolean;
}

const businessHoursSchema: Schema = new Schema({
  tenantId: {
    type: Schema.Types.ObjectId,
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
  timeZone: {
    type: String, // Time zone for these business hours
  },
  exceptions: {
    type: Schema.Types.Mixed, // To handle exceptions like holidays
  },
  employeeSpecific: {
    type: Boolean,
    default: false, // If true, these hours apply to a specific employee
  },
}, {
  timestamps: true, // This will add createdAt and updatedAt fields automatically
});

const BusinessHours: Model<IBusinessHours> = mongoose.model<IBusinessHours>('BusinessHours', businessHoursSchema);

export default BusinessHours;