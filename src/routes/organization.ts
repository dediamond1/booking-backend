import express from 'express';
import { deleteOrganization, getOrganization, registerOrganization, updateOrganization } from '../controllers/organization.controller';

const router = express.Router();

router.post('/register', registerOrganization);
router.get('/:organizationId', getOrganization);
router.put('/:organizationId', updateOrganization);
router.delete('/:organizationId', deleteOrganization);

export default router;
