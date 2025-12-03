import { Request, Response, NextFunction } from "express";
import { BaseController } from "../../core/base.controller";
import { AuthService } from "./auth.service";
import {
  RegisterDTO,
  LoginDTO,
  ForgotPasswordDTO,
  VerifyOtpDTO,
  ResetPasswordDTO,
} from "./auth.dto";

export class AuthController extends BaseController {
  private authService: AuthService;

  constructor() {
    super();
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body as RegisterDTO;
    const result = await this.authService.register(payload);
    return this.sendSuccess(res, result, "Register success");
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body as LoginDTO;
    const result = await this.authService.login(payload);
    return this.sendSuccess(res, result, "Login success");
  };

  forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body as ForgotPasswordDTO;
    const result = await this.authService.forgotPassword(payload);
    return this.sendSuccess(res, result, "OTP sent to email");
  };

  verifyOTP = async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body as VerifyOtpDTO;
    const result = await this.authService.verifyOTP(payload);
    return this.sendSuccess(res, result, "OTP valid");
  };

  resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body as ResetPasswordDTO;
    const result = await this.authService.resetPassword(payload);
    return this.sendSuccess(res, result, "Password reset successful");
  };
}
