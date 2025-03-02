import mongoose, { Schema, Document, Model } from 'mongoose';

// Define the interface for the Tenant document
export interface ITenant extends Document {
  tenantId: string;
  organizationId?: mongoose.Types.ObjectId;
  name: string;
  domain: string;
  databaseUrl: string;
  tenantLogoUrl?: string; 
  contactEmail?: string;
  tenantTheme?: any;    
  fullAddress?: any;    
  website?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  currency?: string;
  createdAt: Date;
  updatedAt: Date;
  paymentGatewayConfig?: any;
  smtpConfig?: any;
  businessHours?: any;
}

// Define the Tenant schema
const tenantSchema: Schema<ITenant> = new Schema({
  tenantId: {
    type: String,
    required: true,
    unique: true,
  },
  databaseUrl: {
    type: String,
    required: true,
    unique: true,
  },
  organizationId: {
    type: Schema.Types.ObjectId,
    ref: 'Organization', // Reference to Organization model
  },
  name: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function(v: string) {
        return /^[a-zA-Z0-9-_]+$/.test(v);
      },
      message: 'Tenant name must be alphanumeric and can include hyphens or underscores'
    }
  },
  domain: {
    type: String,
    required: true,
    unique: true,
  },
  tenantLogoUrl: { // Tenant-specific logo
    type: String, // URL or path to company logo
  },
  tenantTheme: { // Tenant-specific theme
    type: Schema.Types.Mixed, // JSON object for theme settings
  },
  contactEmail: {
    type: String,
  },
  fullAddress: { // Structured address
    type: Schema.Types.Mixed, // JSON object for address details
  },
  latitude: {
    type: Number,
  },
  longitude: {
    type: Number,
  },
  website: {
    type: String,
  },
  timezone: {
    type: String,
  },
  currency: {
    type: String,
  },
}, {
  timestamps: true, // This will automatically add createdAt and updatedAt fields
});

// Extend Tenant schema with settings fields
tenantSchema.add({
  tenantTheme: { // Tenant-specific theme settings
    type: Schema.Types.Mixed,
  },
  paymentGatewayConfig: { // Payment gateway configuration
    type: Schema.Types.Mixed,
  },
  smtpConfig: { // SMTP configuration for emails
    type: Schema.Types.Mixed,
  },
  businessHours: { // Business hours settings
    type: Schema.Types.Mixed,
  },
});

// Create and export the Tenant model
const Tenant: Model<ITenant> = mongoose.model<ITenant>('Tenant', tenantSchema);

export default Tenant;
