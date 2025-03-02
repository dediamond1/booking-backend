import express from 'express';
import { getTenantSettings, updateTenantSettings } from '../controllers/tenant-settings.controller.js';
import { authorizeTenantRole } from '../middleware/tenant-auth.middleware.js';
import { TenantRole } from '../config/tenant-roles.js';

const router = express.Router();

router.get('/:tenantId/settings', authorizeTenantRole([TenantRole.TENANT_ADMIN, TenantRole.TENANT_MANAGER]), getTenantSettings);
router.put('/:tenantId/settings', authorizeTenantRole([TenantRole.TENANT_ADMIN]), updateTenantSettings);

export default router;
