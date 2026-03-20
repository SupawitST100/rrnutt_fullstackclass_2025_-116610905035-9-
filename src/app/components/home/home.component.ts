import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { Destination } from '../../models/destination.model';
import { TourPackage } from '../../models/package.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  auth = inject(AuthService);
  api = inject(ApiService);

  destinations = signal<Destination[]>([]);
  packages = signal<TourPackage[]>([]);

  ngOnInit() {
    this.api.getDestinations().subscribe(d => this.destinations.set(d.slice(0, 3)));
    this.api.getPackages().subscribe(p => this.packages.set(p.slice(0, 2)));
  }
}