import 'dotenv/config';
import express, { Request, Response, NextFunction, Express } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { doubleCsrf } from 'csrf-csrf';
import rateLimit from 'express-rate-limit';
import tenantMiddleware from './src/middleware/tenant.middleware';
import authRoutes from './src/routes/auth';
import organizationRoutes from './src/routes/organization';
import tenantRoutes from './src/routes/tenant';
import tenantUserRoutes from './src/routes/tenant-user';

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
const app: Express = express();
const port: string | number = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cookieParser());

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
  credentials: true
}));

// Request parsing and logging
app.use(express.json());
app.use(morgan('dev'));

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(apiLimiter);

// CSRF Protection Configuration
const { doubleCsrfProtection, generateToken } = doubleCsrf({
  getSecret: (req) => req?.secret || process.env.CSRF_SECRET!,
  cookieName: 'x-csrf-token', // Protected host cookie
  cookieOptions: {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  },
  size: 128,
  ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],
  getTokenFromRequest: (req) => req.headers['x-csrf-token'] as string,
});

// CSRF token endpoint (must be before CSRF protection)
app.get('/api/csrf-token', (req: Request, res: Response) => {
  const csrfToken = generateToken(req, res);
  res.status(200).json({ csrfToken });
});

// Apply CSRF protection to state-changing routes
// app.use(['/auth/*', '/api/*'], doubleCsrfProtection);

// Routes
app.use('/auth', authRoutes);
app.use('/organization', organizationRoutes);
app.use('/tenants', tenantRoutes);
app.use('/tenants', tenantUserRoutes); // Mount tenant user routes under /api
// Tenant middleware
app.use(tenantMiddleware as express.RequestHandler);

// Database connection
const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!, {
      dbName: process.env.MONGODB_DBNAME || 'booking-db',
      retryWrites: true,
      w: 'majority'
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    dbState: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Error handling middleware
app.use((err: any, req: any, res: any) => {
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
  res.status(err.statusCode || 500).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

// Start server
const startServer = async () => {
  await connectToDatabase();
  app.listen(port, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`);
  });
};

// Handle shutdown gracefully
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed');
  process.exit(0);
});

// Start the application
startServer();
