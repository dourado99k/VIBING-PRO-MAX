import { Router } from 'express';
import * as bookingController from '../controllers/bookingController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);

router.get('/dashboard/stats', adminMiddleware, bookingController.dashboard);
router.get('/my', bookingController.myBookings);
router.get('/', bookingController.list);
router.get('/:id', bookingController.getById);
router.post('/', bookingController.create);
router.put('/:id/status', adminMiddleware, bookingController.updateStatus);
router.delete('/:id', bookingController.remove);

export default router;
