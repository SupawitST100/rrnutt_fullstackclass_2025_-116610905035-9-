import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Hotel } from '../../models/hotel.model';

@Component({
  selector: 'app-hotels',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './hotels.component.html'
})
export class HotelsComponent implements OnInit {
  api = inject(ApiService);
  auth = inject(AuthService);

  hotels = signal<Hotel[]>([]);
  filtered = signal<Hotel[]>([]);
  ratings = signal<Map<number, {avg:number, count:number}>>(new Map());
  loading = signal(true);
  search = '';
  showForm = false;
  editItem: Hotel | null = null;
  form: Partial<Hotel> = {};
  saving = false; error = '';
  bookingHotel: Hotel | null = null;
  bookingNights = 1;
  bookingSuccess = false;
  booking = false;

  ngOnInit() { this.load(); }

  load() {
    this.loading.set(true);
    this.api.getHotels().subscribe({
      next: (hotels) => {
        this.hotels.set(hotels);
        this.filtered.set(hotels);
        this.loading.set(false);
        hotels.forEach(h => {
          this.api.getReviewAvg('Hotel', h.id).subscribe(r => {
            this.ratings.update(map => new Map(map).set(h.id, r));
          });
        });
      },
      error: () => this.loading.set(false)
    });
  }

  getRating(id: number) { return this.ratings().get(id); }

  filter() {
    this.filtered.set(this.hotels().filter(h =>
      (!this.search || h.name.toLowerCase().includes(this.search.toLowerCase()) || h.location.toLowerCase().includes(this.search.toLowerCase()))
    ));
  }

  openAdd() { this.editItem = null; this.form = {}; this.showForm = true; this.error = ''; }
  openEdit(h: Hotel) { this.editItem = h; this.form = { ...h }; this.showForm = true; this.error = ''; }
  closeForm() { this.showForm = false; }

  save() {
    this.saving = true;
    const obs = this.editItem ? this.api.updateHotel(this.editItem.id, this.form) : this.api.createHotel(this.form);
    obs.subscribe({
      next: () => { this.load(); this.showForm = false; this.saving = false; },
      error: (e: any) => { this.error = e.error?.message || 'บันทึกไม่สำเร็จ'; this.saving = false; }
    });
  }

  delete(id: number) {
    if (!confirm('ต้องการลบโรงแรมนี้?')) return;
    this.api.deleteHotel(id).subscribe(() => this.load());
  }

  get totalPrice() { return (this.bookingHotel?.price_per_night || 0) * this.bookingNights; }

  openBook(h: Hotel) {
    if (!this.auth.isLoggedIn()) { window.location.href = '/login'; return; }
    this.bookingHotel = h; this.bookingNights = 1; this.bookingSuccess = false;
  }

  confirmBook() {
    if (!this.bookingHotel) return;
    this.booking = true;
    this.api.createBooking({
      items: [{ item_type: 'Hotel', item_id: this.bookingHotel.id, quantity: this.bookingNights, price_at_booking: this.bookingHotel.price_per_night }]
    }).subscribe({
      next: () => { this.bookingSuccess = true; this.booking = false; },
      error: () => this.booking = false
    });
  }

  closeBook() { this.bookingHotel = null; this.bookingSuccess = false; }
  incNights() { this.bookingNights++; }
  decNights() { if (this.bookingNights > 1) this.bookingNights--; }
}