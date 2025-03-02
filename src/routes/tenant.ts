import express from 'express';
import { getTenant, registerTenant, updateTenant, deleteTenant } from '../controllers/tenant.controller';

const router = express.Router();

router.post('/register', registerTenant);
router.get('/:tenantId', getTenant);
router.put('/:tenantId', updateTenant);
router.delete('/:tenantId', deleteTenant);

export default router;
