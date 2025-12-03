import { NextFunction, Request, Response } from "express";
import { BaseController } from "../../core/base.controller";
import { TransactionService } from "./transaction.service";
import { CreateTransactionDTO, UploadProofDTO } from "./transaction.dto";
import { AppError } from "../../utils/app-error";

export class TransactionController extends BaseController {
  private transactionService = new TransactionService();

  createTransaction = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.id;
    const payload = req.body as CreateTransactionDTO;
    const result = await this.transactionService.createTransaction(userId, payload);
    return this.sendSuccess(res, result, "Transaction created");
  };

  getMyTransactions = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.id;
    const result = await this.transactionService.getMyTransactions(userId);
    return this.sendSuccess(res, result);
  };

  uploadProof = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.id;
    const { id: transactionId } = req.params;

    const imageUrls = req.cloudinaryUrls;

    if (!imageUrls || imageUrls.length === 0) {
      return next(new AppError("No image uploaded", 400));
    }

    const result = await this.transactionService.uploadProof(
      userId,
      transactionId,
      imageUrls
    );

    return this.sendSuccess(res, result, "Payment proof uploaded");
  };



  approveTransaction = async (req: Request, res: Response, next: NextFunction) => {
    const organizerId = req.user!.id;
    const { id: transactionId } = req.params;
    const result = await this.transactionService.approveTransaction(transactionId, organizerId);
    return this.sendSuccess(res, result, "Transaction approved");
  };

  rejectTransaction = async (req: Request, res: Response, next: NextFunction) => {
    const organizerId = req.user!.id;
    const { id: transactionId } = req.params;
    const result = await this.transactionService.rejectTransaction(transactionId, organizerId);
    return this.sendSuccess(res, result, "Transaction rejected");
  };

  cancelTransaction = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.id;
    const { id: transactionId } = req.params;
    const result = await this.transactionService.cancelTransaction(transactionId, userId);
    return this.sendSuccess(res, result, "Transaction canceled");
  };

  applyPromo = async (req: Request, res: Response) => {
    return this.sendSuccess(res, { promo: req.promo }, "Promo applied");
  };
}