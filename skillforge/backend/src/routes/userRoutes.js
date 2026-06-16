import { Router } from 'express';
import * as userController from '../controllers/userController.js';
import { authenticate, requireOrgAdmin, requireSuperAdmin } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/dashboard', userController.getDashboard);
router.get('/profile', userController.getProfile);
router.get('/profile/:id', userController.getProfile);
router.put('/profile', userController.updateProfile);
router.get('/', requireOrgAdmin, userController.listUsers);
router.put('/:id', requireOrgAdmin, userController.updateUser);
router.delete('/:id', requireSuperAdmin, userController.deleteUser);

export default router;
