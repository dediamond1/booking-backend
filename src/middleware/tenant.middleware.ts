import { NextFunction, Request, Response } from 'express';
import Tenant from '../models/tenant.model';
import { connectToTenantDatabase } from '../utils/tenant-connection';
import { ITenant } from '../models/tenant.model';

// Middleware to identify tenant and establish database connection
export const tenantMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Extract tenant identifier from subdomain or header
    const tenantIdentifier = req.headers['x-tenant-id'] || req.subdomains[0];
    
    if (!tenantIdentifier) {
      return res.status(400).json({ 
        error: 'Tenant identifier is required' 
      });
    }

    // Find tenant in master database
    const tenant = await Tenant.findOne({ 
      $or: [
        { tenantId: tenantIdentifier },
        { domain: tenantIdentifier }
      ]
    }).exec();

    if (!tenant) {
      return res.status(404).json({ 
        error: 'Tenant not found' 
      });
    }

    // Establish connection to tenant's database
    const tenantDb = await connectToTenantDatabase(tenant.databaseUrl);
    
    // Attach tenant context to request
    req.tenant = {
      id: tenant.tenantId,
      name: tenant.name,
      db: tenantDb,
      config: {
        timezone: tenant.timezone,
        currency: tenant.currency,
        businessHours: tenant.businessHours
      }
    };

    // Cleanup database connection when request completes
    res.on('finish', () => {
      if (req.tenant?.db) {
        req.tenant.db.close();
      }
    });

    next();
  } catch (error) {
    console.error('Tenant middleware error:', error);
    res.status(500).json({ 
      error: 'Failed to establish tenant context' 
    });
  }
};

// Type augmentation for Express Request
declare global {
  namespace Express {
    interface Request {
      tenant?: {
        id: string;
        name: string;
        db: any;
        config: {
          timezone?: string;
          currency?: string;
          businessHours?: any;
        };
      };
    }
  }
}
