import mongoose, { Schema, Document, Model } from 'mongoose';
import USER_ROLES from '../config/roles'; // Import roles
import { TenantRole } from '../config/tenant-roles';

export interface IUser extends Document {
  organizationId?: mongoose.Types.ObjectId;
  tenantId?: mongoose.Types.ObjectId;
  tenantRole?: TenantRole;
  invitationToken?: string; // Added invitationToken field
  invitationTokenExpires?: Date; // Added invitationTokenExpires field
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profilePicture?: string;
  phone?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  verificationToken?: string;
  isVerified?: boolean;
  notificationPreferences?: {
    email?: boolean;
    sms?: boolean;
    push?: boolean;
  };
  address?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
  lastLogin?: Date;
  loginAttempts?: number;
  blockedUntil?: Date;
  communicationLanguage?: string;
  timezone?: string;
  currency?: string;
  preferences?: any;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  tags?: string[];
  twoFactorAuthEnabled?: boolean;
  twoFactorAuthMethod?: 'email' | 'sms' | 'app';
  lastActivity?: Date;
  customFields?: any;
  servicePreferences?: string[];
  auditLog?: [{
    event: string;
    timestamp: Date;
    performedBy: mongoose.Types.ObjectId;
    details: any;
  }];
  gdprConsent?: {
    consentGiven?: boolean;
    consentDate?: Date;
    dataProcessingAgreements?: [{
      agreementName: string;
      agreed: boolean;
      agreementDate: Date;
    }];
  };
  userGroups?: mongoose.Types.ObjectId[];
  integrationIds?: {
    crm?: string;
    paymentGateway?: string;
  };
  loginHistory?: [{
    timestamp: Date;
    ipAddress: string;
    device: string;
    location: string;
    status: 'success' | 'failed';
  }];
  ipWhitelist?: string[];
  sessionRevocationTokens?: string[];
  activityLog?: [{
    event: string;
    timestamp: Date;
    description: string;
    details: any;
  }];
  userSegments?: string[];
  contentPreferences?: any;
  tenantSpecificData?: any;
  passwordHistory?: [{
    passwordHash: string;
    createdAt: Date;
  }];
  securityQuestions?: [{
    question: string;
    answer: string;
  }];
  interests?: string[];
  deviceInfo?: [{
    deviceId: string;
    deviceName: string;
    deviceType: string;
    os: string;
    browser: string;
    lastUsed: Date;
  }];
  usageStatistics?: {
    bookingsCreated: number;
    bookingsCancelled: number;
    servicesUsed: number;
    lastActive: Date;
  };
  loyaltyPoints?: number;
  referralCount?: number;
  subscriptionStatus?: 'active' | 'inactive';
}

const userSchema: Schema<IUser> = new Schema({
  organizationId: {
    type: Schema.Types.ObjectId,
    ref: 'Organization',
  },
  tenantId: { // Added tenantId field to schema
    type: Schema.Types.ObjectId,
    ref: 'Tenant',
  },
  tenantRole: { // Added tenantRole field to schema
    type: String,
    enum: Object.values(TenantRole), // Use TenantRole enum for validation
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
  password: {
    type: String,
    required: true,
  },
  profilePicture: String,
  phone: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  verificationToken: String,
  isVerified: {
    type: Boolean,
    default: false,
  },
  notificationPreferences: {
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: false },
    push: { type: Boolean, default: false },
  },
  address: String,
  dateOfBirth: Date,
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
  },
  lastLogin: Date,
  loginAttempts: {
    type: Number,
    default: 0,
  },
  blockedUntil: Date,
  communicationLanguage: {
    type: String,
    default: 'en',
  },
  timezone: {
    type: String,
    default: 'UTC',
  },
  currency: {
    type: String,
    default: 'USD',
  },
  preferences: {
    type: Schema.Types.Mixed,
    default: {},
  },
  socialLinks: {
    facebook: String,
    twitter: String,
    instagram: String,
    linkedin: String,
  },
  tags: [String],
  twoFactorAuthEnabled: {
    type: Boolean,
    default: false,
  },
  twoFactorAuthMethod: {
    type: String,
    enum: ['email', 'sms', 'app'],
  },
  lastActivity: Date,
  customFields: {
    type: Schema.Types.Mixed,
    default: {},
  },
  servicePreferences: [String],
  auditLog: [{
    event: String,
    timestamp: { type: Date, default: Date.now },
    performedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    details: Schema.Types.Mixed,
  }],
  gdprConsent: {
    consentGiven: { type: Boolean, default: false },
    consentDate: Date,
    dataProcessingAgreements: [{
      agreementName: String,
      agreed: { type: Boolean, default: false },
      agreementDate: Date,
    }],
  },
  userGroups: [{
    type: Schema.Types.ObjectId,
    ref: 'UserGroup',
  }],
  integrationIds: {
    crm: String,
    paymentGateway: String,
  },
  loginHistory: [{
    timestamp: Date,
    ipAddress: String,
    device: String,
    location: String,
    status: { type: String, enum: ['success', 'failed'] },
  }],
  ipWhitelist: [String],
  sessionRevocationTokens: [String],
  activityLog: [{
    event: String,
    timestamp: { type: Date, default: Date.now },
    description: String,
    details: Schema.Types.Mixed,
  }],
  userSegments: [String],
  contentPreferences: {
    type: Schema.Types.Mixed,
    default: {},
  },
  tenantSpecificData: {
    type: Schema.Types.Mixed,
    default: {},
  },
  passwordHistory: [{
    passwordHash: String,
    createdAt: { type: Date, default: Date.now },
  }],
  securityQuestions: [{
    question: String,
    answer: String,
  }],
  interests: [String],
  deviceInfo: [{
    deviceId: String,
    deviceName: String,
    deviceType: String,
    os: String,
    browser: String,
    lastUsed: Date,
  }],
  usageStatistics: {
    bookingsCreated: { type: Number, default: 0 },
    bookingsCancelled: { type: Number, default: 0 },
    servicesUsed: { type: Number, default: 0 },
    lastActive: Date,
  },
  loyaltyPoints: {
    type: Number,
    default: 0,
  },
  referralCount: {
    type: Number,
    default: 0,
  },
  subscriptionStatus: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'inactive',
  },
  invitationToken: { // Invitation token for new users
    type: String,
  },
  invitationTokenExpires: { // Invitation token expiration date
    type: Date,
  },
}, {
  timestamps: true, // This will add createdAt and updatedAt fields
});

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export default User;
