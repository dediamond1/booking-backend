import { Request } from 'express';
import crypto from 'crypto';

export interface DeviceInfo {
  fingerprint: string;
  lastLogin: Date;
  userAgent?: string;
  ipAddress?: string;
}

export function generateDeviceFingerprint(req: Request): string {
  // Create fingerprint from user agent and IP address
  const userAgent = req.headers['user-agent'] || '';
  const ipAddress = req.ip;
  
  // Combine and hash the values
  const combined = `${userAgent}-${ipAddress}`;
  return crypto.createHash('sha256').update(combined).digest('hex');
}

export function validateDeviceFingerprint(
  storedFingerprint: string,
  currentFingerprint: string
): boolean {
  return storedFingerprint === currentFingerprint;
}

export function createDeviceInfo(req: Request): DeviceInfo {
  return {
    fingerprint: generateDeviceFingerprint(req),
    lastLogin: new Date(),
    userAgent: req.headers['user-agent']?.toString(),
    ipAddress: req.ip
  };
}
