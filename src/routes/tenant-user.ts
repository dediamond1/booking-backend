import express from 'express';
import { inviteTenantUser, getTenantUser, updateTenantUser, deleteTenantUser, getAllTenantUsers, getAllTenantUsersForOrganization } from '../controllers/tenant-user.controller';
import { authorizeTenantRole } from '../middleware/tenant-auth.middleware';
import { TenantRole } from '../config/tenant-roles';

const router = express.Router();

router.post('/:organizationId/tenants/:tenantId/users/invite', authorizeTenantRole([TenantRole.TENANT_ADMIN]), inviteTenantUser);
router.get('/tenants/:tenantId/users/:userId', authorizeTenantRole([TenantRole.TENANT_ADMIN, TenantRole.TENANT_MANAGER, TenantRole.STAFF]), getTenantUser);
router.put('/tenants/:tenantId/users/:userId', authorizeTenantRole([TenantRole.TENANT_ADMIN, TenantRole.TENANT_MANAGER]), updateTenantUser);
router.delete('/tenants/:tenantId/users/:userId', authorizeTenantRole([TenantRole.TENANT_ADMIN]), deleteTenantUser);
router.get('/tenants/:tenantId/users', authorizeTenantRole([TenantRole.TENANT_ADMIN, TenantRole.TENANT_MANAGER]), getAllTenantUsers);
router.get('/organizations/:organizationId/tenants/users', authorizeTenantRole([TenantRole.TENANT_ADMIN]), getAllTenantUsersForOrganization);


export default router;
