import { Router } from 'express';
import * as userController from '../controllers/userController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);

router.get('/', adminMiddleware, userController.list);
router.get('/:id', userController.getById);
router.put('/:id', userController.update);
router.delete('/:id', adminMiddleware, userController.remove);

export default router;
