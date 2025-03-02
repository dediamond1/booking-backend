import express, { RequestHandler } from 'express';
import { createUserHandler, loginUserHandler, acceptTenantInvitation, changePasswordAfterAcceptance, getUser } from '../controllers/user.controller';
import { verifyEmail } from '../controllers/verification.controller';
import authMiddleware from '../middleware/auth.middleware'; // Import authMiddleware

const router = express.Router();

// User registration route with validation middleware
router.post('/register', createUserHandler);
router.post('/login', loginUserHandler); // Login route
router.get('/verify-email', verifyEmail); // Moved verification route here
router.post('/accept-invitation', acceptTenantInvitation); // Accept tenant invitation route
router.post('/change-password-after-acceptance', changePasswordAfterAcceptance as RequestHandler); // Change password after accepting invitation route, casting to RequestHandler
router.get('/users/me/:id', authMiddleware, getUser); // Add /api/users/me route, protected by authMiddleware


export default router;
