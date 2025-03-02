import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { IUser } from '../models/user.model';

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

interface TokenPayload {
  userId: string;
  email: string;
  tenants: mongoose.Types.ObjectId[];
}

// Extend IUser interface with tenants property
declare module '../models/user.model' {
  interface IUser {
    tenants: mongoose.Types.ObjectId[];
    _id: mongoose.Types.ObjectId;
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

export function generateAuthTokens(user: IUser): Tokens {
  const payload: TokenPayload = {
    userId: user._id.toString(),
    email: user.email,
    tenants: user.tenants
  };

  const accessToken = jwt.sign(payload, JWT_SECRET, { 
    expiresIn: ACCESS_TOKEN_EXPIRY 
  });
  const refreshToken = jwt.sign(payload, JWT_SECRET, { 
    expiresIn: REFRESH_TOKEN_EXPIRY 
  });
  
  return { accessToken, refreshToken };
}

export function generateVerificationToken(user: IUser): string {
  const payload: TokenPayload = {
    userId: user._id.toString(),
    email: user.email,
    tenants: user.tenants
  };

  return jwt.sign(payload, JWT_SECRET, { 
    expiresIn: '1h' 
  });
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
}

export function refreshAccessToken(refreshToken: string): string {
  const payload = verifyToken(refreshToken);
  return jwt.sign(payload, JWT_SECRET, { 
    expiresIn: ACCESS_TOKEN_EXPIRY 
  });
}
