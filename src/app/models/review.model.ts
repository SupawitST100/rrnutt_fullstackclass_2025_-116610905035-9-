export interface ReviewResponse {
  message: string;
  respondedAt: Date;
}

export interface Review {
  id: string;
  customerId: string;
  customerName: string;
  customerAvatar?: string;
  destinationId: string;
  destinationName: string;
  bookingId: string;
  rating: number; // 1-5
  title: string;
  comment: string;
  tags: string[];
  travelDate: Date;
  createdAt: Date;
  helpful: number;
  photos?: string[];
  verified: boolean;
  response?: ReviewResponse;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingBreakdown: { [key: number]: number };
}

export interface CreateReviewDto {
  customerId: string;
  customerName: string;
  destinationId: string;
  destinationName: string;
  bookingId: string;
  rating: number;
  title: string;
  comment: string;
  tags?: string[];
  photos?: string[];
}