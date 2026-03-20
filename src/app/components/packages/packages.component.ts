import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { TourPackage } from '../../models/package.model';
import { Destination } from '../../models/destination.model';

@Component({
  selector: 'app-packages',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './packages.component.html'
})
export class PackagesComponent implements OnInit {
  api = inject(ApiService);
  auth = inject(AuthService);
  route = inject(ActivatedRoute);

  packages = signal<TourPackage[]>([]);
  filtered = signal<TourPackage[]>([]);
  destinations = signal<Destination[]>([]);
  ratings = signal<Map<number, {avg:number, count:number}>>(new Map());
  loading = signal(true);
  search = ''; filterDest = '';
  showForm = false;
  editItem: TourPackage | null = null;
  form: any = {};
  includesInput = '';
  saving = false; error = '';
  bookingPkg: TourPackage | null = null;
  bookingSuccess = false;
  booking = false;

  ngOnInit() {
    this.route.queryParams.subscribe(p => {
      this.filterDest = p['dest'] || '';
      this.load();
    });
    this.api.getDestinations().subscribe(d => this.destinations.set(d));
  }

  load() {
    this.loading.set(true);
    this.api.getPackages().subscribe({
      next: (pkgs) => {
        this.packages.set(pkgs);
        this.applyFilter();
        this.loading.set(false);
        // โหลดคะแนนเฉลี่ยของแต่ละ package
        pkgs.forEach(p => {
          this.api.getReviewAvg('Package', p.id).subscribe(r => {
            this.ratings.update(map => new Map(map).set(p.id, r));
          });
        });
      },
      error: () => this.loading.set(false)
    });
  }

  getRating(id: number) { return this.ratings().get(id); }

  applyFilter() {
    let r = this.packages();
    if (this.filterDest) r = r.filter(p => String(p.dest_id) === String(this.filterDest));
    if (this.search) r = r.filter(p => p.title.toLowerCase().includes(this.search.toLowerCase()));
    this.filtered.set(r);
  }

  openAdd() { this.editItem = null; this.form = {}; this.includesInput = ''; this.showForm = true; this.error = ''; }
  openEdit(p: TourPackage) {
    this.editItem = p; this.form = { ...p };
    this.includesInput = (p.includes || []).join(', ');
    this.showForm = true; this.error = '';
  }
  closeForm() { this.showForm = false; }

  save() {
    this.saving = true;
    this.form.includes = this.includesInput.split(',').map((s: string) => s.trim()).filter(Boolean);
    const obs = this.editItem ? this.api.updatePackage(this.editItem.id, this.form) : this.api.createPackage(this.form);
    obs.subscribe({
      next: () => { this.load(); this.showForm = false; this.saving = false; },
      error: (e: any) => { this.error = e.error?.message || 'บันทึกไม่สำเร็จ'; this.saving = false; }
    });
  }

  delete(id: number) {
    if (!confirm('ต้องการลบแพ็กเกจนี้?')) return;
    this.api.deletePackage(id).subscribe(() => this.load());
  }

  hasIncludes(pkg: TourPackage): boolean {
    return Array.isArray(pkg.includes) && pkg.includes.length > 0;
  }

  openBook(pkg: TourPackage) {
    if (!this.auth.isLoggedIn()) { window.location.href = '/login'; return; }
    this.bookingPkg = pkg; this.bookingSuccess = false;
  }

  confirmBook() {
    if (!this.bookingPkg) return;
    this.booking = true;
    this.api.createBooking({
      items: [{ item_type: 'Package', item_id: this.bookingPkg.id, quantity: 1, price_at_booking: this.bookingPkg.price }]
    }).subscribe({
      next: () => { this.bookingSuccess = true; this.booking = false; },
      error: () => this.booking = false
    });
  }

  closeBook() { this.bookingPkg = null; this.bookingSuccess = false; }
}