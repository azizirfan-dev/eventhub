import { Router } from "express";
import { AuthController } from "./auth.controller";
import { registerValidator, loginValidator } from "../../validators/auth.validator";
import { validate } from "../../middlewares/validator.middleware";

const router = Router();
const controller = new AuthController();


router.post("/register", registerValidator, validate, controller.register);
router.post("/login", loginValidator, validate, controller.login);

router.post("/forgot-password", controller.forgotPassword);
router.post("/verify-otp", controller.verifyOTP);
router.post("/reset-password", controller.resetPassword);

export default router;
