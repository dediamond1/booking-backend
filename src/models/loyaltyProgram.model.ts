import mongoose, { Schema, Document, Model } from 'mongoose';

interface IRewardTier {
  tierName: string;
  pointsNeeded: number;
  rewardDescription?: string;
  discountId?: mongoose.Types.ObjectId;
}

export interface ILoyaltyProgram extends Document {
  tenantId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  pointsPerDollar: number;
  rewardTiers: IRewardTier[];
  enrollmentStartDate?: Date;
  enrollmentEndDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  programType: 'points-based' | 'tier-based';
  eligibilityCriteria?: string;
  expiryRules?: string;
  termsAndConditions?: string;
}

const loyaltyProgramSchema: Schema = new Schema({
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
  pointsPerDollar: {
    type: Number,
    default: 1,
  },
  rewardTiers: [{
    tierName: { type: String, required: true },
    pointsNeeded: { type: Number, required: true },
    rewardDescription: { type: String },
    discountId: {
      type: Schema.Types.ObjectId,
      ref: 'Discount',
    },
  }],
  enrollmentStartDate: {
    type: Date,
  },
  enrollmentEndDate: {
    type: Date,
  },
  programType: {
    type: String,
    enum: ['points-based', 'tier-based'],
    default: 'points-based',
  },
  eligibilityCriteria: {
    type: String,
  },
  expiryRules: {
    type: String,
  },
  termsAndConditions: {
    type: String,
  },
}, {
  timestamps: true,
});

const LoyaltyProgram: Model<ILoyaltyProgram> = mongoose.model<ILoyaltyProgram>('LoyaltyProgram', loyaltyProgramSchema);

export default LoyaltyProgram;