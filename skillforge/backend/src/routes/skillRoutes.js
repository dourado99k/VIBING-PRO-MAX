import { Router } from 'express';
import * as skillController from '../controllers/skillController.js';
import { authenticate, requireOrgAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, skillController.list);
router.post('/:id/unlock', authenticate, skillController.unlock);
router.post('/', authenticate, requireOrgAdmin, skillController.create);
router.put('/:id', authenticate, requireOrgAdmin, skillController.update);
router.delete('/:id', authenticate, requireOrgAdmin, skillController.remove);

export default router;
