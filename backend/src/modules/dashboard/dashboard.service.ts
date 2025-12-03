import { BaseService } from "../../core/base.service";
import { AppError } from "../../utils/app-error";

export class DashboardService extends BaseService {

  async getOrganizerDashboard(organizerId: string) {

    // Organizer harus ada profile rating
    const profile = await this.prisma.organizerProfile.findUnique({
      where: { userId: organizerId },
      select: { rating: true }
    });

    if (!profile) throw new AppError("Organizer profile not found", 404);

    const totalEvents = await this.prisma.event.count({
      where: { organizerId, deletedAt: null }
    });

    const revenueData = await this.prisma.transaction.aggregate({
      where: {
        items: { some: { event: { organizerId } } },
        status: "DONE"
      },
      _sum: { totalAmount: true }
    });

    const totalRevenue = revenueData._sum.totalAmount ?? 0;

    const attendeesData = await this.prisma.transactionItem.aggregate({
      where: {
        event: { organizerId },
        transaction: { status: "DONE" }
      },
      _sum: { quantity: true }
    });

    const totalAttendees = attendeesData._sum.quantity ?? 0;

    const topEvents = await this.prisma.transactionItem.groupBy({
      by: ["eventId"],
      _sum: { quantity: true },
      where: {
        transaction: { status: "DONE" },
        event: { organizerId }
      }
    });

    const formattedTopEvents = await Promise.all(
      topEvents.map(async (e) => {
        const event = await this.prisma.event.findUnique({
          where: { id: e.eventId },
          select: { title: true }
        });

        return {
          eventId: e.eventId,
          title: event?.title ?? "Unknown Event",
          ticketsSold: e._sum.quantity || 0
        };
      })
    );
    
    const last30DaysTrend = await this.prisma.$queryRaw<
      { date: string; revenue: number }[]
    >`
      SELECT 
        DATE("createdAt") as date,
        SUM("totalAmount") as revenue
      FROM "Transaction"
      WHERE "status" = 'DONE'
      AND "createdAt" >= NOW() - INTERVAL '30 days'
      GROUP BY DATE("createdAt")
      ORDER BY DATE("createdAt")
    `;

    return {
      totalEvents,
      totalRevenue,
      totalAttendees,
      avgRating: profile.rating,
      topEvents,
      salesTrend: last30DaysTrend
    };
  }
}
