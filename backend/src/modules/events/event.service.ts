import { BaseService } from "../../core/base.service";
import { AppError } from "../../utils/app-error";
import {
  CreateEventDTO,
  UpdateEventDTO,
  CreateTicketDTO,
  UpdateTicketDTO,
  DiscoverEventQuery
} from "./event.dto";

export class EventService extends BaseService {

  async createEvent(userId: string, data: CreateEventDTO) {
    const {
      title,
      description,
      category,
      location,
      startDate,
      endDate,
      totalSeats,
      price,
      isPaid,
    } = data;

    return await this.prisma.event.create({
      data: {
        title,
        description,
        category,
        location,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        totalSeats,
        availableSeats: totalSeats,
        price,
        isPaid,
        organizerId: userId,
      },
    });
  }

  async getOrganizerEvents(userId: string) {
    return await this.prisma.event.findMany({
      where: { organizerId: userId, deletedAt: null },
      orderBy: { createdAt: "desc" },
    });
  }

  async getEventDetail(eventId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId, deletedAt: null },
      include: {
        organizer: { select: { id: true, name: true, email: true } },
        organizerProfile: { select: { rating: true } },
        ticketTypes: true,
        reviews: {
          include: { user: { select: { id: true, name: true } } },
          take: 3,
          orderBy: { createdAt: "desc" },
        },
        _count: { select: { reviews: true } }
      }
    });

    if (!event) throw new AppError("Event not found", 404);

    const avgRating = event._count.reviews
      ? event.reviews.reduce((acc, r) => acc + r.rating, 0) / event._count.reviews
      : 0;

    return {
      ...event,
      avgRating: Math.round(avgRating * 10) / 10,
    };
  }

  async updateEvent(eventId: string, organizerId: string, data: UpdateEventDTO) {
    const event = await this.prisma.event.findUnique({ where: { id: eventId } });
    if (!event) throw new AppError("Event not found", 404);
    if (event.organizerId !== organizerId)
      throw new AppError("Forbidden - you are not the organizer", 403);

    return await this.prisma.event.update({
      where: { id: eventId },
      data,
    });
  }

  async deleteEvent(eventId: string, organizerId: string) {
    const event = await this.prisma.event.findUnique({ where: { id: eventId } });
    if (!event) throw new AppError("Event not found", 404);
    if (event.organizerId !== organizerId)
      throw new AppError("Forbidden - you are not the organizer", 403);

    return await this.prisma.event.update({
      where: { id: eventId },
      data: { deletedAt: new Date() },
    });
  }

  async createTicket(eventId: string, organizerId: string, data: CreateTicketDTO) {
    const event = await this.prisma.event.findUnique({ where: { id: eventId } });
    if (!event) throw new AppError("Event not found", 404);
    if (event.organizerId !== organizerId)
      throw new AppError("Forbidden", 403);

    return await this.prisma.ticketType.create({
      data: {
        eventId,
        name: data.name,
        price: data.price,
        stock: data.stock,
      },
    });
  }

  async updateTicket(ticketId: string, organizerId: string, data: UpdateTicketDTO) {
    const ticket = await this.prisma.ticketType.findUnique({
      where: { id: ticketId },
      include: { event: true },
    });
    if (!ticket) throw new AppError("Ticket not found", 404);
    if (ticket.event.organizerId !== organizerId)
      throw new AppError("Forbidden", 403);

    return await this.prisma.ticketType.update({
      where: { id: ticketId },
      data,
    });
  }

  async deleteTicket(ticketId: string, organizerId: string) {
    const ticket = await this.prisma.ticketType.findUnique({
      where: { id: ticketId },
      include: { event: true },
    });
    if (!ticket) throw new AppError("Ticket not found", 404);
    if (ticket.event.organizerId !== organizerId)
      throw new AppError("Forbidden", 403);

    return await this.prisma.ticketType.update({
      where: { id: ticketId },
      data: { deletedAt: new Date() },
    });
  }

  async discoverEvents(query: DiscoverEventQuery) {
    const {
      search,
      category,
      location,
      minPrice,
      maxPrice,
      startDate,
      endDate,
      sort = "latest",
      page = 1,
      limit = 10,
    } = query;

    const where: any = {
      deletedAt: null,
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { category: { contains: search, mode: "insensitive" } },
          { location: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(category && { category }),
      ...(location && { location }),
      ...((minPrice || maxPrice) && {
        price: {
          ...(minPrice && { gte: minPrice }),
          ...(maxPrice && { lte: maxPrice }),
        },
      }),
      ...((startDate || endDate) && {
        startDate: {
          ...(startDate && { gte: new Date(startDate) }),
          ...(endDate && { lte: new Date(endDate) }),
        },
      }),
    };

    const sortOptions: Record<string, any> = {
      latest: { createdAt: "desc" },
      oldest: { createdAt: "asc" },
      price_asc: { price: "asc" },
      price_desc: { price: "desc" },
    };

    const events = await this.prisma.event.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: sortOptions[sort] || sortOptions.latest,
      include: {
        organizerProfile: { select: { rating: true } },
        reviews: true,
      },
    });

    const total = await this.prisma.event.count({ where });

    return {
      events,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
  async getEventAttendees(eventId: string, organizerId: string) {
  const event = await this.prisma.event.findUnique({
    where: { id: eventId }
  });

  if (!event) throw new AppError("Event not found", 404);
  if (event.organizerId !== organizerId)
    throw new AppError("Forbidden", 403);

  const attendees = await this.prisma.transactionItem.findMany({
    where: {
      eventId,
      transaction: { status: "DONE" }
    },
    include: {
      transaction: {
        include: {
          user: { select: { name: true, email: true } }
        }
      },
      ticketType: true
    }
  });

  return attendees.map((item) => ({
    buyerName: item.transaction.user.name,
    buyerEmail: item.transaction.user.email,
    ticketType: item.ticketType?.name,
    quantity: item.quantity,
    totalPaid: item.price * item.quantity,
    status: item.transaction.status
  }));
}

async listEvents(cursor?: string, limit: number = 10) {
  const events = await this.prisma.event.findMany({
    where: { deletedAt: null },
    take: limit + 1,
    ...(cursor && { skip: 1, cursor: { id: cursor } }),
    orderBy: { createdAt: "desc" }
  });

  let nextCursor: string | null = null;
  if (events.length > limit) {
    const next = events.pop();
    nextCursor = next?.id ?? null;
  }

  return {
    data: events,
    nextCursor
  };
}

}
