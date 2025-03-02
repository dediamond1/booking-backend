import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReview extends Document {
  tenantId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  serviceId?: mongoose.Types.ObjectId;
  rating: number;
  comment?: string;
  reviewDate: Date;
  createdAt: Date;
  updatedAt: Date;
  employeeId?: mongoose.Types.ObjectId;
  isAnonymous: boolean;
  helpfulCount: number;
  response?: string;
  imageUrls?: string[];
}

const reviewSchema: Schema = new Schema({
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
    ref: 'Service',
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
  },
  reviewDate: {
    type: Date,
    default: Date.now,
  },
  employeeId: {
    type: Schema.Types.ObjectId,
    ref: 'Employee',
  },
  isAnonymous: {
    type: Boolean,
    default: false,
  },
  helpfulCount: {
    type: Number,
    default: 0,
  },
  response: {
    type: String,
  },
  imageUrls: [{
    type: String,
  }],
}, {
  timestamps: true,
});

const Review: Model<IReview> = mongoose.model<IReview>('Review', reviewSchema);

export default Review;