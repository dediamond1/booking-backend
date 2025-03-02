import express from 'express';
import { verifyEmail } from '../controllers/verification.controller';

const router = express.Router();

router.get('/verify-email', verifyEmail);

export default router;
