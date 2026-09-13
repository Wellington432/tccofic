// upload/multerConfig.ts
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDir = path.resolve(__dirname, '..', '..', 'uploads', 'comprovantes');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

export const uploadComprovante = multer({
  storage: multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const idCompra = req.params.id_compra;
      cb(null, `${idCompra}-${Date.now()}${ext}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    const permitidos = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
    if (!permitidos.includes(file.mimetype)) {
      return cb(new Error('Formato inválido. Envie PNG, JPG ou PDF.'));
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});
