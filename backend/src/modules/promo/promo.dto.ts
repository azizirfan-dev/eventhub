export interface CreatePromoDTO {
  code: string;
  discount: number;
  isPercent?: boolean;
  isGlobal?: boolean;
  eventId?: string;
  usageLimit?: number;
  description?: string;
  startDate: string;
  endDate: string;
}


export interface ApplyPromoDTO {
  code: string;
  items: { ticketTypeId: string; quantity: number }[];
}
