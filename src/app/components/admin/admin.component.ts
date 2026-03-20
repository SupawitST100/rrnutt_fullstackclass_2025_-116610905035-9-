import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Customer } from '../../models/customer.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin.component.html'
})
export class AdminComponent implements OnInit {
  api = inject(ApiService);
  customers = signal<Customer[]>([]);
  stats = signal({ destinations: 0, packages: 0, bookings: 0, customers: 0 });
  loading = signal(true);

  ngOnInit() {
    this.api.getCustomers().subscribe({
      next: (c) => { this.customers.set(c); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
    this.api.getDestinations().subscribe(d => this.stats.update(s => ({ ...s, destinations: d.length })));
    this.api.getPackages().subscribe(p => this.stats.update(s => ({ ...s, packages: p.length })));
    this.api.getBookings().subscribe(b => this.stats.update(s => ({ ...s, bookings: b.length })));
  }
}