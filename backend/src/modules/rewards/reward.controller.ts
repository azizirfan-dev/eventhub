import { Request, Response } from "express";
import { BaseController } from "../../core/base.controller";
import { RewardService } from "./reward.service";

export class RewardController extends BaseController {
  private service = new RewardService();

  getRewards = async (req: Request, res: Response) => {
    const result = await this.service.getRewards();
    return this.sendSuccess(res, result);
  };

  claimReward = async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { rewardId } = req.params;
    const result = await this.service.claimReward(userId, rewardId);
    return this.sendSuccess(res, result, "Reward claimed");
  };
}
