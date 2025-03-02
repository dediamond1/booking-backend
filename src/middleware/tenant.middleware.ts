import { Request, Response, NextFunction } from 'express';

const getTenantId = (req: Request): string | undefined => {
  // Implement logic to extract tenantId from request
  // Example: from a header
  const tenantId = req.headers['x-tenant-id'] as string | undefined;
  return tenantId;
};

const tenantMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user; // Get user from req.user (populated by authMiddleware)

  if (!user) {
    return res.status(401).send({ message: 'Unauthorized: User information missing' }); // User should be authenticated
  }

  const tenantId = user.tenantId; // Extract tenantId from req.user
  const tenantRole = user.tenantRole; // Extract tenantRole from req.user

  if (!tenantId) {
    return res.status(400).send({ message: 'Tenant ID is required' }); // TenantId should be present in user object
  }
  if (!tenantRole) {
    return res.status(400).send({ message: 'Tenant Role is required' }); // TenantRole should be present in user object
  }

  // Make tenantId and tenantRole available to the request
  (req as any).tenantId = tenantId;
  (req as any).tenantRole = tenantRole;

  next();
};

export default tenantMiddleware;
