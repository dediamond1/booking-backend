import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEmployee extends Document {
  tenantId: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  serviceIds?: mongoose.Types.ObjectId[];
  availability?: any;
  employeeType?: string;
  specializations?: string[];
  profilePicture?: string;
  bio?: string;
  address?: string;
  commissionRate?: number;
  breakTimes?: any;
  createdAt: Date;
  updatedAt: Date;
}

const employeeSchema: Schema = new Schema({
  tenantId: {
    type: Schema.Types.ObjectId,
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
    type: Schema.Types.ObjectId,
    ref: 'Service',
  }],
  availability: {
    type: Schema.Types.Mixed,
  },
  employeeType: {
    type: String,
  },
  specializations: [{
    type: String,
  }],
  profilePicture: {
    type: String,
  },
  bio: {
    type: String,
  },
  address: {
    type: String,
  },
  commissionRate: {
    type: Number,
  },
  breakTimes: {
    type: Schema.Types.Mixed,
  },
}, {
  timestamps: true,
});

const Employee: Model<IEmployee> = mongoose.model<IEmployee>('Employee', employeeSchema);

export default Employee;