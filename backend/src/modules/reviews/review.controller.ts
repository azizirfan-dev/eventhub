import { Request, Response } from "express";
import { ReviewService } from "./review.service";
import { BaseController } from "../../core/base.controller";

export class ReviewController extends BaseController {
  private service = new ReviewService();

  createReview = async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;
      const result = await this.service.createReview(userId, req.body);
      return this.sendSuccess(res, result);
    } catch (err) {
      return this.sendError(res, err);
    }
  };

  getEventReviews = async (req: Request, res: Response) => {
    try {
      const { eventId } = req.params;
      const result = await this.service.getEventReviews(eventId);
      return this.sendSuccess(res, result);
    } catch (err) {
      return this.sendError(res, err);
    }
  };

  updateReview = async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const result = await this.service.updateReview(userId, id, req.body);
      return this.sendSuccess(res, result);
    } catch (err) {
      return this.sendError(res, err);
    }
  };

  deleteReview = async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const result = await this.service.deleteReview(userId, id);
      return this.sendSuccess(res, result);
    } catch (err) {
      return this.sendError(res, err);
    }
  };
}
