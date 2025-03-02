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
// Define the Tenant schema
const tenantSchema = new mongoose_1.Schema({
    tenantId: {
        type: String,
        required: true,
        unique: true,
    },
    organizationId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Organization', // Reference to Organization model
    },
    name: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (v) {
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
    companyLogo: {
        type: String, // URL or path to company logo
    },
    contactEmail: {
        type: String,
    },
    address: {
        type: String,
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
// Create and export the Tenant model
const Tenant = mongoose_1.default.model('Tenant', tenantSchema);
exports.default = Tenant;
//# sourceMappingURL=tenant.model.js.map