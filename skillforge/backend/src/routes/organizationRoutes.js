import { Router } from 'express';
import * as organizationController from '../controllers/organizationController.js';
import { authenticate, requireOrgAdmin } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/me', organizationController.getMine);
router.get('/stats', organizationController.getStats);
router.put('/me', requireOrgAdmin, organizationController.updateMine);

export default router;
