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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOrganization = exports.updateOrganization = exports.getAllOrganizations = exports.getOrganization = exports.createOrganization = void 0;
const organization_model_1 = __importDefault(require("../models/organization.model"));
const express_validator_1 = require("express-validator");
const error_1 = require("../utils/error"); // Import getErrorMessage
const uuid_1 = require("uuid"); // Import uuidv4
// Create a new organization
exports.createOrganization = [
    // Validate request body
    (0, express_validator_1.body)('name').notEmpty().withMessage('Name is required'),
    (0, express_validator_1.body)('legalStructure').optional().isString().withMessage('Legal structure must be a string'),
    (0, express_validator_1.body)('businessIdentificationNumber').optional().isString().withMessage('Business identification number must be a string'),
    (0, express_validator_1.body)('taxVatId').optional().isString().withMessage('Tax VAT ID must be a string'),
    (0, express_validator_1.body)('smtpHost').optional().isString().withMessage('SMTP host must be a string'),
    (0, express_validator_1.body)('smtpPort').optional().isInt({ min: 1 }).withMessage('SMTP port must be a positive integer'),
    (0, express_validator_1.body)('smtpUser').optional().isString().withMessage('SMTP user must be a string'),
    (0, express_validator_1.body)('smtpPass').optional().isString().withMessage('SMTP pass must be a string'),
    (0, express_validator_1.body)('smtpFromEmail').optional().isEmail().withMessage('SMTP from email must be a valid email'),
    (0, express_validator_1.body)('ownerAdminUser').notEmpty().withMessage('Owner Admin User is required'), // Add validation for ownerAdminUser
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            // Generate a unique tenant ID (for organization - although tenantId is for business)
            const tenantId = (0, uuid_1.v4)();
            const organization = new organization_model_1.default(Object.assign(Object.assign({}, req.body), { tenantId }));
            const savedOrganization = yield organization.save();
            return res.status(201).send(savedOrganization);
        }
        catch (error) {
            return res.status(400).send({ message: 'Error creating organization', error: error.message });
        }
    })
];
// Get an organization by ID
const getOrganization = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const organization = yield organization_model_1.default.findById(req.params.id);
        if (!organization) {
            res.status(404).send({ message: 'Organization not found' });
            return;
        }
        res.send(organization);
    }
    catch (error) {
        res.status(500).send({ message: 'Error getting organization', error: error.message });
    }
});
exports.getOrganization = getOrganization;
// Get all organizations
const getAllOrganizations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const organizations = yield organization_model_1.default.find();
        res.send(organizations);
    }
    catch (error) {
        res.status(500).send({ message: 'Error getting organizations', error: error.message });
    }
});
exports.getAllOrganizations = getAllOrganizations;
// Update an organization by ID
exports.updateOrganization = [
    // Validate request body
    (0, express_validator_1.body)('name').optional().notEmpty().withMessage('Name is required'),
    (0, express_validator_1.body)('legalStructure').optional().isString().withMessage('Legal structure must be a string'),
    (0, express_validator_1.body)('businessIdentificationNumber').optional().isString().withMessage('Business identification number must be a string'),
    (0, express_validator_1.body)('taxVatId').optional().isString().withMessage('Tax VAT ID must be a string'),
    (0, express_validator_1.body)('smtpHost').optional().isString().withMessage('SMTP host must be a string'),
    (0, express_validator_1.body)('smtpPort').optional().isInt({ min: 1 }).withMessage('SMTP port must be a positive integer'),
    (0, express_validator_1.body)('smtpUser').optional().isString().withMessage('SMTP user must be a string'),
    (0, express_validator_1.body)('smtpPass').optional().isString().withMessage('SMTP pass must be a string'),
    (0, express_validator_1.body)('smtpFromEmail').optional().isEmail().withMessage('SMTP from email must be a valid email'),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const organization = yield organization_model_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!organization) {
                return res.status(404).send({ message: 'Organization not found' });
            }
            return res.send(organization);
        }
        catch (error) {
            return res.status(400).send({ message: 'Error updating organization', error: error.message });
        }
    })
];
// Delete an organization by ID
const deleteOrganization = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const organization = yield organization_model_1.default.findByIdAndDelete(req.params.id);
        if (!organization) {
            res.status(404).send({ message: 'Organization not found' });
            return;
        }
        res.send({ message: 'Organization deleted' });
    }
    catch (error) {
        res.status(500).send({ message: 'Error deleting organization', error: (0, error_1.getErrorMessage)(error) });
    }
});
exports.deleteOrganization = deleteOrganization;
//# sourceMappingURL=organization.controller.js.map