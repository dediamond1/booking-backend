import express from 'express';
import AuthController from '../controllers/auth.controller';
import { verifyEmail } from '../controllers/verification.controller';
import authMiddleware from '../middleware/auth.middleware';

const router = express.Router();

// Properly typed async handler that returns void
const asyncHandler = (fn: express.RequestHandler) => 
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    Promise.resolve(fn(req, res, next))
      .then(() => {
        if (!res.headersSent) {
          next();
        }
      })
      .catch(next);
  };

// Authentication routes
router.post('/register', asyncHandler(AuthController.register as any));
router.post('/login', asyncHandler(AuthController.login as any));
router.get('/verify-email', asyncHandler(verifyEmail));

// Add these routes only if implemented in controller
if ('acceptInvitation' in AuthController) {
  router.post('/accept-invitation', asyncHandler(AuthController.acceptInvitation as any));
}
if ('changePassword' in AuthController) {
  router.post('/change-password', asyncHandler(AuthController.changePassword as any));
}
if ('getCurrentUser' in AuthController) {
  router.get('/me', authMiddleware, asyncHandler(AuthController.getCurrentUser as any));
}

export default router;
