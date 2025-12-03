import { Router } from "express";
import { UserController } from "./user.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();
const userController = new UserController();

router.get("/profile", authMiddleware, userController.getProfile);
router.put("/profile", authMiddleware, userController.updateProfile);
router.put("/password", authMiddleware, userController.updatePassword);
router.get("/referrals", authMiddleware, userController.getReferralStats);

export default router;
