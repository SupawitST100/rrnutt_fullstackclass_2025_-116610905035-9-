import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Destination } from '../../models/destination.model';

@Component({
  selector: 'app-destinations',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './destinations.component.html'
})
export class DestinationsComponent implements OnInit {
  api = inject(ApiService);
  auth = inject(AuthService);

  destinations = signal<Destination[]>([]);
  filtered = signal<Destination[]>([]);
  loading = signal(true);
  search = '';
  showForm = false;
  editItem: Destination | null = null;
  form: Partial<Destination> = {};
  saving = false;
  error = '';

  ngOnInit() { this.load(); }

  load() {
    this.loading.set(true);
    this.api.getDestinations().subscribe({
      next: (d) => { this.destinations.set(d); this.filtered.set(d); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  filter() {
    const q = this.search.toLowerCase();
    this.filtered.set(this.destinations().filter(d =>
      d.name.toLowerCase().includes(q) || d.location.toLowerCase().includes(q)
    ));
  }

  openAdd() { this.editItem = null; this.form = {}; this.showForm = true; this.error = ''; }
  openEdit(d: Destination) { this.editItem = d; this.form = { ...d }; this.showForm = true; this.error = ''; }
  closeForm() { this.showForm = false; }

  save() {
    this.saving = true;
    const obs = this.editItem
      ? this.api.updateDestination(this.editItem.id, this.form)
      : this.api.createDestination(this.form);
    obs.subscribe({
      next: () => { this.load(); this.showForm = false; this.saving = false; },
      error: (e) => { this.error = e.error?.message || 'บันทึกไม่สำเร็จ'; this.saving = false; }
    });
  }

  delete(id: number) {
    if (!confirm('ต้องการลบสถานที่นี้?')) return;
    this.api.deleteDestination(id).subscribe(() => this.load());
  }

  placeholder(name: string) {
    return `https://source.unsplash.com/400x250/?travel,${encodeURIComponent(name)}`;
  }
}
