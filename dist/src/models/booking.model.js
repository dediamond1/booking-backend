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
const bookingSchema = new mongoose_1.Schema({
    tenantId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'Tenant',
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    serviceId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'Service',
    },
    employeeId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Employee', // Optional, as some bookings might not be employee-specific
    },
    bookingTime: {
        type: Date,
        required: true,
    },
    duration: {
        type: Number, // Duration in minutes, could be derived from service or specified directly
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled', 'rescheduled'],
        default: 'pending',
    },
    price: {
        type: Number,
    },
    notes: {
        type: String,
    },
    bookingSource: {
        type: String, // e.g., 'web', 'app', 'admin', 'drop-in'
    },
    customerTimezone: {
        type: String,
    },
    discountId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Discount',
    },
    paymentId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Payment',
    },
    cancellationReason: {
        type: String,
    },
    rescheduleHistory: [{
            type: Date,
        }],
}, {
    timestamps: true, // This will add createdAt and updatedAt fields automatically
});
const Booking = mongoose_1.default.model('Booking', bookingSchema);
exports.default = Booking;
//# sourceMappingURL=booking.model.js.map