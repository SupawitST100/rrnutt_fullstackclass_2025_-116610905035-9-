import { Injectable } from '@angular/core';
<<<<<<< HEAD

@Injectable({ providedIn: 'root' })
export class ReviewService {}
=======
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Review, ReviewStats, CreateReviewDto } from '../models/review.model';

const FAKE_REVIEWS: Review[] = [
  {
    id: 'r001',
    customerId: 'c001',
    customerName: 'Somchai Jaidee',
    destinationId: 'd001',
    destinationName: 'Bali, Indonesia',
    bookingId: 'b001',
    rating: 5,
    title: 'Amazing experience, highly recommend!',
    comment: 'Everything was perfect from start to finish. The resort was beautiful, staff were incredibly friendly, and the food was outstanding. Will definitely come back!',
    tags: ['beach', 'family-friendly', 'great-food'],
    travelDate: new Date('2024-08-10'),
    createdAt: new Date('2024-08-20'),
    helpful: 24,
    verified: true,
    response: {
      message: 'Thank you so much for your kind words! We hope to welcome you back soon.',
      respondedAt: new Date('2024-08-21'),
    },
  },
  {
    id: 'r002',
    customerId: 'c002',
    customerName: 'Nattaya Wongkham',
    destinationId: 'd002',
    destinationName: 'Tokyo, Japan',
    bookingId: 'b002',
    rating: 4,
    title: 'Great trip, minor issues with hotel',
    comment: 'Tokyo is an incredible city. The tour guide was knowledgeable and friendly. The hotel room was slightly smaller than expected, but overall a wonderful experience.',
    tags: ['culture', 'city-tour', 'food'],
    travelDate: new Date('2024-09-05'),
    createdAt: new Date('2024-09-15'),
    helpful: 12,
    verified: true,
  },
  {
    id: 'r003',
    customerId: 'c003',
    customerName: 'James Anderson',
    destinationId: 'd003',
    destinationName: 'Santorini, Greece',
    bookingId: 'b003',
    rating: 5,
    title: 'Honeymoon paradise!',
    comment: 'Santorini exceeded all our expectations. The sunset views from Oia were breathtaking. The private villa was luxurious and the staff went above and beyond.',
    tags: ['romantic', 'luxury', 'honeymoon', 'sunset'],
    travelDate: new Date('2024-07-20'),
    createdAt: new Date('2024-07-30'),
    helpful: 45,
    verified: true,
  },
];

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private reviews: Review[] = [...FAKE_REVIEWS];
  /** Tracks which review IDs the current session has already voted on */
  private votedIds = new Set<string>();

  getAll(): Observable<Review[]> {
    return of([...this.reviews]).pipe(delay(300));
  }

  getByDestination(destinationId: string): Observable<Review[]> {
    return of(this.reviews.filter((r) => r.destinationId === destinationId)).pipe(delay(300));
  }

  getByCustomer(customerId: string): Observable<Review[]> {
    return of(this.reviews.filter((r) => r.customerId === customerId)).pipe(delay(300));
  }

  getById(id: string): Observable<Review> {
    const review = this.reviews.find((r) => r.id === id);
    if (!review) return throwError(() => new Error(`Review ${id} not found`));
    return of({ ...review }).pipe(delay(300));
  }

  create(dto: CreateReviewDto): Observable<Review> {
    const newReview: Review = {
      ...dto,
      id: `r${Date.now()}`,
      customerName: dto.customerName,
      destinationName: dto.destinationName,
      travelDate: new Date(),
      createdAt: new Date(),
      helpful: 0,
      verified: false,
      tags: dto.tags ?? [],
    };
    this.reviews.push(newReview);
    return of(newReview).pipe(delay(300));
  }

  hasVoted(id: string): boolean {
    return this.votedIds.has(id);
  }

  markHelpful(id: string): Observable<Review> {
    if (this.votedIds.has(id))
      return throwError(() => new Error('Already voted'));
    const index = this.reviews.findIndex((r) => r.id === id);
    if (index === -1) return throwError(() => new Error(`Review ${id} not found`));
    this.votedIds.add(id);
    this.reviews[index] = { ...this.reviews[index], helpful: this.reviews[index].helpful + 1 };
    return of({ ...this.reviews[index] }).pipe(delay(300));
  }

  getStats(destinationId: string): Observable<ReviewStats> {
    const filtered = this.reviews.filter((r) => r.destinationId === destinationId);
    const total = filtered.length;
    const breakdown: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let sum = 0;
    filtered.forEach((r) => { sum += r.rating; breakdown[r.rating] = (breakdown[r.rating] || 0) + 1; });
    return of({ averageRating: total > 0 ? sum / total : 0, totalReviews: total, ratingBreakdown: breakdown }).pipe(delay(300));
  }
}
>>>>>>> cdfeec59ca7a141783b903c3730bcec6a04e3ce3
