import { Router } from 'express';
import * as paymentController from '../controllers/paymentController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);

router.get('/list', adminMiddleware, paymentController.listAll);
router.post('/', paymentController.createPayment);
router.get('/:bookingId', paymentController.getByBooking);
router.put('/:id/status', adminMiddleware, paymentController.updateStatus);

export default router;
