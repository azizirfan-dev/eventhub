import { Router } from "express";
import { PromoController } from "./promo.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";


const router = Router();
const controller = new PromoController();

router.post("/", authMiddleware, roleMiddleware("ORGANIZER"), controller.create);
router.get("/me", authMiddleware, roleMiddleware("ORGANIZER"), controller.getMyPromos);
router.put("/:id", authMiddleware, roleMiddleware("ORGANIZER"), controller.update);
router.delete("/:id", authMiddleware, roleMiddleware("ORGANIZER"), controller.deletePromo);

export default router;
