import { Router } from 'express';
import * as rankingController from '../controllers/rankingController.js';
import { authenticate, requireOrgAdmin } from '../middleware/auth.js';
import { optionalAuthenticate } from '../middleware/optionalAuth.js';

const router = Router();

router.get('/', optionalAuthenticate, rankingController.leaderboard);
router.post('/refresh', authenticate, requireOrgAdmin, rankingController.updateRankings);

export default router;
