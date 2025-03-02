import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import User from '../models/user.model'; // Import User model

export interface AuthRequest extends Request { // Export AuthRequest interface
  userId?: string; // Extend the Request interface to include userId
}

const authMiddleware = async (req: any, res: any, next: any) => { // Declare as async
  const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header

  if (!token) {
    return res.status(401).json({ message: 'No token provided, authorization denied' });
  }

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not configured');
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string }; // Verify token
    const user = await User.findById(decoded.userId).select('-password'); // Fetch user from DB without password
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    req.user = user; // Attach the user object to the request
    next(); // Proceed to the next middleware or controller
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' }); // Token verification failed
  }
};

export default authMiddleware;
