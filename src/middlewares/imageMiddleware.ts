import cloudinary from 'cloudinary';
import { Request, Response, NextFunction } from 'express';
import Config from '../config';
import { Logger } from '../utils/logger';
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.cwd() + '/assets/images');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

class ImageMiddleware {
  constructor() {
    cloudinary.v2.config({
      cloud_name: Config.CLOUDINARY_CLOUD_NAME,
      api_key: Config.CLOUDINARY_API_KEY,
      api_secret: Config.CLOUDINARY_API_SECRET
    });
  }

  upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, //! limite 5MB
    fileFilter: async (req, file, cb) => {
      if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        return cb(new Error('Please upload an image'));
      }
      await cb(undefined, true);
    }
  });

  async uploadImage(req: Request, res: Response, next: NextFunction) {
    try {
      const data = { image: req.file.path };
      Logger.debug(`Uploading image ${data.image}`);
      if (!data.image) return res.status(400).json({ msg: 'missing image' });
      await cloudinary.v2.uploader.upload(data.image, (err: any, result: any) => {
        if (err) return res.status(400).json({ msg: 'error uploading image', err });
        req.body.image = result.secure_url;
        req.body.cloudinary_result = result;
        next();
      });
    } catch (err: any) {
      Logger.error(err);
      return res.status(400).json({ msg: 'error uploading image', err });
    }
  }

  async deleteImage(req: Request, res: Response, next: NextFunction) {
    Logger.debug(`Deleting image ${req.body.image}`);
    try {
      const data = { image: req.body.image };
      if (!data.image) return res.status(400).json({ msg: 'missing image name' });
      await cloudinary.v2.uploader.destroy(data.image, (err: any, result: any) => {
        if (err) return res.status(400).json({ msg: 'error deleting image' });
      });
      next();
    } catch (err: any) {
      Logger.error(err);
      return res.status(400).json({ msg: 'error deleting image', err });
    }
  }
}

export const imageMiddleware = new ImageMiddleware();
