import { BaseService } from "../../core/base.service";
import { AppError } from "../../utils/app-error";

export class DashboardService extends BaseService {

  async getOrganizerDashboard(organizerId: string) {
  let profile = await this.prisma.organizerProfile.findUnique({
    where: { userId: organizerId },
    select: { rating: true }
  });

  if (!profile) {
    profile = await this.prisma.organizerProfile.create({
      data: { userId: organizerId, rating: 0 }
    });
  }

  const [summary, topEvents, salesTrend] = await Promise.all([
    this.prisma.$queryRaw<
      { totalEvents: bigint; totalRevenue: bigint; totalAttendees: bigint }[]
    >`
      SELECT
        (SELECT COUNT(*) FROM "Event"
          WHERE "organizerId" = ${organizerId}
          AND "deletedAt" IS NULL) AS "totalEvents",
        (SELECT COALESCE(SUM(t."totalAmount"), 0)
          FROM "Transaction" t
          JOIN "TransactionItem" ti ON t.id = ti."transactionId"
          JOIN "Event" e ON ti."eventId" = e.id
          WHERE t."status" = 'DONE' AND e."organizerId" = ${organizerId}) AS "totalRevenue",
        (SELECT COALESCE(SUM(ti."quantity"), 0)
          FROM "TransactionItem" ti
          JOIN "Event" e ON ti."eventId" = e.id
          JOIN "Transaction" t ON ti."transactionId" = t.id
          WHERE t."status" = 'DONE' AND e."organizerId" = ${organizerId}) AS "totalAttendees"
    `,
    this.prisma.$queryRaw<
      { eventId: string; title: string; ticketsSold: number }[]
    >`
      SELECT
        e.id AS "eventId",
        e.title,
        COALESCE(SUM(ti.quantity), 0) AS "ticketsSold"
      FROM "Event" e
      LEFT JOIN "TransactionItem" ti ON e.id = ti."eventId"
      LEFT JOIN "Transaction" t ON ti."transactionId" = t.id
      WHERE e."organizerId" = ${organizerId}
      AND t."status" = 'DONE'
      GROUP BY e.id
      ORDER BY "ticketsSold" DESC
      LIMIT 5
    `,
    this.prisma.$queryRaw<
      { date: string; revenue: number }[]
    >`
      SELECT DATE(t."createdAt") as date,
             COALESCE(SUM(t."totalAmount"), 0) as revenue
      FROM "Transaction" t
      JOIN "TransactionItem" ti ON t.id = ti."transactionId"
      JOIN "Event" e ON ti."eventId" = e.id
      WHERE t."status" = 'DONE'
      AND e."organizerId" = ${organizerId}
      AND t."createdAt" >= NOW() - INTERVAL '30 days'
      GROUP BY DATE(t."createdAt")
      ORDER BY DATE(t."createdAt")
    `,
  ]);

  const s = summary[0] || {
    totalEvents: 0n,
    totalRevenue: 0n,
    totalAttendees: 0n,
  };

  return {
    totalEvents: Number(s.totalEvents),
    totalRevenue: Number(s.totalRevenue),
    totalAttendees: Number(s.totalAttendees),
    avgRating: Number(profile.rating),
    topEvents: topEvents.map(e => ({
      ...e,
      ticketsSold: Number(e.ticketsSold)
    })),
    salesTrend: salesTrend.map(d => ({
      date: d.date,
      revenue: Number(d.revenue)
    }))
  };
}
}
