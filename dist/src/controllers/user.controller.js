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
exports.deleteUser = exports.updateUserHandler = exports.updateUserValidation = exports.getAllUsers = exports.getUser = exports.loginUserHandler = exports.loginUserValidation = exports.createUserHandler = exports.createUserValidation = exports.getErrorMessage = void 0;
const express_validator_1 = require("express-validator");
const user_model_1 = __importDefault(require("../models/user.model"));
const uuid_1 = require("uuid");
const nodemailer_1 = __importDefault(require("nodemailer"));
// @ts-ignore
const nodemailer_handlebars_1 = __importDefault(require("nodemailer-handlebars"));
const path_1 = __importDefault(require("path"));
const argon2_1 = __importDefault(require("argon2"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const organization_model_1 = __importDefault(require("../models/organization.model"));
// Helper function to get a clean error message
const getErrorMessage = (error) => {
    if (error instanceof Error)
        return error.message;
    return String(error);
};
exports.getErrorMessage = getErrorMessage;
// Configure transporter with handlebars template support
function createTransporter(smtpConfig) {
    const transporter = nodemailer_1.default.createTransport(smtpConfig || {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
    transporter.use('compile', (0, nodemailer_handlebars_1.default)({
        viewEngine: {
            extname: '.hbs',
            partialsDir: path_1.default.resolve('./src/emails/verification'),
            layoutsDir: path_1.default.resolve('./src/emails/verification'),
            defaultLayout: 'verification-email',
        },
        viewPath: path_1.default.resolve('./src/emails/verification'),
        extName: '.hbs',
    }));
    return transporter;
}
const defaultTransporter = createTransporter();
// Create a new user
exports.createUserValidation = [
    (0, express_validator_1.body)('firstName').notEmpty().withMessage('First name is required'),
    (0, express_validator_1.body)('lastName').notEmpty().withMessage('Last name is required'),
    (0, express_validator_1.body)('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format'),
    (0, express_validator_1.body)('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    (0, express_validator_1.body)('passwordConfirmation')
        .notEmpty().withMessage('Password confirmation is required')
        .custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Password confirmation does not match');
        }
        return true;
    }),
];
const createUserHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    try {
        const { firstName, lastName, email, password, organizationId } = req.body;
        // Check for existing user
        const existingUser = yield user_model_1.default.findOne({ email });
        if (existingUser) {
            res.status(409).json({ message: 'Email already registered' });
            return;
        }
        const hashedPassword = yield argon2_1.default.hash(password);
        const verificationToken = (0, uuid_1.v4)();
        const user = new user_model_1.default({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            verificationToken,
            organizationId,
        });
        const savedUser = yield user.save();
        // Prepare email configuration
        let currentTransporter = defaultTransporter;
        let fromEmail = process.env.SMTP_FROM_EMAIL;
        if (organizationId) {
            const organization = yield organization_model_1.default.findById(organizationId);
            if ((organization === null || organization === void 0 ? void 0 : organization.smtpHost) && organization.smtpUser && organization.smtpPass && organization.smtpFromEmail) {
                currentTransporter = createTransporter({
                    host: organization.smtpHost,
                    port: organization.smtpPort || 587,
                    auth: {
                        user: organization.smtpUser,
                        pass: organization.smtpPass,
                    },
                });
                fromEmail = organization.smtpFromEmail;
            }
        }
        const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
        const mailOptions = {
            from: fromEmail,
            to: email,
            subject: 'Verify Your Email Address',
            template: 'verification-email',
            context: {
                firstName,
                lastName,
                verificationLink,
            },
        };
        yield currentTransporter.sendMail(mailOptions);
        res.status(201).json(savedUser);
    }
    catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({
            message: 'Error creating user',
            error: (0, exports.getErrorMessage)(error),
        });
    }
});
exports.createUserHandler = createUserHandler;
// Login user
exports.loginUserValidation = [
    (0, express_validator_1.body)('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format'),
    (0, express_validator_1.body)('password').notEmpty().withMessage('Password is required'),
];
const loginUserHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    try {
        const { email, password } = req.body;
        const user = yield user_model_1.default.findOne({ email });
        if (!user || !(yield argon2_1.default.verify(user.password, password))) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not configured');
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: 'Login successful', token, userId: user._id });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error logging in',
            error: (0, exports.getErrorMessage)(error),
        });
    }
});
exports.loginUserHandler = loginUserHandler;
// Get user by ID
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.default.findById(req.params.id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.json(user);
    }
    catch (error) {
        res.status(500).json({
            message: 'Error fetching user',
            error: (0, exports.getErrorMessage)(error),
        });
    }
});
exports.getUser = getUser;
// Get all users
const getAllUsers = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_model_1.default.find();
        res.json(users);
    }
    catch (error) {
        res.status(500).json({
            message: 'Error fetching users',
            error: (0, exports.getErrorMessage)(error),
        });
    }
});
exports.getAllUsers = getAllUsers;
// Update user validation
exports.updateUserValidation = [
    (0, express_validator_1.body)('firstName').optional().notEmpty().withMessage('First name is required'),
    (0, express_validator_1.body)('lastName').optional().notEmpty().withMessage('Last name is required'),
    (0, express_validator_1.body)('email')
        .optional()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format'),
    (0, express_validator_1.body)('password')
        .optional()
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];
const updateUserHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    try {
        const updates = Object.assign({}, req.body);
        if (updates.password) {
            updates.password = yield argon2_1.default.hash(updates.password);
        }
        const user = yield user_model_1.default.findByIdAndUpdate(req.params.id, updates, {
            new: true,
            runValidators: true,
        });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.json(user);
    }
    catch (error) {
        res.status(400).json({
            message: 'Error updating user',
            error: (0, exports.getErrorMessage)(error),
        });
    }
});
exports.updateUserHandler = updateUserHandler;
// Delete user
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.default.findByIdAndDelete(req.params.id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.json({ message: 'User deleted successfully' });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error deleting user',
            error: (0, exports.getErrorMessage)(error),
        });
    }
});
exports.deleteUser = deleteUser;
//# sourceMappingURL=user.controller.js.map