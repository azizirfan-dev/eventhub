import { Router } from "express";
import { UserController } from "./user.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { uploadCloud } from "../../middlewares/upload.middleware"; // multer

const router = Router();
const userController = new UserController();

// Profile info
router.get("/me", authMiddleware, userController.getProfile);
router.patch("/me", authMiddleware, userController.updateProfile);

// Password change
router.patch("/me/password", authMiddleware, userController.updatePassword);

// Avatar upload (with multer)
router.patch(
  "/me/avatar",
  authMiddleware,
  uploadCloud.single("avatar"),
  userController.updateAvatar
);

// Referral stats
router.get("/me/referrals", authMiddleware, userController.getReferralStats);

export default router;
