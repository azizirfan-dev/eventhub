import { BaseService } from "../../core/base.service";
import { hashPassword, comparePassword } from "../../utils/password";
import { generateToken } from "../../utils/jwt";
import { generateReferralCode } from "../../utils/referral";
import { sendEmail } from "../../utils/email";
import { AppError } from "../../utils/app-error";
import bcrypt from "bcrypt";
import { RegisterDTO, LoginDTO, ForgotPasswordDTO, VerifyOtpDTO, ResetPasswordDTO } from "./auth.dto";

export class AuthService extends BaseService {
  async register(data: RegisterDTO) {
  const { email, password, name, referralCode } = data;

  if (!email || !password || !name) {
    throw new AppError("Missing required fields", 400);
  }

  const exist = await this.prisma.user.findUnique({ where: { email } });
  if (exist) throw new AppError("Email already registered", 409);

  const hashedPassword = await hashPassword(password);
  const newReferralCode = generateReferralCode(name);

  // === CREATE NEW USER FIRST ===
  const user = await this.prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
      referralCode: newReferralCode,
    },
  });

  // === REFERRAL: After user created ===
  if (referralCode) {
    const referrer = await this.prisma.user.findUnique({
      where: { referralCode },
    });

    if (!referrer) throw new AppError("Invalid referral code", 400);

    // Link referral relationship
    await this.prisma.user.update({
      where: { id: user.id },
      data: { referredById: referrer.id },
    });

    const expiry = new Date();
    expiry.setMonth(expiry.getMonth() + 3);

    // 💰 10k points to referrer (with expiry)
    await this.prisma.user.update({
      where: { id: referrer.id },
      data: { points: { increment: 10000 } },
    });

    await this.prisma.pointHistory.create({
      data: {
        userId: referrer.id,
        amount: 10000,
        reason: "Referral reward",
        expiresAt: expiry,
      },
    });

    // 🎟 Referral Promo for NEW USER
    await this.prisma.promo.create({
      data: {
        code: `REF-${Date.now()}`,
        discount: 50000,
        isPercent: false,
        isGlobal: true,
        startDate: new Date(),
        endDate: expiry,
        lockedToUserId: user.id,
      },
    });
  }

  // === TOKEN ===
  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    message: "Register success",
    user,
    token,
  };
}

  async login(data: LoginDTO) {
    const { email, password } = data;

    if (!email || !password) {
      throw new AppError("Email and password required", 400);
    }
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new AppError("Invalid email or password", 401);

    const validPass = await comparePassword(password, user.password);
    if (!validPass) throw new AppError("Invalid email or password", 401);

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    return {
      message: "Login success",
      user,
      token,
    };
  }

  private generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async forgotPassword(data: ForgotPasswordDTO) {
    const { email } = data;

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new AppError("Email not found", 404);

    const otp = this.generateOTP();
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    await this.prisma.user.update({
      where: { email },
      data: {
        resetPasswordOtp: otp,
        resetPasswordExpires: expires,
      },
    });

    await sendEmail(
      email,
      "EventHub Password Reset",
      `Hi ${user.name}, your OTP is: ${otp}. It expires in 10 minutes.`
    );

    return { message: "OTP sent to email" };
  }

  async verifyOTP(data: VerifyOtpDTO) {
    const { email, otp } = data;

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || user.resetPasswordOtp !== otp) {
      throw new AppError("Invalid OTP", 400);
    }

    if (user.resetPasswordExpires && user.resetPasswordExpires < new Date()) {
      throw new AppError("OTP expired", 400);
    }

    return { message: "OTP valid" };
  }

  async resetPassword(data: ResetPasswordDTO) {
    const { email, otp, newPassword } = data;

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new AppError("User not found", 404);

    if (user.resetPasswordOtp !== otp)
      throw new AppError("Invalid OTP", 400);

    if (user.resetPasswordExpires && user.resetPasswordExpires < new Date()) {
      throw new AppError("OTP expired", 400);
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { email },
      data: {
        password: hashed,
        resetPasswordOtp: null,
        resetPasswordExpires: null,
      },
    });

    return { message: "Password reset successful" };
  }
}
