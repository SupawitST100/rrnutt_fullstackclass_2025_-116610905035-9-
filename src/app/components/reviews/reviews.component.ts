import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Review } from '../../models/review.model';
import { TourPackage } from '../../models/package.model';
import { Hotel } from '../../models/hotel.model';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reviews.component.html'
})
export class ReviewsComponent implements OnInit {
  api = inject(ApiService);
  auth = inject(AuthService);

  reviews = signal<Review[]>([]);
  packages = signal<TourPackage[]>([]);
  hotels = signal<Hotel[]>([]);
  loading = signal(true);
  showForm = false;
  form: any = { item_type: 'Package', item_id: '', rating: 5, comment: '' };
  hoverRating = 0;
  saving = false;
  error = '';

  ngOnInit() {
    this.load();
    this.api.getPackages().subscribe(p => this.packages.set(p));
    this.api.getHotels().subscribe(h => this.hotels.set(h));
  }

  load() {
    this.loading.set(true);
    this.api.getReviews().subscribe({
      next: (r) => { this.reviews.set(r); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  // เมื่อเปลี่ยน item_type ให้ reset item_id
  onTypeChange() {
    this.form.item_id = '';
  }

  // dropdown options ตาม type ที่เลือก
  get itemOptions() {
    if (this.form.item_type === 'Package') {
      return this.packages().map(p => ({ id: p.id, label: p.title }));
    }
    return this.hotels().map(h => ({ id: h.id, label: h.name }));
  }

  stars(n: number) { return Array.from({ length: 5 }, (_, i) => i < n); }

  submit() {
    if (!this.form.item_id) { this.error = 'กรุณาเลือกรายการ'; return; }
    this.saving = true;
    this.api.createReview({ ...this.form, customer_id: this.auth.currentCustomerId }).subscribe({
      next: () => {
        this.load();
        this.showForm = false;
        this.saving = false;
        this.form = { item_type: 'Package', item_id: '', rating: 5, comment: '' };
        this.error = '';
      },
      error: (e) => { this.error = e.error?.message || 'บันทึกไม่สำเร็จ'; this.saving = false; }
    });
  }

  delete(id: number) {
    if (!confirm('ต้องการลบรีวิวนี้?')) return;
    this.api.deleteReview(id).subscribe(() => this.load());
  }


}