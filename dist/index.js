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
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const mongoose_1 = __importDefault(require("mongoose"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const helmet_1 = __importDefault(require("helmet"));
const csrf_csrf_1 = require("csrf-csrf");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const tenant_middleware_1 = __importDefault(require("./src/middleware/tenant.middleware"));
const auth_1 = __importDefault(require("./src/routes/auth"));
// Validate required environment variables
const requiredEnvVars = [
    'MONGODB_URI',
    'CSRF_SECRET',
    'JWT_SECRET',
    'NODE_ENV'
];
requiredEnvVars.forEach((varName) => {
    if (!process.env[varName] && process.env.NODE_ENV !== 'test') {
        console.error(`Missing required environment variable: ${varName}`);
        process.exit(1);
    }
});
// Initialize Express app
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// Security middleware
app.use((0, helmet_1.default)());
app.use((0, cookie_parser_1.default)());
// CORS configuration
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
    credentials: true
}));
// Request parsing and logging
app.use(express_1.default.json());
app.use((0, morgan_1.default)('dev'));
// Rate limiting
const apiLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(apiLimiter);
// CSRF Protection Configuration
const { doubleCsrfProtection, generateToken } = (0, csrf_csrf_1.doubleCsrf)({
    getSecret: (req) => (req === null || req === void 0 ? void 0 : req.secret) || process.env.CSRF_SECRET,
    cookieName: 'x-csrf-token', // Protected host cookie
    cookieOptions: {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
    },
    size: 128,
    ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],
    getTokenFromRequest: (req) => req.headers['x-csrf-token'],
});
// CSRF token endpoint (must be before CSRF protection)
app.get('/api/csrf-token', (req, res) => {
    const csrfToken = generateToken(req, res);
    res.status(200).json({ csrfToken });
});
// Apply CSRF protection to state-changing routes
// app.use(['/auth/*', '/api/*'], doubleCsrfProtection);
// Routes
app.use('/auth', auth_1.default);
// Tenant middleware
app.use(tenant_middleware_1.default);
// Database connection
const connectToDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(process.env.MONGODB_URI, {
            dbName: process.env.MONGODB_DBNAME || 'booking-db',
            retryWrites: true,
            w: 'majority'
        });
        console.log('Connected to MongoDB');
    }
    catch (error) {
        console.error('MongoDB connection failed:', error);
        process.exit(1);
    }
});
// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        dbState: mongoose_1.default.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});
// Error handling middleware
app.use((err, req, res) => {
    console.error(`[${new Date().toISOString()}] Error:`, err);
    // Handle CSRF errors specifically
    if (err.code === 'EBADCSRFTOKEN') {
        return res.status(403).json({
            status: 'error',
            message: 'Invalid CSRF token',
            code: 'INVALID_CSRF_TOKEN'
        });
    }
    // General error response
    res.status(err.statusCode || 500).json(Object.assign({ status: 'error', message: err.message || 'Internal Server Error' }, (process.env.NODE_ENV !== 'production' && { stack: err.stack })));
});
// Start server
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    yield connectToDatabase();
    app.listen(port, () => {
        console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`);
    });
});
// Handle shutdown gracefully
process.on('SIGINT', () => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
}));
process.on('SIGTERM', () => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
}));
// Start the application
startServer();
//# sourceMappingURL=index.js.map