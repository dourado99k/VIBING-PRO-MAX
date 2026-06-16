import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const UPLOAD_ROOT = path.join(__dirname, '../../uploads');

const ALLOWED_MIMES = {
  'application/pdf': 'PDF',
  'image/jpeg': 'IMAGE',
  'image/jpg': 'IMAGE',
  'image/png': 'IMAGE',
  'image/webp': 'IMAGE',
  'image/gif': 'IMAGE',
};

export function contentTypeFromMime(mime) {
  return ALLOWED_MIMES[mime] || null;
}

const storage = multer.diskStorage({
  destination(req, _file, cb) {
    const orgId = req.user?.organizationId || 'platform';
    const dir = path.join(UPLOAD_ROOT, orgId);
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename(_req, file, cb) {
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${Date.now()}-${safe}`);
  },
});

export const uploadContent = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter(_req, file, cb) {
    if (ALLOWED_MIMES[file.mimetype]) cb(null, true);
    else cb(new Error('Apenas PDF e imagens (JPG, PNG, WebP, GIF) são permitidos'));
  },
});
