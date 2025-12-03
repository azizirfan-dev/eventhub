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

    // === REFERRAL LOGIC ===
    let referredByUserId: string | undefined = undefined;
    let newUserPromo: any = null;

    if (referralCode) {
      const refUser = await this.prisma.user.findUnique({
        where: { referralCode },
      });
      if (!refUser) throw new AppError("Invalid referral code", 400);

      referredByUserId = refUser.id;

      // Add points to referrer + expiry 3 months
      await this.prisma.pointHistory.create({
        data: {
          userId: refUser.id,
          amount: 10000,
          reason: "Referral reward",
          expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        },
      });
    }

    // === CREATE NEW USER ===
    const user = await this.prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        referralCode: newReferralCode,
        referredById: referredByUserId,
      },
    });

    // === GIVE NEW USER PROMO (EXP 3 MONTHS) ===
    newUserPromo = await this.prisma.promo.create({
      data: {
        code: `REF-${newReferralCode}`,
        discount: 20000, // editable
        isPercent: false,
        usageLimit: 1, // cuma sekali dipakai
        startDate: new Date(),
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        organizerId: user.id, // owner promo = user sendiri
        eventId: "GLOBAL", // nanti dipakai di FE untuk semua event
      },
    });

    // === GEN TOKEN ===
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      message: "Register success",
      user,
      promo: newUserPromo,
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
