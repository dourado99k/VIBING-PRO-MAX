import { Router } from 'express';
import * as availabilityController from '../controllers/availabilityController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.get('/', authMiddleware, availabilityController.getSlots);

export default router;
