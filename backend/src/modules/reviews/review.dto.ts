export interface CreateReviewDTO {
  eventId: string;
  rating: number; // 1-5
  comment: string;
}

export interface UpdateReviewDTO {
  rating?: number;
  comment?: string;
}
