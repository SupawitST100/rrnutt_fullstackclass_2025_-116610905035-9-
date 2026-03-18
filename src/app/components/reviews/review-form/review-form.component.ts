import {
  Component, OnInit, OnDestroy, inject, signal, computed
} from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ReviewService } from '../../../services/review.service';
import { CustomerService } from '../../../services/customer.service';
import { BookingService } from '../../../services/booking.service';
import { AuthService } from '../../../services/auth.service';
import { CreateReviewDto } from '../../../models/review.model';
import { Customer } from '../../../models/customer.model';
import { Booking } from '../../../models/booking.model';

@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [CommonModule, FormsModule, TitleCasePipe],
  templateUrl: './review-form.component.html',
  styleUrl: './review-form.component.css',
})
export class ReviewFormComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  private reviewService   = inject(ReviewService);
  private customerService = inject(CustomerService);
  private bookingService  = inject(BookingService);
  private authService     = inject(AuthService);
  private router          = inject(Router);

  // ── State ─────────────────────────────────────────────────────
  customer        = signal<Customer | null>(null);
  bookings        = signal<Booking[]>([]);
  loadingProfile  = signal(true);
  profileError    = signal<string | null>(null);

  rating          = signal(0);
  hoverRating     = signal(0);
  title           = signal('');
  comment         = signal('');
  selectedTags    = signal<string[]>([]);
  selectedBooking = signal<Booking | null>(null);
  submitting      = signal(false);
  success         = signal(false);

  // ── Derived ───────────────────────────────────────────────────
  customerName = computed(() => {
    const c = this.customer();
    return c ? `${c.firstName} ${c.lastName}` : '';
  });

  availableBookings = computed(() =>
    this.bookings().filter((b) => !b.reviewed)
  );

  readonly availableTags = [
    'beach', 'family-friendly', 'romantic', 'luxury', 'budget',
    'city-tour', 'culture', 'food', 'adventure', 'relaxing', 'great-food',
  ];

  readonly stars = [1, 2, 3, 4, 5];

  // ── Lifecycle ─────────────────────────────────────────────────
  ngOnInit(): void {
    const id = this.authService.currentCustomerId;

    forkJoin({
      customer: this.customerService.getById(id),
      bookings: this.bookingService.getByCustomer(id),
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ customer, bookings }) => {
          this.customer.set(customer);
          this.bookings.set(bookings);
          this.loadingProfile.set(false);
        },
        error: (err: Error) => {
          this.profileError.set(err.message);
          this.loadingProfile.set(false);
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ── Helpers ───────────────────────────────────────────────────
  getInitials(): string {
    return this.customerName()
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  getTierIcon(): string {
    const icons: Record<string, string> = {
      bronze: '🥉', silver: '🥈', gold: '🥇', platinum: '💎',
    };
    return icons[this.customer()?.tier ?? ''] ?? '';
  }

  selectBooking(booking: Booking): void {
    this.selectedBooking.set(booking);
  }

  clearBooking(): void {
    this.selectedBooking.set(null);
  }

  setRating(star: number): void { this.rating.set(star); }
  setHover(star: number): void  { this.hoverRating.set(star); }
  clearHover(): void            { this.hoverRating.set(0); }

  isStarFilled(star: number): boolean {
    return star <= (this.hoverRating() || this.rating());
  }

  getRatingLabel(): string {
    const val = this.hoverRating() || this.rating();
    const labels: Record<number, string> = {
      1: 'Poor', 2: 'Fair', 3: 'Good', 4: 'Very Good', 5: 'Excellent',
    };
    return labels[val] || 'Select rating';
  }

  toggleTag(tag: string): void {
    const current = this.selectedTags();
    const i = current.indexOf(tag);
    this.selectedTags.set(
      i === -1 ? [...current, tag] : current.filter((t) => t !== tag)
    );
  }

  isTagSelected(tag: string): boolean {
    return this.selectedTags().includes(tag);
  }

  isFormValid(): boolean {
    return (
      !!this.customer() &&
      this.rating() > 0 &&
      !!this.selectedBooking() &&
      this.title().trim().length >= 5 &&
      this.comment().trim().length >= 20
    );
  }

  onSubmit(): void {
    if (!this.isFormValid()) return;
    this.submitting.set(true);

    const booking = this.selectedBooking()!;
    const cust    = this.customer()!;

    const dto: CreateReviewDto = {
      customerId:      cust.id,
      customerName:    `${cust.firstName} ${cust.lastName}`,
      destinationId:   booking.destinationId,
      destinationName: `${booking.destinationName}, ${booking.destinationCountry}`,
      bookingId:       booking.id,
      rating:          this.rating(),
      title:           this.title(),
      comment:         this.comment(),
      tags:            this.selectedTags(),
    };

    this.reviewService.create(dto)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.bookingService.markReviewed(booking.id);
          this.submitting.set(false);
          this.success.set(true);
          this.rating.set(0);
          this.title.set('');
          this.comment.set('');
          this.selectedTags.set([]);
          this.selectedBooking.set(null);
          setTimeout(() => {
            this.success.set(false);
            this.router.navigate(['/reviews']);
          }, 1800);
        },
        error: () => {
          this.submitting.set(false);
        },
      });
  }
}
