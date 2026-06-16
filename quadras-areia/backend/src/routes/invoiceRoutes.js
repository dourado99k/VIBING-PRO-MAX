import { Router } from 'express';
import * as invoiceController from '../controllers/invoiceController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);

router.get('/list', adminMiddleware, invoiceController.listAll);
router.post('/', adminMiddleware, invoiceController.create);
router.get('/:bookingId', invoiceController.getByBooking);
router.put('/:id/status', adminMiddleware, invoiceController.updateStatus);

export default router;
