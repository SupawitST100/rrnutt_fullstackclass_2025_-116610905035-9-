import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Flight } from '../../models/flight.model';

@Component({
  selector: 'app-flights',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './flights.component.html'
})
export class FlightsComponent implements OnInit {
  api = inject(ApiService);
  auth = inject(AuthService);

  flights = signal<Flight[]>([]);
  filtered = signal<Flight[]>([]);
  loading = signal(true);
  filterDep = '';
  filterArr = '';
  showForm = false;
  editItem: Flight | null = null;
  form: Partial<Flight> = {};
  saving = false; error = '';
  bookingFlight: Flight | null = null;
  bookingSuccess = false;
  booking = false;

  get depOptions() {
    return [...new Set(this.flights().map(f => f.departure_loc))].sort();
  }

  get arrOptions() {
    return [...new Set(this.flights().map(f => f.arrival_loc))].sort();
  }

  ngOnInit() { this.load(); }

  load() {
    this.loading.set(true);
    this.api.getFlights().subscribe({
      next: (f) => { this.flights.set(f); this.applyFilter(); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  applyFilter() {
    this.filtered.set(this.flights().filter(f =>
      (!this.filterDep || f.departure_loc === this.filterDep) &&
      (!this.filterArr || f.arrival_loc === this.filterArr)
    ));
  }

  reset() { this.filterDep = ''; this.filterArr = ''; this.applyFilter(); }

  openAdd() { this.editItem = null; this.form = {}; this.showForm = true; this.error = ''; }
  openEdit(f: Flight) { this.editItem = f; this.form = { ...f }; this.showForm = true; this.error = ''; }
  closeForm() { this.showForm = false; }

  save() {
    this.saving = true;
    const obs = this.editItem
      ? this.api.updateFlight(this.editItem.id, this.form)
      : this.api.createFlight(this.form);
    obs.subscribe({
      next: () => { this.load(); this.showForm = false; this.saving = false; },
      error: (e: any) => { this.error = e.error?.message || 'บันทึกไม่สำเร็จ'; this.saving = false; }
    });
  }

  delete(id: number) {
    if (!confirm('ต้องการลบเที่ยวบินนี้?')) return;
    this.api.deleteFlight(id).subscribe(() => this.load());
  }

  openBook(f: Flight) {
    if (!this.auth.isLoggedIn()) { window.location.href = '/login'; return; }
    this.bookingFlight = f; this.bookingSuccess = false;
  }

  confirmBook() {
    if (!this.bookingFlight) return;
    this.booking = true;
    this.api.createBooking({
      items: [{ item_type: 'Flight', item_id: this.bookingFlight.id, quantity: 1, price_at_booking: this.bookingFlight.price }]
    }).subscribe({
      next: () => { this.bookingSuccess = true; this.booking = false; },
      error: () => this.booking = false
    });
  }

  closeBook() { this.bookingFlight = null; this.bookingSuccess = false; }
}