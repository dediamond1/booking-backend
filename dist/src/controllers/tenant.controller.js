"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTenant = exports.updateTenant = exports.getAllTenants = exports.getTenant = exports.createTenant = void 0;
const express_validator_1 = require("express-validator");
const uuid_1 = require("uuid");
const tenant_model_1 = __importDefault(require("../models/tenant.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const organization_model_1 = __importDefault(require("../models/organization.model"));
// Create a new tenant
exports.createTenant = [
    // Validate request body
    (0, express_validator_1.body)('name').notEmpty().withMessage('Name is required'),
    (0, express_validator_1.body)('domain').notEmpty().withMessage('Domain is required'),
    (0, express_validator_1.body)('userType').optional().isString().withMessage('User type must be a string'),
    (0, express_validator_1.body)('organizationName').optional().isString().withMessage('Organization name must be a string'),
    // Add validation for other business details as needed
    (0, express_validator_1.body)('companyLogo').optional().isString().withMessage('Company logo must be a string'),
    (0, express_validator_1.body)('contactEmail').optional().isEmail().withMessage('Contact email must be a valid email'),
    (0, express_validator_1.body)('address').optional().isString().withMessage('Address must be a string'),
    (0, express_validator_1.body)('website').optional().isURL().withMessage('Website must be a valid URL'),
    (0, express_validator_1.body)('timezone').optional().isString().withMessage('Timezone must be a string'),
    (0, express_validator_1.body)('currency').optional().isString().withMessage('Currency must be a string'),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const _a = req.body, { name, domain, userType, organizationName } = _a, businessDetails = __rest(_a, ["name", "domain", "userType", "organizationName"]);
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        try {
            let organizationId = null;
            // Check if the user is registering a company
            if (organizationName) {
                // Create the organization
                const organization = new organization_model_1.default({
                    name: organizationName,
                    ownerAdminUser: req.user._id, // Assuming user is authenticated and _id is available
                });
                const savedOrganization = yield organization.save();
                organizationId = savedOrganization._id;
            }
            // Generate a unique tenant ID
            const tenantId = (0, uuid_1.v4)();
            // Create the tenant
            const tenant = new tenant_model_1.default(Object.assign({ tenantId,
                name,
                domain,
                organizationId }, businessDetails));
            const savedTenant = yield tenant.save();
            // Assign the first user as the owner/admin of this tenant
            const owner = yield user_model_1.default.findById(req.user._id); // Assuming user is authenticated and _id is available
            if (owner) {
                owner.tenantRoles.push({
                    tenantId: savedTenant.tenantId,
                    roles: ['tenant-admin'],
                });
                yield owner.save();
            }
            res.status(201).send(savedTenant);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            res.status(400).send({ message: 'Error creating tenant', error: errorMessage });
        }
    })
];
// Get a tenant by ID
const getTenant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).send({ message: "getTenant Controller function is under construction." });
});
exports.getTenant = getTenant;
// Get all tenants
const getAllTenants = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).send({ message: "getAllTenants Controller function is under construction." });
});
exports.getAllTenants = getAllTenants;
// Update a tenant by ID
const updateTenant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).send({ message: "updateTenant Controller function is under construction." });
});
exports.updateTenant = updateTenant;
// Delete a tenant by ID
const deleteTenant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).send({ message: "deleteTenant Controller function is under construction." });
});
exports.deleteTenant = deleteTenant;
//# sourceMappingURL=tenant.controller.js.map