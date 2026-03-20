import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Customer } from '../../models/customer.model';
import { Booking } from '../../models/booking.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  api = inject(ApiService);
  auth = inject(AuthService);
  customer = signal<Customer | null>(null);
  bookings = signal<Booking[]>([]);
  loading = signal(true);
  editing = false;
  form: Partial<Customer> = {};
  saving = false;

  ngOnInit() {
    const id = this.auth.currentCustomerId;
    if (!id) return;
    this.api.getCustomer(id).subscribe({
      next: (c) => { this.customer.set(c); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
    this.api.getMyBookings().subscribe(b => this.bookings.set(b));
  }

  startEdit() { this.form = { ...this.customer()! }; this.editing = true; }

  save() {
    this.saving = true;
    this.api.updateCustomer(this.customer()!.id, this.form).subscribe({
      next: (c) => { this.customer.set(c); this.editing = false; this.saving = false; },
      error: () => this.saving = false
    });
  }

  statusClass(s: string) {
    return { Pending: 'status-pending', Paid: 'status-paid', Cancelled: 'status-cancelled' }[s] || '';
  }
}