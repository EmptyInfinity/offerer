import express, { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import multer from 'multer';
import util from 'util';
import asyncHandler from '../../helpers/asyncHandler';
import { SuccessResponse } from '../../handlers/ApiResponse';
import { MAX_IMAGE_SIZE_IN_BYTES } from '../../helpers/constants';
import { uploadFile, getFileStream } from '../../helpers/s3';

const unlinkFile = util.promisify(fs.unlink);
const uploadImage = multer({
  dest: 'uploads/',
  limits: { fileSize: MAX_IMAGE_SIZE_IN_BYTES },
}).single('image');

const router = express.Router();

router.get('/:key', (req, res) => {
  const { key } = req.params;
  const readStream = getFileStream(key);
  readStream.pipe(res);
});

// eslint-disable-next-line consistent-return
router.post('/', uploadImage, asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { file } = req;
  try {
    const result = await uploadFile(file);
    return SuccessResponse(res, 200, { imagePath: `/avatars/${result.Key}` });
  } catch (err) {
    return next(err);
  } finally {
    await unlinkFile(file.path);
  }
}));


export default router;
