import { Router } from "express";
import { DashboardController } from "./dashboard.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();
const controller = new DashboardController();

router.get("/", authMiddleware, controller.getDashboard);

export default router;
