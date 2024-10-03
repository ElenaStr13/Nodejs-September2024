import { NextFunction, Request, Response } from "express";
import { UploadedFile } from "express-fileupload";

import { avatarConfig } from "../constants/file.constant";
import { ApiError } from "../errors/api-error";

class FileMiddleware {
  public isFileValid() {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        const avatar = req.files?.avatar as UploadedFile;
        if (!avatar) {
          throw new ApiError("Empty file", 400);
        }
        if (Array.isArray(avatar)) {
          throw new ApiError("Must be not array", 400);
        }
        if (!avatarConfig.MIMETYPE.includes(avatar.mimetype)) {
          throw new ApiError("Invalid file format", 400);
        }
        if (avatar.size > avatarConfig.MAX_SIZE) {
          throw new ApiError("File is too large", 400);
        }
        next();
      } catch (e) {
        next(e);
      }
    };
  }
}

export const fileMiddleware = new FileMiddleware();