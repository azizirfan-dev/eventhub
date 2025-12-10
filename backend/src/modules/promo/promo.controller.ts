import { Request, Response } from "express";
import { BaseController } from "../../core/base.controller";
import { PromoService } from "./promo.service";
import { AppError } from "../../utils/app-error";

export class PromoController extends BaseController {
  private service = new PromoService();

  create = async (req: Request, res: Response) => {
    const organizerId = req.user?.id;
    if (!organizerId) throw new AppError("Unauthorized", 401);

    const result = await this.service.create(organizerId, req.body);
    this.sendSuccess(res, result, "Promo created");
  };

  getMyPromos = async (req: Request, res: Response) => {
    const organizerId = req.user!.id;
    const result = await this.service.getMyPromos(organizerId);
    this.sendSuccess(res, result);
  };

  update = async (req: Request, res: Response) => {
    const organizerId = req.user!.id;
    const { id } = req.params;
    const result = await this.service.update(id, organizerId, req.body);
    this.sendSuccess(res, result, "Promo updated");
  };

  deletePromo = async (req: Request, res: Response) => {
    const organizerId = req.user!.id;
    const { id } = req.params;
    const result = await this.service.softDelete(id, organizerId);
    this.sendSuccess(res, result, "Promo deleted");
  };
}
