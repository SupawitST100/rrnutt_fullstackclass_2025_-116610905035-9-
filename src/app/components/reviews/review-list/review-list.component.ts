import { Component, OnInit, Input, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReviewService } from '../../../services/review.service';
import { Review, ReviewStats } from '../../../models/review.model';

@Component({
  selector: 'app-review-list',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './review-list.component.html',
  styleUrl: './review-list.component.css',
})
export class ReviewListComponent implements OnInit {
  @Input() destinationId?: string;
  @Input() customerId?: string;

  private reviewService = inject(ReviewService);

  reviews: Review[] = [];
  stats: ReviewStats | null = null;
  loading = true;
  sortBy: 'newest' | 'highest' | 'lowest' | 'helpful' = 'newest';
  /** Tracks voted IDs locally for instant UI feedback */
  votedIds = new Set<string>();

  readonly sortOptions = [
    { val: 'newest' as const,  label: 'Newest' },
    { val: 'highest' as const, label: 'Highest' },
    { val: 'lowest' as const,  label: 'Lowest' },
    { val: 'helpful' as const, label: 'Most Helpful' },
  ];

  readonly stars = [5, 4, 3, 2, 1];

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews(): void {
    this.loading = true;
    const obs$ = this.destinationId
      ? this.reviewService.getByDestination(this.destinationId)
      : this.customerId
      ? this.reviewService.getByCustomer(this.customerId)
      : this.reviewService.getAll();

    obs$.subscribe({ next: (data) => { this.reviews = this.sortReviews(data); this.loading = false; } });

    if (this.destinationId) {
      this.reviewService.getStats(this.destinationId).subscribe((s) => (this.stats = s));
    }
  }

  sortReviews(reviews: Review[]): Review[] {
    return [...reviews].sort((a, b) => {
      if (this.sortBy === 'newest')  return b.createdAt.getTime() - a.createdAt.getTime();
      if (this.sortBy === 'highest') return b.rating - a.rating;
      if (this.sortBy === 'lowest')  return a.rating - b.rating;
      if (this.sortBy === 'helpful') return b.helpful - a.helpful;
      return 0;
    });
  }

  onSortChange(sort: typeof this.sortBy): void {
    this.sortBy = sort;
    this.reviews = this.sortReviews(this.reviews);
  }

  onMarkHelpful(reviewId: string): void {
    if (this.votedIds.has(reviewId)) return;
    this.votedIds.add(reviewId);           // optimistic UI — disable instantly
    this.reviewService.markHelpful(reviewId).subscribe({
      next: (updated) => {
        const i = this.reviews.findIndex((r) => r.id === reviewId);
        if (i !== -1) this.reviews[i] = updated;
      },
      error: () => {
        this.votedIds.delete(reviewId);    // rollback on error
      },
    });
  }

  hasVoted(reviewId: string): boolean {
    return this.votedIds.has(reviewId);
  }

  getStarArray(): number[] {
    return [1, 2, 3, 4, 5];
  }

  isStarFilled(star: number, rating: number): boolean {
    return star <= rating;
  }

  getRatingPercent(star: number): number {
    if (!this.stats || this.stats.totalReviews === 0) return 0;
    return Math.round(((this.stats.ratingBreakdown[star] || 0) / this.stats.totalReviews) * 100);
  }

  getInitials(name: string): string {
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  }

  getAverageRating(): string {
    return this.stats ? this.stats.averageRating.toFixed(1) : '0.0';
  }
}
