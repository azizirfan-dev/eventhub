import { Router } from "express";
import { TransactionController } from "./transaction.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { uploadCloud, cloudinaryUploader } from "../../middlewares/upload.middleware"

const router = Router();
const controller = new TransactionController();

router.post("/apply-promo", authMiddleware, controller.applyPromo);
router.post("/", authMiddleware, controller.createTransaction);
router.get("/me", authMiddleware, controller.getMyTransactions);
router.get("/:id", authMiddleware, controller.getTransactionDetail);
router.post(
  "/:id/upload-proof",
  authMiddleware,
  uploadCloud.array("images"),
  cloudinaryUploader,
  controller.uploadProof
);
router.get("/pending", authMiddleware, controller.getPendingTransactions);
router.patch("/:id/approve", authMiddleware, controller.approveTransaction);
router.patch("/:id/reject", authMiddleware, controller.rejectTransaction);
router.patch("/:id/cancel", authMiddleware, controller.cancelTransaction);

export default router;
