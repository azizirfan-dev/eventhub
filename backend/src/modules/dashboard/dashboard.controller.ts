import { Request, Response } from "express";
import { BaseController } from "../../core/base.controller";
import { DashboardService } from "./dashboard.service";
import { AppError } from "../../utils/app-error";

export class DashboardController extends BaseController {
  private service = new DashboardService();

  getDashboard = async (req: Request, res: Response) => {
    try {
      const organizerId = req.user?.id;
      if (!organizerId) throw new AppError("Unauthorized", 401);

      const result = await this.service.getOrganizerDashboard(organizerId);
      return this.sendSuccess(res, result, "Dashboard loaded");
    } catch (error) {
      return this.sendError(res, error);
    }
  };
}
