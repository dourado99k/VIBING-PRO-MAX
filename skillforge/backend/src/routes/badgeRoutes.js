import { Router } from 'express';
import * as badgeController from '../controllers/badgeController.js';
import { authenticate, requireOrgAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, badgeController.list);
router.post('/', authenticate, requireOrgAdmin, badgeController.create);
router.put('/:id', authenticate, requireOrgAdmin, badgeController.update);
router.delete('/:id', authenticate, requireOrgAdmin, badgeController.remove);
router.post('/award', authenticate, requireOrgAdmin, badgeController.award);

export default router;
