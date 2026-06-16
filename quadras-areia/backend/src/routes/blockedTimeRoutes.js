import { Router } from 'express';
import * as blockedTimeController from '../controllers/blockedTimeController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware, adminMiddleware);

router.get('/', blockedTimeController.list);
router.post('/', blockedTimeController.create);
router.delete('/:id', blockedTimeController.remove);

export default router;
