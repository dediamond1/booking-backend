import mongoose, { Schema, Document, Model } from 'mongoose';

// Define the interface for the Organization document
export interface IOrganization extends Document {
  name: string;
  legalStructure?: string;
  businessIdentificationNumber?: string;
  taxVatId?: string;
  ownerAdminUser: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
 logoUrl?: string; // Organization Logo URL
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
  smtpPass?: string;
  smtpFromEmail?: string;
}

// Define the Organization schema
const organizationSchema: Schema<IOrganization> = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  legalStructure: {
    type: String,
  },
  businessIdentificationNumber: {
    type: String,
  },
  taxVatId: {
    type: String,
  },
  ownerAdminUser: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  smtpHost: {
    type: String,
  },
  smtpPort: {
    type: Number,
  },
  smtpUser: {
    type: String,
  },
  smtpPass: {
    type: String,
  },
  smtpFromEmail: {
    type: String,
  },
}, {
  timestamps: true, // This will automatically add createdAt and updatedAt fields
});

// Create and export the Organization model
const Organization: Model<IOrganization> = mongoose.model<IOrganization>('Organization', organizationSchema);

export default Organization;
