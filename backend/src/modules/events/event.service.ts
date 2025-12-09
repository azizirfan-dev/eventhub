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
      bannerUrl,
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
        bannerUrl,
        organizerId: userId,
      },
    });
  }

  async getOrganizerEvents(userId: string, page = 1, limit = 10) {
  const parsedPage = Number(page) || 1;
  const parsedLimit = Number(limit) || 10;

  const events = await this.prisma.event.findMany({
    where: { organizerId: userId, deletedAt: null },
    skip: (parsedPage - 1) * parsedLimit,
    take: parsedLimit,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      category: true,
      location: true,
      startDate: true,
      endDate: true,
      price: true,
      isPaid: true,
      bannerUrl: true,
    },
  });

  const total = await this.prisma.event.count({
    where: { organizerId: userId, deletedAt: null },
  });

  return {
    events,
    pagination: {
      page: parsedPage,
      limit: parsedLimit,
      totalPages: Math.ceil(total / parsedLimit),
    },
  };
}


  async getEventDetail(eventId: string) {
  const event = await this.prisma.event.findFirst({
    where: {
      id: eventId,
      deletedAt: null,
    },
    select: {
      id: true,
      title: true,
      description: true,
      category: true,
      location: true,
      startDate: true,
      endDate: true,
      totalSeats: true,
      availableSeats: true,
      price: true,
      isPaid: true,
      bannerUrl: true, // 🚀 IMPORTANT FIX!
      createdAt: true,
      organizer: { select: { id: true, name: true, email: true } },
      organizerProfile: { select: { rating: true } },
      ticketTypes: {
        select: {
          id: true,
          name: true,
          price: true,
          stock: true,
        },
      },
      reviews: {
        select: {
          id: true,
          rating: true,
          comment: true,
          createdAt: true,
          user: { select: { id: true, name: true } },
        },
        take: 3,
        orderBy: { createdAt: "desc" },
      },
      _count: { select: { reviews: true } },
    },
  });

  if (!event) throw new AppError("Event not found", 404);

  const avgRating =
    event._count.reviews > 0
      ? event.reviews.reduce((acc, r) => acc + r.rating, 0) /
        event._count.reviews
      : 0;

  return {
    ...event,
    avgRating: Math.round(avgRating * 10) / 10,
  };
}



 async updateEvent(eventId: string, organizerId: string, data: UpdateEventDTO) {
  const event = await this.prisma.event.findUnique({
    where: { id: eventId }
  });

  if (!event) throw new AppError("Event not found", 404);
  if (event.organizerId !== organizerId)
    throw new AppError("Forbidden - you are not the organizer", 403);

  const updatedData: any = {};

  if (data.title !== undefined) updatedData.title = data.title;
  if (data.description !== undefined) updatedData.description = data.description;
  if (data.category !== undefined) updatedData.category = data.category;
  if (data.location !== undefined) updatedData.location = data.location;

  if (data.startDate) {
    updatedData.startDate = new Date(data.startDate);
  }
  if (data.endDate) {
    updatedData.endDate = new Date(data.endDate);
  }

  if (typeof data.price === "number") {
    updatedData.price = data.price;
  }

  if (typeof data.isPaid === "boolean") {
    updatedData.isPaid = data.isPaid;
  }

  if (typeof data.totalSeats === "number") {
    updatedData.totalSeats = data.totalSeats;

    // Adjust available seats if totalSeats changes
    const seatDiff = data.totalSeats - event.totalSeats;
    updatedData.availableSeats = event.availableSeats + seatDiff;
  }

  if (data.bannerUrl !== undefined) {
    updatedData.bannerUrl = data.bannerUrl;
  }

  const result = await this.prisma.event.update({
    where: { id: eventId },
    data: updatedData,
  });

  return result;
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

    const parsedPage = Number(page) || 1;
    const parsedLimit = Number(limit) || 10;

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
      skip: (parsedPage - 1) * parsedLimit,
      take: parsedLimit,
      orderBy: sortOptions[sort] || sortOptions.latest,
      select: {
        id: true,
        title: true,
        category: true,
        location: true,
        startDate: true,
        endDate: true,
        price: true,
        isPaid: true,
        bannerUrl: true,
        organizerProfile: {
          select: { rating: true }
        },
        reviews: true,
      }
    });

    const total = await this.prisma.event.count({ where });

    return {
      events,
      pagination: {
        page: parsedPage,
        limit: parsedLimit,
        totalPages: Math.ceil(total / parsedLimit),
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
