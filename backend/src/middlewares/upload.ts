import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

const ALLOWED_MIMETYPES: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
};

const storage = multer.diskStorage({
  destination: path.resolve(__dirname, '..', '..', 'uploads'),
  filename: (req, file, cb) => {
   
    const ext = ALLOWED_MIMETYPES[file.mimetype] ?? '';
    cb(null, `${crypto.randomUUID()}${ext}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (ALLOWED_MIMETYPES[file.mimetype]) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não suportado. Use JPEG, PNG, WEBP ou GIF.'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

export { upload };
