export interface CreateEventDTO {
  title: string;
  description: string;
  category: string;
  location: string;
  startDate: string; // ISO from frontend
  endDate: string;
  totalSeats: number;
  price: number;
  isPaid: boolean;
  bannerUrl: string;
}

export interface UpdateEventDTO {
  title?: string;
  description?: string;
  category?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  totalSeats?: number;
  price?: number;
  isPaid?: boolean;
  bannerUrl?: string;
}

export interface CreateTicketDTO {
  name: string;
  price: number;
  stock: number;
}

export interface UpdateTicketDTO {
  name?: string;
  price?: number;
  stock?: number;
}

export interface DiscoverEventQuery {
  search?: string;
  category?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  startDate?: string;
  endDate?: string;
  sort?: "latest" | "oldest" | "price_asc" | "price_desc";
  page?: number;
  limit?: number;
}
