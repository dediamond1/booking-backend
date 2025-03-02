import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import rateLimit from 'express-rate-limit';
import User from '../models/user.model';

import { generateAuthTokens, generateVerificationToken, verifyToken, Tokens } from '../utils/jwt';
import EmailService from '../services/email/EmailService';
import { hashPassword, verifyPassword, validatePasswordStrength } from '../utils/password';
import { generateDeviceFingerprint } from '../utils/security';

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per windowMs
  message: 'Too many requests, please try again later'
});

class AuthController {
  async register(req: Request, res: Response) {
    try {
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, tenantId,firstName, lastName } = req.body;
      
      // Validate password strength
      const passwordError = validatePasswordStrength(password);
      if (passwordError) {
        return res.status(400).json({ message: passwordError });
      }

      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Generate device fingerprint
      const deviceFingerprint = generateDeviceFingerprint(req);

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Create user
      const user = await User.create({
        email,
        password: hashedPassword,
        tenants: [tenantId],
        firstName,
lastName,
        isVerified: false,
        devices: [{
          fingerprint: deviceFingerprint,
          lastLogin: new Date()
        }]
      });

      // Generate verification token
      const verificationToken = generateVerificationToken(user);
      
      // Validate and initialize email service config
      const smtpConfig = {
        host: process.env.SMTP_HOST || '',
        port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER || '',
          pass: process.env.SMTP_PASS || ''
        }
      };

      if (!smtpConfig.host || !smtpConfig.auth.user || !smtpConfig.auth.pass) {
        throw new Error('SMTP configuration is incomplete');
      }

      const emailService = new EmailService(smtpConfig);
      
      // Send verification email
      await emailService.sendVerificationEmail(email, verificationToken);

      res.status(201).json({ 
        message: 'Registration successful. Please check your email to verify your account.'
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ message: 'Registration failed', error: error.message });
      } else {
        res.status(500).json({ message: 'Registration failed due to an unknown error' });
      }
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Verify password
      const isValidPassword = await verifyPassword(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate tokens
      const { accessToken, refreshToken } = generateAuthTokens(user);

      // Set refresh token in cookie
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      res.json({ 
        accessToken,
        user: {
          id: user._id,
          email: user.email,
          tenants: user.tenants
        }
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ message: 'Login failed', error: error.message });
      } else {
        res.status(500).json({ message: 'Login failed due to an unknown error' });
      }
    }
  }
}
// Maintain singleton export for backward compatibility
export default new AuthController();
