import "express";
import { Promo } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
      cloudinaryUrls?: string[];
      promo?: Promo;
    }
  }
}
