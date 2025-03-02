import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDiscount extends Document {
  tenantId: mongoose.Types.ObjectId;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  startDate?: Date;
  endDate?: Date;
  conditions?: string;
  serviceIds?: mongoose.Types.ObjectId[];
  categoryIds?: mongoose.Types.ObjectId[];
  usageCount: number;
  maxUsage?: number;
  customerSegments?: string[];
  isRecurring: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const discountSchema: Schema = new Schema({
  tenantId: {
    type: Schema.Types.ObjectId,
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
    type: Schema.Types.ObjectId,
    ref: 'Service', // Apply to specific services
  }],
  categoryIds: [{
    type: Schema.Types.ObjectId,
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
}, {
  timestamps: true, // This will add createdAt and updatedAt fields automatically
});

const Discount: Model<IDiscount> = mongoose.model<IDiscount>('Discount', discountSchema);

export default Discount;