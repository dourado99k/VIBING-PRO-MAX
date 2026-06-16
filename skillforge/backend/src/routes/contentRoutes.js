import { Router } from 'express';
import * as contentController from '../controllers/contentController.js';
import { authenticate, requireOrgAdmin } from '../middleware/auth.js';
import { uploadContent } from '../config/upload.js';

const router = Router();

router.use(authenticate);

router.get('/', contentController.list);
router.get('/:id', contentController.getOne);
router.post('/upload', requireOrgAdmin, uploadContent.single('file'), contentController.upload);
router.put('/:id', requireOrgAdmin, contentController.update);
router.delete('/:id', requireOrgAdmin, contentController.remove);

export default router;
