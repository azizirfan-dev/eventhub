import { NextFunction, Request, Response } from "express";
import { BaseController } from "../../core/base.controller";
import { EventService } from "./event.service";
import {
  CreateEventDTO,
  UpdateEventDTO,
  CreateTicketDTO,
  UpdateTicketDTO,
  DiscoverEventQuery
} from "./event.dto";

export class EventController extends BaseController {
  private eventService: EventService;

  constructor() {
    super();
    this.eventService = new EventService();
  }

 createEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bannerUrl = (req as any).file?.path || null;

    const payload = {
      ...req.body,
      totalSeats: parseInt(req.body.totalSeats),
      availableSeats: parseInt(req.body.totalSeats), // awalnya = total
      price: parseInt(req.body.price),
      isPaid: req.body.isPaid === "true" || req.body.isPaid === true,
      startDate: new Date(req.body.startDate),
      endDate: new Date(req.body.endDate),
      bannerUrl,
    };

    const result = await this.eventService.createEvent(req.user!.id, payload);

    return this.sendSuccess(res, result, "Event created");
  } catch (error) {
    next(error);
  }
};

  getMyEvents = async (req: Request, res: Response, next: NextFunction) => {
  const { page = 1, limit = 10 } = req.query;
  const result = await this.eventService.getOrganizerEvents(
    req.user!.id,
    Number(page),
    Number(limit)
  );
  return this.sendSuccess(res, result, "My events loaded");
};


  getEventDetail = async (req: Request, res: Response, next: NextFunction) => {
    const { id: eventId } = req.params;
    const result = await this.eventService.getEventDetail(eventId);
    return this.sendSuccess(res, result);
  };

  updateEvent = async (req: Request, res: Response, next: NextFunction) => {
    const { id: eventId } = req.params;
    const payload = req.body as UpdateEventDTO;
    const result = await this.eventService.updateEvent(eventId, req.user!.id, payload);
    return this.sendSuccess(res, result, "Event updated");
  };

  deleteEvent = async (req: Request, res: Response, next: NextFunction) => {
    const { id: eventId } = req.params;
    const result = await this.eventService.deleteEvent(eventId, req.user!.id);
    return this.sendSuccess(res, result, "Event deleted");
  };

  createTicket = async (req: Request, res: Response, next: NextFunction) => {
    const { eventId } = req.params;
    const payload = req.body as CreateTicketDTO;
    const result = await this.eventService.createTicket(eventId, req.user!.id, payload);
    return this.sendSuccess(res, result, "Ticket created");
  };

  updateTicket = async (req: Request, res: Response, next: NextFunction) => {
    const { ticketId } = req.params;
    const payload = req.body as UpdateTicketDTO;
    const result = await this.eventService.updateTicket(ticketId, req.user!.id, payload);
    return this.sendSuccess(res, result, "Ticket updated");
  };

  deleteTicket = async (req: Request, res: Response, next: NextFunction) => {
    const { ticketId } = req.params;
    const result = await this.eventService.deleteTicket(ticketId, req.user!.id);
    return this.sendSuccess(res, result, "Ticket deleted");
  };

  discoverEvents = async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query as unknown as DiscoverEventQuery;
    const result = await this.eventService.discoverEvents(query);
    return this.sendSuccess(res, result, "Events discovered");
  };

  getAttendees = async (req: Request, res: Response, next: NextFunction) => {
    const { eventId } = req.params;
    const result = await this.eventService.getEventAttendees(eventId, req.user!.id);
    return this.sendSuccess(res, result, "Attendees loaded");
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    const { cursor, limit } = req.query;
    const result = await this.eventService.listEvents(
      cursor ? String(cursor) : undefined,
      Number(limit) || 10
    );
    return this.sendSuccess(res, result);
  };
}
