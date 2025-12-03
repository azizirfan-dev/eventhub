import multer from "multer";
import { uploadToCloudinary } from "../utils/cloudinary";
import { Request, Response, NextFunction } from "express";

const storage = multer.memoryStorage();
export const uploadCloud = multer({ storage });

export const cloudinaryUploader = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) return next();

    const urls: string[] = [];
    for (const file of files) {
      const url = await uploadToCloudinary(file.buffer, "payment-proofs");
      urls.push(url);
    }

    req.cloudinaryUrls = urls; 
    next();
  } catch (err) {
    return res.status(500).json({ message: "Cloudinary upload failed" });
  }
};
