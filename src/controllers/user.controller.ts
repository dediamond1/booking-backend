import { Request, Response, NextFunction } from 'express';
import { body, validationResult, ValidationChain } from 'express-validator';
import User, { IUser } from '../models/user.model';
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';
// @ts-ignore
import hbs from 'nodemailer-handlebars';
import path from 'path';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import Organization from '../models/organization.model';
import { ErrorResponse } from '../utils/error';


// Helper function to get a clean error message
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return String(error);
};

// Configure transporter with handlebars template support
function createTransporter(smtpConfig?: {
  host: string;
  port: number;
  auth: { user: string; pass: string };
}) {
  const transporter = nodemailer.createTransport(
    smtpConfig || {
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    }
  );

  transporter.use(
    'compile',
    hbs({
      viewEngine: {
        extname: '.hbs',
        partialsDir: path.resolve('./src/emails/verification'),
        layoutsDir: path.resolve('./src/emails/verification'),
        defaultLayout: 'verification-email',
      },
      viewPath: path.resolve('./src/emails/verification'),
      extName: '.hbs',
    })
  );

  return transporter;
}

const defaultTransporter = createTransporter();

// Create a new user
export const createUserValidation: ValidationChain[] = [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('passwordConfirmation')
    .notEmpty().withMessage('Password confirmation is required')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match');
      }
      return true;
    }),
];

export const createUserHandler = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    const { firstName, lastName, email, password, organizationId } = req.body;

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({ message: 'Email already registered' });
      return;
    }

    const hashedPassword = await argon2.hash(password);
    const verificationToken = uuidv4();

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      verificationToken,
      organizationId,
    });

    const savedUser = await user.save();

    // Prepare email configuration
    let currentTransporter = defaultTransporter;
    let fromEmail = process.env.SMTP_FROM_EMAIL;

    if (organizationId) {
      const organization = await Organization.findById(organizationId);
      if (organization?.smtpHost && organization.smtpUser && organization.smtpPass && organization.smtpFromEmail) {
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

    const verificationLink = `${process.env.FRONTEND_URL}/auth/verify-email?token=${verificationToken}`;
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

    await currentTransporter.sendMail(mailOptions);
    res.status(201).json(savedUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      message: 'Error creating user',
      error: getErrorMessage(error),
    });
  }
};

export const acceptTenantInvitation = async (req: any, res: any) => {
  try {
    const { invitationToken, newPassword } = req.body;

    if (!invitationToken || !newPassword) {
      return res.status(400).json({ message: 'Invitation token and new password are required.' });
    }

    const user = await User.findOne({
      invitationToken: invitationToken,
      invitationTokenExpires: { $gt: new Date() }, // Check if token is not expired
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired invitation token.' });
    }

    // Hash the new password
    const hashedPassword = await argon2.hash(newPassword);

    // Update user's password, set isVerified to true, and clear invitation token fields
    user.password = hashedPassword;
    user.isVerified = true;
    user.invitationToken = undefined;
    user.invitationTokenExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully, invitation accepted. You can now log in with your new password.' });
  } catch (error: any) {
    console.error('Accept invitation error:', error);
    res.status(500).json({
      message: 'Failed to accept invitation',
      error: getErrorMessage(error),
    });
  }
};


export const changePasswordAfterAcceptance = async (req: any, res: Response) => { // Use any type for req
  try {
    const { newPassword, passwordConfirmation } = req.body;
    const userId = (req as any).user?.userId; // Use optional chaining in case user is not properly populated
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated.' });
    }

    if (!newPassword || !passwordConfirmation) {
      return res.status(400).json({ message: 'New password and password confirmation are required.' });
    }

    if (newPassword !== passwordConfirmation) {
      return res.status(400).json({ message: 'Password confirmation does not match.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }


    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Hash the new password
    const hashedPassword = await argon2.hash(newPassword);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password changed successfully.' });
  } catch (error: any) {
    console.error('Change password after acceptance error:', error);
    res.status(500).json({
      message: 'Failed to change password.',
      error: getErrorMessage(error),
    });
  }
};

// Login user
export const loginUserValidation: ValidationChain[] = [
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const loginUserHandler = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await argon2.verify(user.password, password))) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not configured');
    }

    const tokenPayload = { // Include tenantId and tenantRole in payload
      userId: user._id,
      tenantId: user.tenantId,
      tenantRole: user.tenantRole,
    };


    const token = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ message: 'Login successful', token, userId: user._id, tenantId: user.tenantId, tenantRole: user.tenantRole });
  } catch (error) {
    res.status(500).json({
      message: 'Error logging in',
      error: getErrorMessage(error),
    });
  }
};

// Get user by ID or 'me'
export const getUser = async (req: any, res: Response): Promise<void> => { // Use any type for req
  try {
    const userId = req.params.id;

    if (userId) {
      // Return current user's profile
      res.json(req.user);
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(req.user); // Return req.user instead of just user
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching user',
      error: getErrorMessage(error),
    });
  }
};

// Get all users
export const getAllUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching users',
      error: getErrorMessage(error),
    });
  }
};

// Update user validation
export const updateUserValidation: ValidationChain[] = [
  body('firstName').optional().notEmpty().withMessage('First name is required'),
  body('lastName').optional().notEmpty().withMessage('Last name is required'),
  body('email')
    .optional()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format'),
  body('password')
    .optional()
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

export const updateUserHandler = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    const updates = { ...req.body };

    if (updates.password) {
      updates.password = await argon2.hash(updates.password);
    }

    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json(user);
  } catch (error) {
    res.status(400).json({
      message: 'Error updating user',
      error: getErrorMessage(error),
    });
  }
};

// Delete user
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting user',
      error: getErrorMessage(error),
    });
  }
};


