"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const roles_1 = __importDefault(require("../config/roles")); // Import roles
const userSchema = new mongoose_1.Schema({
    organizationId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Organization',
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
    tenantRoles: [{
            tenantId: {
                type: mongoose_1.Schema.Types.ObjectId,
                required: true,
                ref: 'Tenant',
            },
            roles: [{
                    type: String,
                    enum: roles_1.default,
                }],
        }],
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
        type: mongoose_1.Schema.Types.Mixed,
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
        type: mongoose_1.Schema.Types.Mixed,
        default: {},
    },
    servicePreferences: [String],
    auditLog: [{
            event: String,
            timestamp: { type: Date, default: Date.now },
            performedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
            details: mongoose_1.Schema.Types.Mixed,
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
            type: mongoose_1.Schema.Types.ObjectId,
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
            details: mongoose_1.Schema.Types.Mixed,
        }],
    userSegments: [String],
    contentPreferences: {
        type: mongoose_1.Schema.Types.Mixed,
        default: {},
    },
    tenantSpecificData: {
        type: mongoose_1.Schema.Types.Mixed,
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
}, {
    timestamps: true, // This will add createdAt and updatedAt fields
});
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;
//# sourceMappingURL=user.model.js.map