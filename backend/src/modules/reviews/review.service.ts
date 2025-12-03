import { BaseService } from "../../core/base.service";
import { AppError } from "../../utils/app-error";
import { CreateReviewDTO, UpdateReviewDTO } from "./review.dto";

export class ReviewService extends BaseService {

    async createReview(userId: string, data: CreateReviewDTO) {
        const { eventId, rating, comment } = data;

        if (rating < 1 || rating > 5)
            throw new AppError("Rating must be between 1 and 5", 400);

        const trx = await this.prisma.transactionItem.findFirst({
            where: {
                eventId,
                transaction: { userId, status: "DONE" }
            }
        });
        if (!trx)
            throw new AppError("You can only review events you attended", 403);

        const exists = await this.prisma.review.findFirst({
            where: { userId, eventId, deletedAt: null }
        });
        if (exists)
            throw new AppError("You already reviewed this event", 400);

        await this.prisma.review.create({
            data: { userId, eventId, rating, comment }
        });

        await this.updateOrganizerRating(eventId);
        return { message: "Review created" };
    }


    async getEventReviews(eventId: string) {
        return await this.prisma.review.findMany({
            where: { eventId, deletedAt: null },
            include: {
                user: { select: { id: true, name: true } }
            },
            orderBy: { createdAt: "desc" }
        });
    }


    async updateReview(userId: string, id: string, data: UpdateReviewDTO) {
        const review = await this.prisma.review.findUnique({ where: { id } });
        if (!review || review.deletedAt)
            throw new AppError("Review not found", 404);

        if (review.userId !== userId)
            throw new AppError("Not your review", 403);

        await this.prisma.review.update({
            where: { id },
            data
        });

        await this.updateOrganizerRating(review.eventId);
        return { message: "Review updated" };
    }


    async deleteReview(userId: string, id: string) {
        const review = await this.prisma.review.findUnique({ where: { id } });
        if (!review || review.deletedAt)
            throw new AppError("Review not found", 404);

        if (review.userId !== userId)
            throw new AppError("Not your review", 403);

        await this.prisma.review.update({
            where: { id },
            data: { deletedAt: new Date() }
        });

        await this.updateOrganizerRating(review.eventId);
        return { message: "Review deleted" };
    }


    private async updateOrganizerRating(eventId: string) {
        const event = await this.prisma.event.findUnique({
            where: { id: eventId },
            select: {
                organizerProfileId: true,
            },
        });

        if (!event?.organizerProfileId) {
            return;
        }
        const reviews = await this.prisma.review.findMany({
            where: { eventId, deletedAt: null },
        });

        if (reviews.length === 0) {
            await this.prisma.organizerProfile.update({
                where: { id: event.organizerProfileId },
                data: { rating: 0 },
            });
            return;
        }

        const avg =
            reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

        await this.prisma.organizerProfile.update({
            where: { id: event.organizerProfileId },
            data: { rating: Number(avg.toFixed(1)) },
        });
    }
}
