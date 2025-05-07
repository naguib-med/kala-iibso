export type Condition = 'NEW' | 'LIKE_NEW' | 'GOOD' | 'FAIR' | 'POOR';

export interface ListingFilters {
  priceMin?: number;
  priceMax?: number;
  conditions?: Condition[];
  page?: number;
  limit?: number;
}

export interface Listing {
  id: string;
  title: string;
  price: number;
  images: string[];
  condition: Condition;
  category: {
    name: string;
  } | null;
  user: {
    name: string | null;
    image: string | null;
  };
  location: string | null;
  views: number;
  createdAt: string;
}

export interface ListingsResponse {
  listings: Listing[];
  hasMore: boolean;
  total: number;
}
