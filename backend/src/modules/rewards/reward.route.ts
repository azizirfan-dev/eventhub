import { Router } from "express";
import { RewardController } from "./reward.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();
const controller = new RewardController();

router.get("/", authMiddleware, controller.getRewards);
router.post("/:rewardId/claim", authMiddleware, controller.claimReward);

export default router;
