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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const discountSchema = new mongoose_1.Schema({
    tenantId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Service', // Apply to specific services
        }],
    categoryIds: [{
            type: mongoose_1.Schema.Types.ObjectId,
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
const Discount = mongoose_1.default.model('Discount', discountSchema);
exports.default = Discount;
//# sourceMappingURL=discount.model.js.map