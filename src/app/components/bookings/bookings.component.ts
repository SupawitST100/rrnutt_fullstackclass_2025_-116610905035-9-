import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Booking } from '../../models/booking.model';

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './bookings.component.html'
})
export class BookingsComponent implements OnInit {
  api = inject(ApiService);
  auth = inject(AuthService);

  bookings = signal<Booking[]>([]);
  loading = signal(true);
  filterStatus = '';
  showPayModal = false;
  selectedBooking: Booking | null = null;
  payMethod: 'Credit Card' | 'PromptPay' = 'Credit Card';
  paying = false;
  paySuccess = false; // หลังจ่ายสำเร็จ

  ngOnInit() { this.load(); }

  load() {
    this.loading.set(true);
    const obs = this.auth.isAdmin() ? this.api.getBookings() : this.api.getMyBookings();
    obs.subscribe({
      next: (b) => { this.bookings.set(b); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  get filtered() {
    return this.filterStatus
      ? this.bookings().filter(b => b.status === this.filterStatus)
      : this.bookings();
  }

  openPay(b: Booking) {
    this.selectedBooking = b;
    this.paySuccess = false;
    this.showPayModal = true;
  }
  closePay() { this.showPayModal = false; this.paySuccess = false; }

  confirmPay() {
    if (!this.selectedBooking) return;
    this.paying = true;
    this.api.createPayment({
      booking_id: this.selectedBooking.id,
      payment_method: this.payMethod,
      amount: this.selectedBooking.total_amount
    }).subscribe({
      next: () => {
        this.api.updateBookingStatus(this.selectedBooking!.id, 'Paid').subscribe(() => {
          this.load();
          this.paying = false;
          this.paySuccess = true; // แสดงสรุป
        });
      },
      error: () => this.paying = false
    });
  }

  cancel(id: number) {
    if (!confirm('ต้องการยกเลิกการจองนี้?')) return;
    this.api.updateBookingStatus(id, 'Cancelled').subscribe(() => this.load());
  }

  statusClass(s: string) {
    return { 'Pending': 'status-pending', 'Paid': 'status-paid', 'Cancelled': 'status-cancelled' }[s] || '';
  }
  statusIcon(s: string) {
    return { 'Pending': 'bi-clock', 'Paid': 'bi-check-circle-fill', 'Cancelled': 'bi-x-circle-fill' }[s] || '';
  }
}