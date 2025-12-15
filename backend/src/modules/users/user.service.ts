import { BaseService } from "../../core/base.service";
import { hashPassword, comparePassword } from "../../utils/password";
import { uploadToCloudinary } from "../../utils/cloudinary";
import { AppError } from "../../utils/app-error";

export class UserService extends BaseService {

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        pointHistories: true,
        referrals: true,
      },
    });

    if (!user) throw new AppError("User not found", 404);
    return user;
  }

  async updateProfile(userId: string, data: any) {
    const { name } = data;

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: { name },
    });

    return updated;
  }

  async updatePassword(userId: string, oldPass: string, newPass: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new AppError("User not found", 404);

    const isMatch = await comparePassword(oldPass, user.password);
    if (!isMatch) throw new AppError("Old password is incorrect", 400);

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
      },
    });

    if (!user) throw new AppError("User not found", 404);

    return {
      totalReferrals: user.referrals.length,
      points: user.points,
      pointHistory: user.pointHistories,
    };
  }

  // 🔥 FIXED AVATAR UPLOAD
  async updateAvatar(userId: string, file: Express.Multer.File) {
    if (!file) {
      throw new AppError("Avatar file is required", 400);
    }

    // upload buffer → cloudinary
    const avatarUrl = await uploadToCloudinary(file.buffer, "avatars");

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: { avatarUrl },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
        referralCode: true,
        points: true,
      },
    });

    return updated;
  }
}
