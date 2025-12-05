import { BaseService } from "../../core/base.service";
import { hashPassword, comparePassword } from "../../utils/password";

export class UserService extends BaseService {

    async getProfile(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                pointHistories: true,
                referrals: true
            }
        });
        if (!user) throw new Error("User not found");

        return user;
    }

    async updateProfile(userId: string, data: any) {
        const { name, email } = data;

        const updated = await this.prisma.user.update({
            where: { id: userId },
            data: { name, email },
        });

        return updated;
    }

    async updatePassword(userId: string, oldPass: string, newPass: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) throw new Error(" User not found ");

        const isMatch = await comparePassword(oldPass, user.password);
        if (!isMatch) throw new Error(" Password is incorrect ");

        const hashed = await hashPassword(newPass);

        return await this.prisma.user.update({
            where: { id: userId },
            data: { password: hashed },
        });
    }

    async getReferralStats(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                referrals: true,
                pointHistories: true,
            }
        });

        if (!user) throw new Error(" User not found ")

        return {
            totalRefferals: user.referrals.length,
            points: user.points,
            pointHistory: user.pointHistories,
        };
    }
}

