import { Router } from 'express';
import * as courtController from '../controllers/courtController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = Router();

router.get('/', authMiddleware, courtController.list);
router.get('/:id', authMiddleware, courtController.getById);
router.post('/', authMiddleware, adminMiddleware, courtController.create);
router.put('/:id', authMiddleware, adminMiddleware, courtController.update);
router.delete('/:id', authMiddleware, adminMiddleware, courtController.remove);

export default router;
