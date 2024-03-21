import { Request, Response, NextFunction } from 'express';
import { Middleware } from './middleware.interface.js';
import multer from 'multer';
import path from 'path';

export class UploadFileMiddleware implements Middleware {
  constructor(
    private readonly uploadDirectory: string,
    private readonly fieldName: string,
  ) {}

  async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
    const storage = multer.diskStorage({
      destination: (req, file, callback) => {
        return callback(null, this.uploadDirectory);
      },
      filename: (req, file, callback) => {
        file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');

        const originalFileName = file.originalname.split('.')[0];
        const fileName = `${originalFileName}-${Date.now()}${path.extname(file.originalname)}`;

        return callback(null, fileName);
      },
    });

    const uploadSingleFileMiddleware = multer({ storage }).single(this.fieldName);

    uploadSingleFileMiddleware(req, res, next);
  }
}
