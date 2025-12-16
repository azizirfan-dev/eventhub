import { Request, Response } from "express";
import { BaseController } from "../../core/base.controller";
import { UserService } from "./user.service";

export class UserController extends BaseController {
  private userService: UserService;

  constructor() {
    super();
    this.userService = new UserService();
  }

  getProfile = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id!;
      const result = await this.userService.getProfile(userId);
      return this.sendSuccess(res, result, "Profile loaded");
    } catch (error) {
      return this.sendError(res, error);
    }
  };

  updateProfile = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id!;
      const result = await this.userService.updateProfile(userId, req.body);
      return this.sendSuccess(res, result, "Profile updated");
    } catch (error) {
      return this.sendError(res, error);
    }
  };

  updatePassword = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id!;
      const { oldPass, newPass } = req.body;
      const result = await this.userService.updatePassword(userId, oldPass, newPass);
      return this.sendSuccess(res, result, "Password updated");
    } catch (error) {
      return this.sendError(res, error);
    }
  };

  getReferralStats = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id!;
      const result = await this.userService.getReferralStats(userId);
      return this.sendSuccess(res, result, "Referral stats loaded");
    } catch (error) {
      return this.sendError(res, error);
    }
  };
  
updateAvatar = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id!;
    const file = req.file as Express.Multer.File;

    if (!file) {
      return this.sendError(res, "No file uploaded", 400);
    }
    const result = await this.userService.updateAvatar(userId, file);

    return this.sendSuccess(res, result, "Avatar updated");
  } catch (error) {
    return this.sendError(res, error);
  }
};

}
