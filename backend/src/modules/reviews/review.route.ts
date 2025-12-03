import { Router } from "express";
import { ReviewController } from "./review.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();
const controller = new ReviewController();

router.post("/", authMiddleware, controller.createReview);
router.get("/event/:eventId", controller.getEventReviews);
router.patch("/:id", authMiddleware, controller.updateReview);
router.delete("/:id", authMiddleware, controller.deleteReview);

export default router;
