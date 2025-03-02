import { Request, Response, NextFunction, RequestHandler } from 'express';
import { TenantRole } from '../config/tenant-roles';
import { ErrorResponse } from '../utils/error';

export const authorizeTenantRole = (roles: TenantRole[]): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user; // Assuming user is attached to the request by auth middleware
    if (!user?.tenantId || !user?.tenantRole) {
      res.status(403).send(new ErrorResponse('Unauthorized: Tenant or role information missing'));
      return;
    }

    if (!roles.includes(user.tenantRole)) {
      res.status(403).send(new ErrorResponse('Unauthorized: Insufficient role'));
      return;
    }

    return next();
  };
};
