import multer from 'multer';

export const upload = multer({ dest: './public/data/uploads/' });
