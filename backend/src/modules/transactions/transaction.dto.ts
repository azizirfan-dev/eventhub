export interface CreateTransactionItemDTO {
  ticketTypeId: string;
  quantity: number;
}

export interface CreateTransactionDTO {
  items: CreateTransactionItemDTO[];
  promoCode?: string;
  usePoints?: number;
}

export interface UploadProofDTO {
  imageUrl: string[];
}

export interface UpdateTransactionStatusDTO {
  transactionId: string;
}

export interface GetTransactionsQuery {
  cursor?: string;
  limit?: number;
}
