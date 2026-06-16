import { Router } from 'express';
import * as missionController from '../controllers/missionController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', missionController.list);
router.post('/:id/favorite', missionController.toggleFavorite);
router.post('/', missionController.create);
router.put('/:id', missionController.update);
router.delete('/:id', missionController.remove);
router.post('/:id/complete', missionController.complete);

export default router;
