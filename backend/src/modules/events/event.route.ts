import { Router } from "express";
import { EventController } from "./event.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { createEventValidator } from "../../validators/event.validator";
import { uploadCloud, cloudinaryUploader } from "../../middlewares/upload.middleware";

const router = Router();
const eventController = new EventController();

router.get("/", eventController.discoverEvents);
router.get("/me", authMiddleware, eventController.getMyEvents);
router.get("/:id", eventController.getEventDetail);

router.post(
  "/",
  authMiddleware,
  uploadCloud.single("banner"), 
  cloudinaryUploader,           
  createEventValidator,
  eventController.createEvent
);

router.put("/:id", authMiddleware, eventController.updateEvent);
router.delete("/:id", authMiddleware, eventController.deleteEvent);

router.post("/:eventId/tickets", authMiddleware, eventController.createTicket);
router.put("/tickets/:ticketId", authMiddleware, eventController.updateTicket);
router.delete("/tickets/:ticketId", authMiddleware, eventController.deleteTicket);

router.get("/:eventId/attendees", authMiddleware, eventController.getAttendees);


export default router;
