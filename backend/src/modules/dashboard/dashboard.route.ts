import { Router } from "express";
import { DashboardController } from "./dashboard.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();
const controller = new DashboardController();

router.get("/statistics", authMiddleware, controller.getDashboard);

export default router;
