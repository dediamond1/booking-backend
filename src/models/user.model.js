const mongoose = require('mongoose');
const USER_ROLES = require('../config/roles'); // Import roles

const userSchema = new mongoose.Schema({
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
  tenantRoles: [{
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Tenant',
    },
    roles: [{
      type: String,
      enum: USER_ROLES, // Use imported roles for enum
    }],
  }],
  profilePicture: {
    type: String, // URL or path to profile picture
  },
  phone: {
    type: String,
  },
  passwordResetToken: {
    type: String,
  },
  passwordResetExpires: {
    type: Date,
  },
  verificationToken: {
    type: String,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  notificationPreferences: {
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: false },
    push: { type: Boolean, default: false },
  },
  address: {
    type: String,
  },
  dateOfBirth: {
    type: Date,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
  },
  lastLogin: {
    type: Date,
  },
  loginAttempts: {
    type: Number,
    default: 0,
  },
  blockedUntil: {
    type: Date,
  },
  communicationLanguage: {
    type: String,
    default: 'en', // Default to English
  },
  timezone: {
    type: String,
  },
  currency: {
    type: String,
  },
  preferences: {
    type: mongoose.Schema.Types.Mixed, // User-specific preferences
    default: {},
  },
  socialLinks: {
    facebook: { type: String },
    twitter: { type: String },
    instagram: { type: String },
    linkedin: { type: String },
  },
  tags: [{ type: String }], // Array of tags for user segmentation
  twoFactorAuthEnabled: {
    type: Boolean,
    default: false,
  },
  twoFactorAuthMethod: {
    type: String,
    enum: ['email', 'sms', 'app'],
  },
  lastActivity: {
    type: Date,
  },
  customFields: {
    type: mongoose.Schema.Types.Mixed, // For tenant-specific custom fields
    default: {},
  },
  servicePreferences: [{ type: String }], // e.g., preferred service categories
  auditLog: [{ // For audit trail
    event: { type: String },
    timestamp: { type: Date, default: Date.now },
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to user who performed the action
    details: { type: mongoose.Schema.Types.Mixed }, // Detailed information about the event
  }],
  gdprConsent: {
    consentGiven: { type: Boolean, default: false },
    consentDate: { type: Date },
    dataProcessingAgreements: [{
      agreementName: { type: String },
      agreed: { type: Boolean, default: false },
      agreementDate: { type: Date },
    }],
  },
  userGroups: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserGroup', // To be created
  }],
  integrationIds: {
    crm: { type: String },
    paymentGateway: { type: String },
    // Add other external system IDs as needed
  },
  loginHistory: [{
    timestamp: { type: Date, default: Date.now },
    ipAddress: { type: String },
    device: { type: String },
    location: { type: String }, // Could use geo-ip lookup
    status: { type: String, enum: ['success', 'failed'] },
  }],
  ipWhitelist: [{ type: String }], // Whitelisted IP addresses
  sessionRevocationTokens: [{ type: String }], // Tokens for session revocation
  activityLog: [{ // More detailed activity log
    event: { type: String },
    timestamp: { type: Date, default: Date.now },
    description: { type: String },
    details: { type: mongoose.Schema.Types.Mixed },
  }],
  userSegments: [{ // User segments for dynamic grouping
    type: String,
  }],
  contentPreferences: { // For content personalization
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  tenantSpecificData: { // For tenant-specific data, consider renaming or clarifying usage
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  passwordHistory: [{ // Track password history
    passwordHash: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  }],
  securityQuestions: [{ // For password recovery
    question: { type: String, required: true },
    answer: { type: String, required: true },
  }],
  interests: [{ type: String }], // User interests for personalization
  deviceInfo: [{ // Device information for login tracking and security
    deviceId: { type: String },
    deviceName: { type: String },
    deviceType: { type: String },
    os: { type: String },
    browser: { type: String },
    lastUsed: { type: Date },
  }],
  usageStatistics: { // Track user activity within the platform
    bookingsCreated: { type: Number, default: 0 },
    bookingsCancelled: { type: Number, default: 0 },
    servicesUsed: { type: Number, default: 0 },
    lastActive: { type: Date },
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
