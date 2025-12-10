import { BaseService } from "../../core/base.service";
import { AppError } from "../../utils/app-error";

export class RewardService extends BaseService {

  async getRewards() {
    return this.prisma.reward.findMany({
      where: { stock: { gt: 0 } },
      orderBy: { points: "asc" }
    });
  }

  async claimReward(userId: string, rewardId: string) {
    const reward = await this.prisma.reward.findUnique({ where: { id: rewardId } });
    if (!reward) throw new AppError("Reward not found", 404);

    if (reward.stock <= 0)
      throw new AppError("Reward out of stock", 400);

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppError("User not found", 404);

    if (user.points < reward.points)
      throw new AppError("Not enough points", 400);

    return this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: { points: user.points - reward.points },
      });

      await tx.reward.update({
        where: { id: rewardId },
        data: { stock: reward.stock - 1 },
      });

      await tx.rewardClaim.create({
        data: { userId, rewardId },
      });

      await tx.pointHistory.create({
        data: {
          userId,
          amount: -reward.points,
          reason: `Redeemed: ${reward.name}`,
        },
      });

      return { message: "Reward claimed successfully" };
    });
  }
}
