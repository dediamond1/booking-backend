import mongoose, { Schema, Document, Model } from 'mongoose';

interface IServiceVariant {
  name: string;
  price: number;
  duration: number;
  description?: string;
}

export interface IService extends Document {
  tenantId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  price: number;
  duration: number;
  category?: string;
  images?: string[];
  availability?: any;
  unit?: string;
  SKU?: string;
  serviceCode?: string;
  isFeatured: boolean;
  variants?: IServiceVariant[];
  createdAt: Date;
  updatedAt: Date;
}

const serviceSchema: Schema = new Schema({
  tenantId: {
    type: Schema.Types.ObjectId,
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
    type: Number,
    required: true,
  },
  category: {
    type: String,
  },
  images: [{
    type: String,
  }],
  availability: {
    type: Schema.Types.Mixed,
  },
  unit: {
    type: String,
  },
  SKU: {
    type: String,
  },
  serviceCode: {
    type: String,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  variants: [{
    name: { type: String },
    price: { type: Number },
    duration: { type: Number },
    description: { type: String },
  }],
}, {
  timestamps: true,
});

const Service: Model<IService> = mongoose.model<IService>('Service', serviceSchema);

export default Service;